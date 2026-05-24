/* ============================================================
   WEAR.IO — script.js
   Virtual Stylist Engine | Vanilla JS
   ============================================================
   ARCHITECTURE NOTE:
   All data lives in `outfitDatabase`. To connect a real backend,
   replace the `fetchOutfits()` function body with an actual
   fetch() call to your Supabase endpoint.
   ============================================================ */

'use strict';

/* ============================================================
   1. DATA LAYER — Mock Database
   Replace fetchOutfits() with API call when backend is ready.
   ============================================================ */

const outfitDatabase = [
  {
    id: 'wio-001',
    name: 'The Gallery Afternoon',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    gender: ['women', 'all'],
    suitableUndertones: ['cool', 'neutral'],
    suitableBodyShapes: ['hourglass', 'rectangle', 'inverted-triangle'],
    dressCode: 'smart-casual',
    aesthetic: 'clean-girl',
    aestheticLabel: '✦ Clean Girl',
    occasionLabel: 'Smart Casual',
    stylingExplanation: 'The straight-cut wide-leg trousers elongate your silhouette and create a balanced frame for your Inverted Triangle or Rectangle shape — adding width below to counterbalance broader shoulders. The crisp ivory tones are perfectly calibrated for Cool and Neutral undertones, reflecting cool-adjacent pigments that illuminate without washing out. This is effortless authority.',
    items: [
      { name: 'Wide-Leg Linen Trousers (Ivory)', buyLink: 'https://www.arket.com/en_gbp/women/trousers' },
      { name: 'Fitted Ribbed Crop Top (White)', buyLink: 'https://www.aritzia.com/en/product/ribbed-tank' },
      { name: 'Square-Toe Ballet Flats (Bone)', buyLink: 'https://www.zara.com/en/shoes' },
      { name: 'Micro Tote Bag (Tan)', buyLink: 'https://www.mango.com/en/bags' },
    ],
    tags: ['Cool', 'Neutral', 'Hourglass', 'Rectangle', 'Inv. Triangle'],
  },
  {
    id: 'wio-002',
    name: 'Autumn Boardroom',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    gender: ['women', 'all'],
    suitableUndertones: ['warm', 'neutral'],
    suitableBodyShapes: ['hourglass', 'pear', 'apple'],
    dressCode: 'business-formal',
    aesthetic: 'old-money',
    aestheticLabel: '◆ Old Money',
    occasionLabel: 'Business Formal',
    stylingExplanation: 'A camel-coloured blazer draped over a forest green knit is a masterclass in warm palette dressing. Camel, terracotta, and olive are Autumn's power tones — they borrow warmth from your undertones and create a rich, luminous complexion. The belted waist defines the Hourglass or creates an intentional waist for Apple and Pear shapes. Structured shoulders project authority, while the midi skirt length elongates without overwhelm.',
    items: [
      { name: 'Oversized Camel Wool Blazer', buyLink: 'https://www.cos.com/en_gbp/women/womenswear/blazers' },
      { name: 'Forest Green Ribbed Knit', buyLink: 'https://www.arket.com/en_gbp/women/knitwear' },
      { name: 'Caramel Leather Belt', buyLink: 'https://www.massimdutti.com/en/accessories/belts' },
      { name: 'Chocolate Midi Skirt (A-line)', buyLink: 'https://www.reiss.com/women/skirts' },
      { name: 'Tan Block-Heel Ankle Boots', buyLink: 'https://www.office.co.uk/women/boots' },
    ],
    tags: ['Warm', 'Neutral', 'Hourglass', 'Pear', 'Apple'],
  },
  {
    id: 'wio-003',
    name: 'Midnight Revelation',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    gender: ['women', 'all'],
    suitableUndertones: ['cool', 'neutral'],
    suitableBodyShapes: ['hourglass', 'rectangle', 'pear', 'apple', 'inverted-triangle'],
    dressCode: 'cocktail',
    aesthetic: 'gothic',
    aestheticLabel: '☽ Gothic',
    occasionLabel: 'Cocktail',
    stylingExplanation: 'Deep black and midnight plum are the quintessential palette for Cool undertones — they echo the blue and rose undertones in your skin, creating a magnetic, high-contrast look. A structured corset bodice naturally defines and celebrates any shape, while the asymmetric hem draws the eye vertically, creating elongation for Apple and Pear body types. The Silver jewellery amplifies Cool undertone brilliance.',
    items: [
      { name: 'Corset Midi Dress (Midnight Black)', buyLink: 'https://www.prettylittlething.com/dresses/midi-dresses' },
      { name: 'Silver Statement Cuff Bracelet', buyLink: 'https://www.asos.com/women/jewellery' },
      { name: 'Pointed Black Heeled Ankle Boot', buyLink: 'https://www.kurt-geiger.com/en-gb/women/shoes' },
      { name: 'Plum Satin Clutch', buyLink: 'https://www.farfetch.com/en-gb/shopping/women/clutches' },
    ],
    tags: ['Cool', 'Neutral', 'All Shapes'],
  },
  {
    id: 'wio-004',
    name: 'Chrome & Chaos',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&q=80',
    gender: ['women', 'all'],
    suitableUndertones: ['cool', 'neutral'],
    suitableBodyShapes: ['rectangle', 'inverted-triangle', 'hourglass'],
    dressCode: 'casual',
    aesthetic: 'y2k',
    aestheticLabel: '★ Y2K',
    occasionLabel: 'Casual',
    stylingExplanation: 'Low-rise flared denim and a metallic butterfly top is textbook Y2K done right. The flared leg creates volume below the knee, perfectly balancing broader shoulders typical of Inverted Triangle shapes. Cool and Neutral undertones glow under silver and icy pastels — the metallic sheen adds a reflective quality that brings out pink and blue undertone brilliance. This silhouette also celebrates Rectangle shapes by introducing curves through flare.',
    items: [
      { name: 'Low-Rise Flared Denim (Medium Wash)', buyLink: 'https://www.levis.com/en-gb/women/jeans/flare' },
      { name: 'Metallic Butterfly Top (Silver)', buyLink: 'https://www.urban-outfitters.com/women/tops' },
      { name: 'Platform Chunky Sandals (White)', buyLink: 'https://www.schuh.co.uk/womens/platform-shoes' },
      { name: 'Mini Croc Bag (Silver)', buyLink: 'https://www.asos.com/women/bags' },
      { name: 'Tinted Rectangle Sunglasses', buyLink: 'https://www.sunglasshut.com/gb' },
    ],
    tags: ['Cool', 'Neutral', 'Rectangle', 'Inv. Triangle', 'Hourglass'],
  },
  {
    id: 'wio-005',
    name: 'Summit Ready',
    image: 'https://images.unsplash.com/photo-1493655430114-e2a2c1571277?w=600&q=80',
    gender: ['men', 'all'],
    suitableUndertones: ['warm', 'neutral', 'cool'],
    suitableBodyShapes: ['trapezoid', 'rectangle', 'triangle', 'inverted-triangle'],
    dressCode: 'casual',
    aesthetic: 'gorpcore',
    aestheticLabel: '⛰ Gorpcore',
    occasionLabel: 'Casual',
    stylingExplanation: 'Gorpcore is function-first, but the colourway is where personal styling lives. Earthy olive and rust tones are a godsend for Warm undertones, amplifying skin\'s golden warmth. For a Trapezoid or Rectangle build, a relaxed fleece and straight tech pant create balanced, grounded proportions without constricting the frame. Even Cool undertones work here — the vivid cobalt accent pieces create a cool-toned pop against the neutrals.',
    items: [
      { name: 'Arc\'teryx Fleece Pullover (Olive)', buyLink: 'https://arcteryx.com/en-gb/fleece' },
      { name: 'Straight-Fit Trail Pant (Stone)', buyLink: 'https://www.patagonia.com/trousers' },
      { name: 'Salomon XT-6 Advanced (Trail Grey)', buyLink: 'https://www.salomon.com/en-gb/shop-en_gb/trail-running-shoes' },
      { name: 'Nalgene Wide-Mouth Water Bottle (Cobalt)', buyLink: 'https://www.nalgene.com/en-gb' },
      { name: 'Bucket Hat (Khaki)', buyLink: 'https://www.asos.com/men/hats' },
    ],
    tags: ['Warm', 'Neutral', 'Cool', 'Trapezoid', 'Rectangle', 'Triangle'],
  },
  {
    id: 'wio-006',
    name: 'The Uptown Drop',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
    gender: ['men', 'all'],
    suitableUndertones: ['cool', 'warm', 'neutral'],
    suitableBodyShapes: ['trapezoid', 'inverted-triangle', 'rectangle'],
    dressCode: 'smart-casual',
    aesthetic: 'streetwear',
    aestheticLabel: '◉ Streetwear',
    occasionLabel: 'Smart Casual',
    stylingExplanation: 'An oversized technical jacket in muted black layered over a graphic heavyweight tee and slim tapered cargo pants — this is streetwear operating at its intelligent peak. The monochrome black base works for both Cool (amplifies the cool contrast) and Warm (creates high-drama depth) undertones. For Inverted Triangle and Trapezoid frames, the tapering silhouette of cargo pants balances the upper body, while structured shoulders on the jacket maintain presence without excess.',
    items: [
      { name: 'Oversized Technical Jacket (Black)', buyLink: 'https://www.stone-island.com/en-gb/jackets' },
      { name: 'Heavyweight Graphic Tee (Washed Black)', buyLink: 'https://www.represent-clothing.com/collections/t-shirts' },
      { name: 'Slim Cargo Trouser (Charcoal)', buyLink: 'https://www.carhartt-wip.com/en-gb/trousers' },
      { name: 'Nike Air Max 1 (Wolf Grey)', buyLink: 'https://www.nike.com/gb/air-max-1' },
      { name: 'Minimal Leather Baguette Bag (Black)', buyLink: 'https://www.asos.com/men/bags' },
    ],
    tags: ['Cool', 'Warm', 'Neutral', 'Trapezoid', 'Inv. Triangle', 'Rectangle'],
  },
  {
    id: 'wio-007',
    name: 'Bow & Blush',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    gender: ['women', 'all'],
    suitableUndertones: ['cool', 'neutral'],
    suitableBodyShapes: ['hourglass', 'pear', 'rectangle'],
    dressCode: 'cocktail',
    aesthetic: 'coquette',
    aestheticLabel: '✿ Coquette',
    occasionLabel: 'Cocktail',
    stylingExplanation: 'Dusty rose, powder blue, and ivory are the Coquette palette — and they\'re deeply aligned with Cool undertones, mirroring the pink and lavender notes in your complexion. A fitted babydoll silhouette with puffed sleeves is designed to celebrate Hourglass shapes by floating gently over the hips, while adding dimension to Rectangle frames. Lace trim and oversized satin bows are detail-level storytelling — feminine architecture, intentionally constructed.',
    items: [
      { name: 'Lace-Trim Babydoll Mini Dress (Dusty Rose)', buyLink: 'https://www.selfridges.com/en-gb/women/dresses' },
      { name: 'Satin Bow Hair Clip (Ivory)', buyLink: 'https://www.urban-outfitters.com/accessories' },
      { name: 'Mary Jane Kitten Heels (Powder Blue)', buyLink: 'https://www.asos.com/women/shoes' },
      { name: 'Pearl Drop Earrings (Silver)', buyLink: 'https://www.missoma.com/en-gb/collections/earrings' },
      { name: 'Micro Bow Clutch (Ivory Satin)', buyLink: 'https://www.asos.com/women/bags' },
    ],
    tags: ['Cool', 'Neutral', 'Hourglass', 'Pear', 'Rectangle'],
  },
  {
    id: 'wio-008',
    name: 'Sovereign Stance',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    gender: ['men', 'all'],
    suitableUndertones: ['warm', 'neutral'],
    suitableBodyShapes: ['trapezoid', 'rectangle', 'triangle'],
    dressCode: 'business-casual',
    aesthetic: 'old-money',
    aestheticLabel: '◆ Old Money',
    occasionLabel: 'Business Casual',
    stylingExplanation: 'A heritage check blazer in warm tones (camel, brown, burgundy) with a navy polo and tan chinos is the Warm undertone man\'s strongest hand. The check pattern works with golden-warm skin to create visual harmony — the colour temperature is aligned. A Trapezoid frame fills a structured blazer impeccably, while Rectangle and Triangle builds benefit from the shoulder structure adding perceived width. This is restrained, deliberate, authoritative.',
    items: [
      { name: 'Heritage Check Blazer (Camel/Burgundy)', buyLink: 'https://www.paulsmith.com/en-gb/mens/suits' },
      { name: 'Navy Mercerised Cotton Polo', buyLink: 'https://www.ralphlauren.co.uk/men/polo-shirts' },
      { name: 'Tailored Chino (Tan)', buyLink: 'https://www.incotex.com/en/men/trousers' },
      { name: 'Suede Chelsea Boot (Tan)', buyLink: 'https://www.grenson.com/en-gb/mens/chelsea-boots' },
      { name: 'Gold Watch (Vintage Face)', buyLink: 'https://www.hodinkee.com' },
    ],
    tags: ['Warm', 'Neutral', 'Trapezoid', 'Rectangle', 'Triangle'],
  },
];

