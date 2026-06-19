/* ============================================================
   WEAR.IO — script.js (SUPABASE MIGRATION VERSION)
   Virtual Stylist Engine | Vanilla JS
   ============================================================ */

'use strict';

/* ============================================================
   1. SUPABASE INIT
   ============================================================ */
const { createClient } = supabase;
const SUPABASE_URL = 'https://nnpguxkczfemlntjdonu.supabase.co'; // Udah gw isiin sesuai screenshot lo
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucGd1eGtjemZlbWxudGpkb251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTE0MjgsImV4cCI6MjA5NTE4NzQyOH0.bQk7Ze7cms0jdjaguEJlcNzdO_COHhxKuPRE2b1t-uw'; // Cari di menu API Keys Supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================================
   2. API FETCH LAYER 
   ============================================================ */
const OUTFIT_CACHE_KEY = 'wio_outfits_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchOutfits() {
  // Check in-memory cache first (survives SPA navigation, not page refresh)
  if (window.__wioOutfitsCache && Date.now() - window.__wioOutfitsCache.ts < CACHE_TTL_MS) {
    return window.__wioOutfitsCache.data;
  }

  const { data, error } = await supabaseClient
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const normalised = data.map(normaliseOutfit);
  window.__wioOutfitsCache = { data: normalised, ts: Date.now() };
  return normalised;
}

function normaliseOutfit(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    gender: row.gender,
    suitableUndertones: row.suitable_undertones,
    suitableBodyShapes: row.suitable_body_shapes,
    suitableHeights: row.suitable_heights || [], 
    suitableTorsos: row.suitable_torsos || [],  
    dressCode: row.dress_code,
    aesthetic: row.aesthetic,
    aestheticLabel: row.aesthetic_label,
    occasionLabel: row.occasion_label,
    stylingExplanation: row.styling_explanation,
    items: row.items,
    tags: row.tags,
  };
}

/* ============================================================
   3. STATE
   ============================================================ */
const state = {
  allOutfits: [],
  filteredOutfits: [],
  selectedFilters: {
    gender: null,
    undertone: null,
    bodyShape: null,
    height: null,
    torso: null,
    occasion: null,
    aesthetic: null,
  },
  activeOutfit: null,
  favorites: [],
  isFiltered: false,
};

/* ============================================================
   4. WARDROBE PERSISTENCE (Supabase + LocalStorage Fallback)
   ============================================================ */
async function loadFavoritesFromStorage() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    try {
      const stored = localStorage.getItem('wio_favorites');
      state.favorites = stored ? JSON.parse(stored) : [];
    } catch {
      state.favorites = [];
    }
    return;
  }

  const { data, error } = await supabaseClient
    .from('user_favorites')
    .select('outfit_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('[Wear.io] Failed to load favorites:', error.message);
    state.favorites = [];
    return;
  }

  state.favorites = data.map(row => row.outfit_id);
}

function saveFavoritesToStorage() {} // No-op stub

function isFavorited(id) {
  return state.favorites.includes(id);
}

async function toggleFavorite(id) {
  const alreadySaved = isFavorited(id);

  // Optimistic local update
  if (alreadySaved) {
    state.favorites = state.favorites.filter(f => f !== id);
  } else {
    state.favorites.push(id);
  }
  
  updateWardrobeCounts();
  refreshFavButtonStates();

  // Persist to Supabase or LocalStorage
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    localStorage.setItem('wio_favorites', JSON.stringify(state.favorites));
    return;
  }

  if (alreadySaved) {
    const { error } = await supabaseClient
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('outfit_id', id);

    if (error) {
      console.error('[Wear.io] Failed to remove favorite:', error.message);
      state.favorites.push(id); // Revert
      updateWardrobeCounts();
      refreshFavButtonStates();
    }
  } else {
    const { error } = await supabaseClient
      .from('user_favorites')
      .insert({ user_id: user.id, outfit_id: id });

    if (error) {
      console.error('[Wear.io] Failed to save favorite:', error.message);
      state.favorites = state.favorites.filter(f => f !== id); // Revert
      updateWardrobeCounts();
      refreshFavButtonStates();
    }
  }
}

function updateWardrobeCounts() {
  const count = state.favorites.length;
  document.getElementById('wardrobeCount').textContent = count;
  document.getElementById('wardrobeCountMobile').textContent = count;
}

function refreshFavButtonStates() {
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    const id = btn.dataset.favId;
    btn.classList.toggle('is-saved', isFavorited(id));
    btn.textContent = isFavorited(id) ? '♥' : '♡';
  });

  if (state.activeOutfit) {
    const modalFavBtn = document.getElementById('modalFavBtn');
    if (modalFavBtn) {
      const saved = isFavorited(state.activeOutfit.id);
      modalFavBtn.classList.toggle('is-saved', saved);
      modalFavBtn.textContent = saved ? '♥ Saved to Wardrobe' : '♡ Save to Wardrobe';
    }
  }
}

