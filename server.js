// Buka brankas .env
require('dotenv').config();

// Panggil kabel Supabase
const { createClient } = require('@supabase/supabase-js');

// Ambil kunci dari brankas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Colokin ke database
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("=== STATUS KONEKSI ===");
console.log("Kabel ke Supabase berhasil dicolok!");
console.log("URL Database:", supabaseUrl ? "Aman Terbaca" : "Gagal Terbaca");