/* ============================================================
   2. API SIMULATION LAYER
   Replace `fetchOutfits()` with real fetch() when Supabase is ready.
   ============================================================ */

/**
 * Simulates an async API call. Replace this function body with:
 *
 * async function fetchOutfits(filters = {}) {
 *   const { data, error } = await supabase
 *     .from('outfits')
 *     .select('*')
 *     .match(filters);
 *   if (error) throw error;
 *   return data;
 * }
 */
async function fetchOutfits() {
  return new Promise(resolve => setTimeout(() => resolve([...outfitDatabase]), 120));
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
    occasion: null,
    aesthetic: null,
  },
  activeOutfit: null,
  favorites: [],
  isFiltered: false,
};

/* ============================================================
   4. LOCALSTORAGE (Wardrobe Persistence)
   ============================================================ */

function loadFavoritesFromStorage() {
  try {
    const stored = localStorage.getItem('wio_favorites');
    state.favorites = stored ? JSON.parse(stored) : [];
  } catch {
    state.favorites = [];
  }
}

function saveFavoritesToStorage() {
  localStorage.setItem('wio_favorites', JSON.stringify(state.favorites));
}

function isFavorited(id) {
  return state.favorites.includes(id);
}

function toggleFavorite(id) {
  if (isFavorited(id)) {
    state.favorites = state.favorites.filter(f => f !== id);
  } else {
    state.favorites.push(id);
  }
  saveFavoritesToStorage();
  updateWardrobeCounts();
  refreshFavButtonStates();
}