/* ============================================================
   5. RENDERING — Outfit Grid
   ============================================================ */
const AESTHETIC_COLORS = {
  'clean-girl':  '#f5f5f5',
  'old-money':   '#f5e9d0',
  'gothic':      '#0a0a0a',
  'y2k':         '#ff3ea5',
  'gorpcore':    '#00e8b0',
  'streetwear':  '#ff6b1a',
  'coquette':    '#ffb3d1',
};

function getAestheticBg(aesthetic) {
  return AESTHETIC_COLORS[aesthetic] || '#f0f0f0';
}

function getAestheticTextColor(aesthetic) {
  return aesthetic === 'gothic' ? '#f5e642' : '#0a0a0a';
}

function renderOutfitCard(outfit) {
  const saved = isFavorited(outfit.id);
  const aestheticBg = getAestheticBg(outfit.aesthetic);
  const aestheticText = getAestheticTextColor(outfit.aesthetic);

  const tagsHTML = outfit.tags.slice(0, 3).map((tag, i) => {
    const cls = i === 0 ? 'tag tag--undertone' : i === 1 ? 'tag tag--shape' : 'tag';
    return `<span class="${cls}">${tag}</span>`;
  }).join('');

  const card = document.createElement('article');
  card.className = 'outfit-card';
  card.dataset.outfitId = outfit.id;
  card.innerHTML = `
    <div class="outfit-card__image">
      <img src="${outfit.image}" alt="${outfit.name}" loading="lazy" />
      <div class="outfit-card__aesthetic aesthetic--${outfit.aesthetic}"
           style="background:${aestheticBg};color:${aestheticText};">
        ${outfit.aestheticLabel}
      </div>
      <button class="outfit-card__fav ${saved ? 'is-saved' : ''}"
              data-fav-id="${outfit.id}"
              aria-label="${saved ? 'Remove from wardrobe' : 'Save to wardrobe'}">
        ${saved ? '♥' : '♡'}
      </button>
    </div>
    <div class="outfit-card__body">
      <div class="outfit-card__occasion">${outfit.occasionLabel}</div>
      <h3 class="outfit-card__name">${outfit.name}</h3>
      <div class="outfit-card__tags">${tagsHTML}</div>
    </div>
  `;

  card.addEventListener('click', e => {
    if (e.target.closest('.outfit-card__fav')) return;
    openOutfitModal(outfit);
  });

  card.querySelector('.outfit-card__fav').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(outfit.id);
  });

  return card;
}