function updateWardrobeCounts() {
  const count = state.favorites.length;
  document.getElementById('wardrobeCount').textContent = count;
  document.getElementById('wardrobeCountMobile').textContent = count;
}

function refreshFavButtonStates() {
  // Grid fav buttons
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    const id = btn.dataset.favId;
    btn.classList.toggle('is-saved', isFavorited(id));
    btn.textContent = isFavorited(id) ? '♥' : '♡';
  });

  // Modal fav button
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

  // Click card → open outfit modal
  card.addEventListener('click', e => {
    if (e.target.closest('.outfit-card__fav')) return;
    openOutfitModal(outfit);
  });

  // Click heart → toggle favorite
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

/**
 * Core recommendation logic.
 * Each pillar is optional — empty filters show all outfits.
 * Score-based matching with threshold for partial matches.
 */
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

  // Return outfits that match at least 40% of active filters
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

  // Aesthetic badge
  const badge = document.getElementById('modalAestheticBadge');
  badge.textContent = outfit.aestheticLabel;
  badge.style.background = getAestheticBg(outfit.aesthetic);
  badge.style.color = getAestheticTextColor(outfit.aesthetic);

  // Tags
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = outfit.tags.map((t, i) => {
    const cls = i === 0 ? 'tag tag--undertone' : i === 1 ? 'tag tag--shape' : 'tag';
    return `<span class="${cls}">${t}</span>`;
  }).join('');

  // Items
  const itemsList = document.getElementById('modalItemsList');
  itemsList.innerHTML = outfit.items.map(item => `
    <li class="modal__item">
      <span class="modal__item-name">${item.name}</span>
      <a href="${item.buyLink}" target="_blank" rel="noopener noreferrer" class="modal__item-buy">
        Shop ↗
      </a>
    </li>
  `).join('');

  // Fav button
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

      // Deselect if already active
      if (chip.classList.contains('is-active')) {
        chip.classList.remove('is-active');
        state.selectedFilters[name] = null;
        return;
      }

      // Deactivate siblings
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

  // Scroll to lookbook
  document.getElementById('lookbook').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleReset() {
  // Clear filter state
  Object.keys(state.selectedFilters).forEach(k => (state.selectedFilters[k] = null));

  // Deactivate all chips
  document.querySelectorAll('.chip.is-active').forEach(c => c.classList.remove('is-active'));

  // Show all
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

  // Close on nav link click
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
  // Form
  document.getElementById('styleForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('resetBtn').addEventListener('click', handleReset);

  // Modals — Outfit
  document.getElementById('closeOutfitModal').addEventListener('click', closeOutfitModal);
  document.getElementById('outfitModalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('outfitModalOverlay')) closeOutfitModal();
  });

  // Modals — Wardrobe
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

  // Modal fav button
  document.getElementById('modalFavBtn').addEventListener('click', () => {
    if (state.activeOutfit) toggleFavorite(state.activeOutfit.id);
  });

  // Show all (from empty state)
  document.getElementById('showAllBtn').addEventListener('click', handleReset);

  // Escape key
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
  loadFavoritesFromStorage();
  initChipGroups();
  initHamburger();
  bindEventListeners();

  try {
    const outfits = await fetchOutfits();
    state.allOutfits = outfits;
    state.filteredOutfits = [...outfits];
    renderLookbookGrid(state.filteredOutfits);
    updateWardrobeCounts();
  } catch (err) {
    console.error('[Wear.io] Failed to load outfits:', err);
    document.getElementById('lookbookGrid').innerHTML = `
      <p style="padding:40px;font-family:var(--font-mono);color:#999;">
        Failed to load outfits. Please refresh.
      </p>`;
  }
}

document.addEventListener('DOMContentLoaded', init);