function renderLookbookGrid(outfits) {
  const grid = document.getElementById('lookbookGrid');
  const empty = document.getElementById('lookbookEmpty');
  const meta = document.getElementById('lookbookMeta');

  grid.innerHTML = '';

  if (outfits.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
    meta.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  grid.style.display = 'grid';

  outfits.forEach(outfit => {
    grid.appendChild(renderOutfitCard(outfit));
  });

  if (state.isFiltered) {
    const f = state.selectedFilters;
    const parts = [f.gender, f.undertone, f.bodyShape, f.occasion, f.aesthetic].filter(Boolean);
    meta.innerHTML = `Showing <strong>${outfits.length} look${outfits.length !== 1 ? 's' : ''}</strong> matching: ${parts.map(p => `<span style="background:var(--yellow);padding:2px 8px;border:1px solid #000;font-weight:700;">${p}</span>`).join(' + ')}`;
  } else {
    meta.innerHTML = `<strong>${outfits.length} looks</strong> in the collection.`;
  }
}

/* ============================================================
   6. FILTERING ENGINE
   ============================================================ */
function filterOutfits(outfits, filters) {
  if (!filters || !Object.values(filters).some(Boolean)) return outfits;

  const scored = outfits.map(outfit => {
    let score = 0;
    let maxScore = 0;

    if (filters.gender) {
      maxScore += 2;
      if (outfit.gender.includes(filters.gender) || outfit.gender.includes('all')) score += 2;
    }
    if (filters.undertone) {
      maxScore += 3;
      if (outfit.suitableUndertones.includes(filters.undertone)) score += 3;
    }
    if (filters.bodyShape) {
      maxScore += 3;
      if (outfit.suitableBodyShapes.includes(filters.bodyShape)) score += 3;
    }
    if (filters.height) {
      maxScore += 2;
      if (outfit.suitableHeights && outfit.suitableHeights.includes(filters.height)) score += 2;
    }
    if (filters.torso) {
      maxScore += 2;
      if (outfit.suitableTorsos && outfit.suitableTorsos.includes(filters.torso)) score += 2;
    }
    if (filters.occasion) {
      maxScore += 2;
      if (outfit.dressCode === filters.occasion) score += 2;
    }
    if (filters.aesthetic) {
      maxScore += 2;
      if (outfit.aesthetic === filters.aesthetic) score += 2;
    }

    const pct = maxScore > 0 ? score / maxScore : 0;
    return { outfit, score, pct };
  });

  return scored
    .filter(s => s.pct >= 0.4)
    .sort((a, b) => b.score - a.score)
    .map(s => s.outfit);
}

/* ============================================================
   7. OUTFIT MODAL
   ============================================================ */
function openOutfitModal(outfit) {
  state.activeOutfit = outfit;

  document.getElementById('modalImage').src = outfit.image;
  document.getElementById('modalImage').alt = outfit.name;
  document.getElementById('modalOutfitName').textContent = outfit.name;
  document.getElementById('modalOccasion').textContent = `${outfit.occasionLabel} · ${outfit.aestheticLabel}`;
  document.getElementById('modalWhy').textContent = outfit.stylingExplanation;

  const badge = document.getElementById('modalAestheticBadge');
  badge.textContent = outfit.aestheticLabel;
  badge.style.background = getAestheticBg(outfit.aesthetic);
  badge.style.color = getAestheticTextColor(outfit.aesthetic);

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = outfit.tags.map((t, i) => {
    const cls = i === 0 ? 'tag tag--undertone' : i === 1 ? 'tag tag--shape' : 'tag';
    return `<span class="${cls}">${t}</span>`;
  }).join('');

  const itemsList = document.getElementById('modalItemsList');
  itemsList.innerHTML = outfit.items.map(item => `
    <li class="modal__item">
      <span class="modal__item-name">${item.name}</span>
      <a href="${item.buyLink}" target="_blank" rel="noopener noreferrer" class="modal__item-buy">
        Shop ↗
      </a>
    </li>
  `).join('');

  refreshFavButtonStates();

  const overlay = document.getElementById('outfitModalOverlay');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeOutfitModal() {
  document.getElementById('outfitModalOverlay').classList.remove('is-open');
  document.body.style.overflow = '';
  state.activeOutfit = null;
}

/* ============================================================
   8. WARDROBE MODAL
   ============================================================ */
function openWardrobeModal() {
  renderWardrobeGrid();
  document.getElementById('wardrobeModalOverlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeWardrobeModal() {
  document.getElementById('wardrobeModalOverlay').classList.remove('is-open');
  document.body.style.overflow = '';
}

function renderWardrobeGrid() {
  const grid = document.getElementById('wardrobeGrid');
  const empty = document.getElementById('wardrobeEmpty');
  grid.innerHTML = '';

  const saved = state.allOutfits.filter(o => isFavorited(o.id));

  if (saved.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.style.display = 'grid';

  saved.forEach(outfit => {
    const card = document.createElement('div');
    card.className = 'wardrobe-card';
    card.innerHTML = `
      <img src="${outfit.image}" alt="${outfit.name}" loading="lazy" />
      <div class="wardrobe-card__name">${outfit.name}</div>
      <button class="wardrobe-card__remove" data-remove-id="${outfit.id}" aria-label="Remove from wardrobe">✕</button>
    `;

    card.addEventListener('click', e => {
      if (e.target.closest('.wardrobe-card__remove')) return;
      closeWardrobeModal();
      openOutfitModal(outfit);
    });

    card.querySelector('.wardrobe-card__remove').addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(outfit.id);
      renderWardrobeGrid();
      renderLookbookGrid(state.filteredOutfits);
    });

    grid.appendChild(card);
  });
}

/* ============================================================
   9. CHIP SELECTION (Form UI)
   ============================================================ */
function initChipGroups() {
  document.querySelectorAll('.chip-group').forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      const name = group.dataset.name;
      const value = chip.dataset.value;

      if (chip.classList.contains('is-active')) {
        chip.classList.remove('is-active');
        state.selectedFilters[name] = null;
        return;
      }

      group.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state.selectedFilters[name] = value;
    });
  });
}

/* ============================================================
   10. FORM SUBMISSION & RESET
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();
  const hasAnyFilter = Object.values(state.selectedFilters).some(Boolean);

  if (!hasAnyFilter) {
    state.filteredOutfits = [...state.allOutfits];
    state.isFiltered = false;
    updateLookbookHeaders(false);
  } else {
    state.filteredOutfits = filterOutfits(state.allOutfits, state.selectedFilters);
    state.isFiltered = true;
    updateLookbookHeaders(true);
  }

  renderLookbookGrid(state.filteredOutfits);
  document.getElementById('lookbook').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleReset() {
  Object.keys(state.selectedFilters).forEach(k => (state.selectedFilters[k] = null));
  document.querySelectorAll('.chip.is-active').forEach(c => c.classList.remove('is-active'));
  
  state.filteredOutfits = [...state.allOutfits];
  state.isFiltered = false;

  updateLookbookHeaders(false);
  renderLookbookGrid(state.filteredOutfits);
}

function updateLookbookHeaders(isFiltered) {
  const tag = document.getElementById('lookbookTag');
  const title = document.getElementById('lookbookTitle');
  const sub = document.getElementById('lookbookSub');

  if (isFiltered) {
    tag.textContent = 'Styled For You';
    title.textContent = 'Your Matched Looks';
    sub.textContent = 'Outfits selected based on your anatomy, occasion, and aesthetic.';
  } else {
    tag.textContent = 'Trending Now';
    title.textContent = 'The Lookbook';
    sub.textContent = 'Curated outfits from every corner of the aesthetic universe.';
  }
}

/* ============================================================
   11. HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-open');
    menu.classList.toggle('is-open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      menu.classList.remove('is-open');
    });
  });
}

/* ============================================================
   12. EVENT LISTENERS
   ============================================================ */
function bindEventListeners() {
  document.getElementById('styleForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('resetBtn').addEventListener('click', handleReset);

  document.getElementById('closeOutfitModal').addEventListener('click', closeOutfitModal);
  document.getElementById('outfitModalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('outfitModalOverlay')) closeOutfitModal();
  });

  document.getElementById('openWardrobeBtn').addEventListener('click', openWardrobeModal);
  document.getElementById('openWardrobeBtnMobile').addEventListener('click', () => {
    document.getElementById('hamburger').classList.remove('is-open');
    document.getElementById('mobileMenu').classList.remove('is-open');
    openWardrobeModal();
  });
  document.getElementById('closeWardrobeModal').addEventListener('click', closeWardrobeModal);
  document.getElementById('wardrobeModalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('wardrobeModalOverlay')) closeWardrobeModal();
  });

  document.getElementById('modalFavBtn').addEventListener('click', () => {
    if (state.activeOutfit) toggleFavorite(state.activeOutfit.id);
  });

  document.getElementById('showAllBtn').addEventListener('click', handleReset);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeOutfitModal();
      closeWardrobeModal();
    }
  });
}

/* ============================================================
   13. INIT
   ============================================================ */
async function init() {
  initChipGroups();
  initHamburger();
  bindEventListeners();

  try {
    // Run outfit fetch and favorites load in parallel for faster startup
    const [outfits] = await Promise.all([
      fetchOutfits(),
      loadFavoritesFromStorage(), // now async
    ]);

    state.allOutfits = outfits;
    state.filteredOutfits = [...outfits];
    renderLookbookGrid(state.filteredOutfits);
    updateWardrobeCounts();
  } catch (err) {
    console.error('[Wear.io] Init failed:', err);
    document.getElementById('lookbookGrid').innerHTML = `
      <p style="padding:40px;font-family:var(--font-mono);color:#999;">
        Failed to load outfits. Please refresh.
      </p>`;
  }
}

/* ============================================================
   14. AUTHENTICATION (Google OAuth)
   ============================================================ */

const authBtn = document.getElementById('authBtn');
const authModalOverlay = document.getElementById('authModalOverlay');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const googleLoginBtn = document.getElementById('googleLoginBtn');

function openAuthModal() {
  authModalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  authModalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Fungsi nge-trigger Login Google
googleLoginBtn.addEventListener('click', async () => {
  googleLoginBtn.innerHTML = 'Redirecting...';
  
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin // Balik ke halaman lo (localhost) setelah login
    }
  });

  if (error) {
    console.error("[Wear.io] Google Login Error:", error.message);
    googleLoginBtn.innerHTML = 'Continue with Google';
    alert("Gagal menghubungkan ke Google. Cek console.");
  }
});

async function handleAuthBtnClick() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (user) {
    // Kalau udah login, berarti tombol ini jadi fungsi LOGOUT
    await supabaseClient.auth.signOut();
    state.favorites = []; 
    await loadFavoritesFromStorage(); // Balik ke Guest Mode (localStorage)
    renderLookbookGrid(state.filteredOutfits);
    updateWardrobeCounts();
  } else {
    openAuthModal();
  }
}

// Supabase otomatis deteksi kalau user selesai login dari Google
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    authBtn.textContent = 'Logout';
    authBtn.style.color = 'var(--pink-dark)';
    closeAuthModal(); 
    
    // Tarik data favorit user dari server
    await loadFavoritesFromStorage();
    renderLookbookGrid(state.filteredOutfits);
    updateWardrobeCounts();
  } else {
    authBtn.textContent = 'Login';
    authBtn.style.color = 'inherit';
  }
});

// Bind Events
closeAuthModalBtn.addEventListener('click', closeAuthModal);
authModalOverlay.addEventListener('click', e => {
  if (e.target === authModalOverlay) closeAuthModal();
});
authBtn.addEventListener('click', handleAuthBtnClick);


document.addEventListener('DOMContentLoaded', init);