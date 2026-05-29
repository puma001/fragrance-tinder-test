const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

const fragrances = [
  // ── Fresh / Citrus ─────────────────────────────────────────────────────────
  { id: 1, name: 'Acqua di Gio', brand: 'Giorgio Armani', type: 'Eau de Toilette', family: 'fresh', gender: 'masculine', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Sea Water, Bergamot', heart: 'Jasmine, Cyclamen', base: 'White Musk, Cedar' }, description: 'The quintessential aquatic — fresh as a Mediterranean breeze.', color: 'linear-gradient(135deg,#006994,#003d5c)', emoji: '🌊' },
  { id: 2, name: 'Bleu de Chanel', brand: 'Chanel', type: 'Eau de Parfum', family: 'fresh', gender: 'masculine', seasons: ['All year'], intensity: 'Moderate', notes: { top: 'Citrus, Mint', heart: 'Ginger, Nutmeg', base: 'Sandalwood, Cedar' }, description: 'A woody, aromatic fragrance with a clean, fresh character.', color: 'linear-gradient(135deg,#1a3a5c,#0d2137)', emoji: '🔷' },
  { id: 3, name: 'Green Irish Tweed', brand: 'Creed', type: 'Eau de Parfum', family: 'fresh', gender: 'masculine', seasons: ['Spring', 'Summer'], intensity: 'Moderate', notes: { top: 'Lemon Verbena, Iris', heart: 'Violet Leaves', base: 'Ambergris, Sandalwood' }, description: 'A legendary fresh green fragrance — timeless and elegant.', color: 'linear-gradient(135deg,#1a472a,#0d2b19)', emoji: '🌿' },
  { id: 4, name: 'Light Blue', brand: 'Dolce & Gabbana', type: 'Eau de Toilette', family: 'fresh', gender: 'feminine', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Sicilian Lemon, Apple', heart: 'Bamboo, Jasmine', base: 'Cedar, Musk' }, description: 'Fresh, light and uplifting — a summer Mediterranean escape.', color: 'linear-gradient(135deg,#5ba3c9,#2d6a8a)', emoji: '💎' },
  { id: 5, name: 'CK One', brand: 'Calvin Klein', type: 'Eau de Toilette', family: 'fresh', gender: 'unisex', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Mandarin, Papaya', heart: 'Green Tea, Jasmine', base: 'Musk, Amber' }, description: 'The original unisex fragrance — clean, fresh and effortlessly cool.', color: 'linear-gradient(135deg,#9e9e9e,#616161)', emoji: '⚪' },

  // ── Woody / Aromatic ───────────────────────────────────────────────────────
  { id: 6, name: 'Sauvage', brand: 'Dior', type: 'Eau de Toilette', family: 'woody', gender: 'masculine', seasons: ['Spring', 'Fall'], intensity: 'Strong', notes: { top: 'Bergamot, Pepper', heart: 'Lavender, Geranium', base: 'Ambroxan, Cedar' }, description: 'A radically fresh composition with a wild, raw spirit.', color: 'linear-gradient(135deg,#2d1b69,#11094a)', emoji: '⚡' },
  { id: 7, name: "Terre d'Hermès", brand: 'Hermès', type: 'Eau de Parfum', family: 'woody', gender: 'masculine', seasons: ['Fall', 'Winter'], intensity: 'Moderate', notes: { top: 'Orange, Flint', heart: 'Pepper, Geranium', base: 'Vetiver, Benzoin' }, description: 'A journey through earth, wood and stone — deeply refined.', color: 'linear-gradient(135deg,#8B4513,#5c2c0a)', emoji: '🌍' },
  { id: 8, name: 'Oud Wood', brand: 'Tom Ford', type: 'Eau de Parfum', family: 'woody', gender: 'unisex', seasons: ['Fall', 'Winter'], intensity: 'Intense', notes: { top: 'Oud, Rosewood', heart: 'Cardamom, Sandalwood', base: 'Vetiver, Tonka Bean' }, description: 'A rare oud blended with smoky notes and exotic spices.', color: 'linear-gradient(135deg,#3d1a00,#1a0a00)', emoji: '🌳' },
  { id: 9, name: 'Santal 33', brand: 'Le Labo', type: 'Eau de Parfum', family: 'woody', gender: 'unisex', seasons: ['All year'], intensity: 'Moderate', notes: { top: 'Cardamom, Iris', heart: 'Violet Accord, Sandalwood', base: 'Cedarwood, Leather' }, description: 'A cult classic — warm sandalwood with a smoky, leather undertone.', color: 'linear-gradient(135deg,#c8a97e,#8b6914)', emoji: '🪵' },
  { id: 10, name: 'Aventus', brand: 'Creed', type: 'Eau de Parfum', family: 'woody', gender: 'masculine', seasons: ['Spring', 'Fall'], intensity: 'Strong', notes: { top: 'Pineapple, Bergamot', heart: 'Rose, Birch', base: 'Musk, Oak Moss, Ambergris' }, description: 'The emperor of modern fragrances — bold, complex and unforgettable.', color: 'linear-gradient(135deg,#1a1a2e,#16213e)', emoji: '👑' },

  // ── Floral ─────────────────────────────────────────────────────────────────
  { id: 11, name: 'La Vie Est Belle', brand: 'Lancôme', type: 'Eau de Parfum', family: 'floral', gender: 'feminine', seasons: ['Fall', 'Winter'], intensity: 'Moderate', notes: { top: 'Blackcurrant, Pear', heart: 'Iris, Jasmine', base: 'Vanilla, Patchouli' }, description: 'A sweet, floral fragrance celebrating the beauty of life.', color: 'linear-gradient(135deg,#8b1a6b,#5c0d45)', emoji: '🌸' },
  { id: 12, name: 'Chance Eau Tendre', brand: 'Chanel', type: 'Eau de Toilette', family: 'floral', gender: 'feminine', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Grapefruit, Quince', heart: 'Hyacinth, Jasmine', base: 'White Musk, Cedar' }, description: 'A delicate floral fragrance, fresh and feminine.', color: 'linear-gradient(135deg,#c97fa0,#8b4a6b)', emoji: '🌷' },
  { id: 13, name: 'Miss Dior', brand: 'Dior', type: 'Eau de Parfum', family: 'floral', gender: 'feminine', seasons: ['Spring', 'Summer'], intensity: 'Moderate', notes: { top: 'Bergamot, Peony', heart: 'Rose, Lily of the Valley', base: 'Patchouli, Musk' }, description: 'A modern floral chypre with a romantic, timeless spirit.', color: 'linear-gradient(135deg,#d63384,#9c1d5c)', emoji: '🌹' },
  { id: 14, name: "J'adore", brand: 'Dior', type: 'Eau de Parfum', family: 'floral', gender: 'feminine', seasons: ['All year'], intensity: 'Moderate', notes: { top: 'Pear, Magnolia', heart: 'Rose, Jasmine, Ylang-Ylang', base: 'Musk, Blackberry' }, description: 'A timeless floral bouquet — the epitome of feminine luxury.', color: 'linear-gradient(135deg,#d4af37,#9a7d0a)', emoji: '✨' },
  { id: 15, name: 'Flowerbomb', brand: 'Viktor & Rolf', type: 'Eau de Parfum', family: 'floral', gender: 'feminine', seasons: ['Fall', 'Winter'], intensity: 'Strong', notes: { top: 'Bergamot, Tea', heart: 'Jasmine, Orchid, Rose', base: 'Musk, Patchouli' }, description: 'An explosion of flowers — lush, warm and addictive.', color: 'linear-gradient(135deg,#ff69b4,#c71585)', emoji: '💥' },

  // ── Oriental / Gourmand ────────────────────────────────────────────────────
  { id: 16, name: 'Black Opium', brand: 'Yves Saint Laurent', type: 'Eau de Parfum', family: 'oriental', gender: 'feminine', seasons: ['Fall', 'Winter'], intensity: 'Strong', notes: { top: 'Pink Pepper, Orange Blossom', heart: 'Coffee, Jasmine', base: 'Vanilla, Patchouli' }, description: 'Addictive, edgy and feminine — coffee and vanilla in perfect harmony.', color: 'linear-gradient(135deg,#1a0033,#4a0080)', emoji: '☕' },
  { id: 17, name: 'Angel', brand: 'Mugler', type: 'Eau de Parfum', family: 'oriental', gender: 'feminine', seasons: ['Fall', 'Winter'], intensity: 'Intense', notes: { top: 'Bergamot, Melon', heart: 'Honey, Caramel', base: 'Vanilla, Patchouli, Chocolate' }, description: 'The original gourmand — sweet, cosmic and utterly unique.', color: 'linear-gradient(135deg,#003366,#001a4d)', emoji: '⭐' },
  { id: 18, name: 'Tobacco Vanille', brand: 'Tom Ford', type: 'Eau de Parfum', family: 'oriental', gender: 'unisex', seasons: ['Fall', 'Winter'], intensity: 'Intense', notes: { top: 'Tobacco Leaf, Spices', heart: 'Tobacco Flower, Vanilla', base: 'Tonka Bean, Cacao' }, description: 'Warm, rich and intoxicating — a cozy night by the fireplace.', color: 'linear-gradient(135deg,#5c3317,#2c1608)', emoji: '🍂' },
  { id: 19, name: 'Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', type: 'Extrait de Parfum', family: 'oriental', gender: 'unisex', seasons: ['All year'], intensity: 'Strong', notes: { top: 'Saffron, Jasmine', heart: 'Amberwood, Ambergris', base: 'Fir Resin, Cedar' }, description: 'The most talked-about fragrance of the decade — ethereal and mesmerizing.', color: 'linear-gradient(135deg,#c0392b,#7b241c)', emoji: '💎' },
  { id: 20, name: 'La Nuit Trésor', brand: 'Lancôme', type: 'Eau de Parfum', family: 'oriental', gender: 'feminine', seasons: ['Fall', 'Winter'], intensity: 'Strong', notes: { top: 'Blackberry, Peach', heart: 'Rose, Lily', base: 'Vanilla, Caramel, Musk' }, description: 'A sensual, sweet oriental for a magical night.', color: 'linear-gradient(135deg,#4a0e2e,#1a0010)', emoji: '🌙' },

  // ── Spicy / Intense ────────────────────────────────────────────────────────
  { id: 21, name: 'Y', brand: 'Yves Saint Laurent', type: 'Eau de Parfum', family: 'spicy', gender: 'masculine', seasons: ['All year'], intensity: 'Moderate', notes: { top: 'Bergamot, Apple', heart: 'Sage, Geranium', base: 'Amberwood, Cedar' }, description: 'A bold, modern fragrance for the man who dares to be himself.', color: 'linear-gradient(135deg,#1c1c1c,#333)', emoji: '🖤' },
  { id: 22, name: '1 Million', brand: 'Paco Rabanne', type: 'Eau de Toilette', family: 'spicy', gender: 'masculine', seasons: ['Fall', 'Winter'], intensity: 'Strong', notes: { top: 'Grapefruit, Mint, Mandarin', heart: 'Cinnamon, Rose', base: 'Leather, Amber' }, description: 'Seductive, fresh and spicy — a gold brick of a fragrance.', color: 'linear-gradient(135deg,#b8860b,#8b6914)', emoji: '💰' },
  { id: 23, name: 'Invictus', brand: 'Paco Rabanne', type: 'Eau de Toilette', family: 'spicy', gender: 'masculine', seasons: ['Spring', 'Summer'], intensity: 'Strong', notes: { top: 'Grapefruit, Sea Accord', heart: 'Jasmine, Guaiac Wood', base: 'Ambergris, Oak Moss' }, description: 'An explosive tribute to victory — fresh, woody and powerful.', color: 'linear-gradient(135deg,#b0bec5,#607d8b)', emoji: '🏆' },
  { id: 24, name: 'Spicebomb', brand: 'Viktor & Rolf', type: 'Eau de Toilette', family: 'spicy', gender: 'masculine', seasons: ['Fall', 'Winter'], intensity: 'Strong', notes: { top: 'Bergamot, Grapefruit', heart: 'Saffron, Cinnamon, Tobacco', base: 'Vetiver, Leather' }, description: 'An explosive spicy blend — intense, seductive and memorable.', color: 'linear-gradient(135deg,#8B0000,#5c0000)', emoji: '💣' },
  { id: 25, name: 'Eros', brand: 'Versace', type: 'Eau de Toilette', family: 'spicy', gender: 'masculine', seasons: ['Spring', 'Summer'], intensity: 'Strong', notes: { top: 'Mint, Lemon', heart: 'Tonka Bean, Amber', base: 'Atlas Cedarwood, Vetiver' }, description: 'Inspired by the Greek god of love — irresistible and passionate.', color: 'linear-gradient(135deg,#006400,#003300)', emoji: '💚' },

  // ── Aquatic / Marine ───────────────────────────────────────────────────────
  { id: 26, name: 'Acqua di Gioia', brand: 'Giorgio Armani', type: 'Eau de Parfum', family: 'aquatic', gender: 'feminine', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Mint, Lemon', heart: 'Jasmine, Water Hyacinth', base: 'Cedar, Musk' }, description: 'Pure joy of water and nature — a fresh aquatic floral.', color: 'linear-gradient(135deg,#48cae4,#0096c7)', emoji: '🏖️' },
  { id: 27, name: "L'Eau d'Issey", brand: 'Issey Miyake', type: 'Eau de Toilette', family: 'aquatic', gender: 'feminine', seasons: ['Spring', 'Summer'], intensity: 'Light', notes: { top: 'Aquatic Notes, Cyclamen', heart: 'Calla Lily, Peony', base: 'Cedar, Musk' }, description: 'The scent of water — pure, transparent and weightless.', color: 'linear-gradient(135deg,#00b4d8,#0077b6)', emoji: '💫' },
  { id: 28, name: 'Cool Water', brand: 'Davidoff', type: 'Eau de Toilette', family: 'aquatic', gender: 'masculine', seasons: ['Spring', 'Summer'], intensity: 'Moderate', notes: { top: 'Sea Water, Mint', heart: 'Geranium, Lavender', base: 'Sandalwood, Musk' }, description: 'An ocean-fresh classic that defined a generation.', color: 'linear-gradient(135deg,#0077b6,#023e8a)', emoji: '💧' },
  { id: 29, name: 'Dior Homme Intense', brand: 'Dior', type: 'Eau de Parfum', family: 'woody', gender: 'masculine', seasons: ['Fall', 'Winter'], intensity: 'Intense', notes: { top: 'Iris', heart: 'Lavender, Ambrette Seeds', base: 'Vetiver, Amber' }, description: 'A powerfully intimate iris — the epitome of masculine elegance.', color: 'linear-gradient(135deg,#2c2c54,#1a1a3a)', emoji: '🎩' },
  { id: 30, name: 'Mandarino di Amalfi', brand: 'Tom Ford', type: 'Eau de Parfum', family: 'aquatic', gender: 'unisex', seasons: ['Spring', 'Summer'], intensity: 'Moderate', notes: { top: 'Mandarin, Basil', heart: 'Lemon, Peach, Neroli', base: 'Amber, Musk, Cedar' }, description: 'A sun-drenched Italian coastline in a bottle — vibrant and joyful.', color: 'linear-gradient(135deg,#ffa500,#e65c00)', emoji: '🍊' },
];

// fragranceId → action ('like'|'superlike'|'dislike'|'skip')
const reactions = {};

const WEIGHTS = { superlike: 3, like: 1, skip: 0, dislike: -1 };

const PERSONALITIES = {
  'fresh,woody':    { name: 'The Urban Explorer',      desc: 'Balanced and sophisticated — clean yet complex.',       icon: '🌆' },
  'fresh,floral':   { name: 'The Garden Wanderer',     desc: 'Fresh natural scents that feel close to nature.',       icon: '🌼' },
  'fresh,aquatic':  { name: 'The Ocean Dreamer',       desc: 'Breezy, watery scents that feel free and expansive.',   icon: '🌊' },
  'fresh,oriental': { name: 'The Curious Wanderer',    desc: 'Fresh openings with warm, exotic depth.',               icon: '🧭' },
  'fresh,spicy':    { name: 'The Bold Fresh',          desc: 'Fresh top notes with surprising spicy kicks.',          icon: '⚡' },
  'woody,floral':   { name: 'The Refined Romantic',    desc: 'Woody depth with floral heart — elegant and timeless.', icon: '🌹' },
  'woody,oriental': { name: 'The Sophisticate',        desc: 'Rich, complex fragrances with depth and gravitas.',     icon: '🎩' },
  'woody,spicy':    { name: 'The Trailblazer',         desc: 'Bold, grounded scents with powerful projection.',       icon: '🔥' },
  'woody,aquatic':  { name: 'The Nature Seeker',       desc: 'You love the forest and the sea — earthy and wild.',    icon: '🌲' },
  'floral,oriental':{ name: 'The Romantic Sensualist', desc: 'Warm, floral and captivating — your scent tells a love story.', icon: '💫' },
  'floral,spicy':   { name: 'The Confident Bloom',     desc: 'Sweet flowers with a spicy kick — beautiful but unforgettable.', icon: '🌸' },
  'floral,aquatic': { name: 'The Spring Breeze',       desc: 'Delicate florals kissed by sea air.',                   icon: '🌺' },
  'oriental,spicy': { name: 'The Provocateur',         desc: 'Intense, mysterious and seductive.',                    icon: '👁️' },
  'oriental,aquatic':{ name: 'The Mystical',           desc: 'Depth of the sea meets exotic warmth.',                 icon: '🌙' },
  'spicy,aquatic':  { name: 'The Contrarian',          desc: 'Marine freshness with fiery spice — you love contrast.',icon: '🌶️' },
  fresh:    { name: 'The Purist',      desc: 'Clean, fresh and effortless — simplicity that speaks volumes.', icon: '✨' },
  woody:    { name: 'The Naturalist',  desc: 'Earthy, grounded and timeless — woody is your territory.',      icon: '🌳' },
  floral:   { name: 'The Romantic',   desc: 'Floral and feminine — you believe in the language of flowers.', icon: '🌺' },
  oriental: { name: 'The Sensualist', desc: 'Warm, opulent and magnetic — you dress in layers of luxury.',   icon: '🔮' },
  spicy:    { name: 'The Maverick',   desc: 'Bold, edgy and unforgettable — born to make an entrance.',      icon: '💥' },
  aquatic:  { name: 'The Free Spirit','desc': 'Light, airy and oceanic — you carry the sea with you.',        icon: '🐚' },
};

// Price / tier / retailer data keyed by fragrance id
const shopData = {
  1:  { price: 75,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Nordstrom', 'Amazon'] },
  2:  { price: 175, size: '100ml', tier: 'premium',    retailers: ['Chanel.com', 'Nordstrom', 'Sephora', 'Bloomingdale\'s'] },
  3:  { price: 415, size: '100ml', tier: 'luxury',     retailers: ['Creed Boutiques', 'Harrods', 'Neiman Marcus', 'LuckyScent'] },
  4:  { price: 85,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Ulta', 'Amazon'] },
  5:  { price: 60,  size: '200ml', tier: 'accessible', retailers: ['Sephora', 'Target', "Macy's", 'Amazon'] },
  6:  { price: 105, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Dior.com', 'Nordstrom', 'Bloomingdale\'s'] },
  7:  { price: 165, size: '100ml', tier: 'premium',    retailers: ['Hermes.com', 'Nordstrom', 'Sephora', 'Le Bon Marché'] },
  8:  { price: 305, size: '50ml',  tier: 'luxury',     retailers: ['TomFord.com', 'Neiman Marcus', 'Saks Fifth Avenue'] },
  9:  { price: 220, size: '100ml', tier: 'luxury',     retailers: ['LeLabo.com', 'Barneys', 'Liberty London', 'LuckyScent'] },
  10: { price: 415, size: '100ml', tier: 'luxury',     retailers: ['Creed Boutiques', 'Harrods', 'Neiman Marcus', 'LuckyScent'] },
  11: { price: 135, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Lancome.com', 'Nordstrom', "Macy's"] },
  12: { price: 150, size: '100ml', tier: 'premium',    retailers: ['Chanel.com', 'Nordstrom', 'Sephora'] },
  13: { price: 135, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Dior.com', 'Nordstrom'] },
  14: { price: 140, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Dior.com', 'Nordstrom', 'Bloomingdale\'s'] },
  15: { price: 165, size: '90ml',  tier: 'premium',    retailers: ['Sephora', 'ViktorRolf.com', 'Nordstrom'] },
  16: { price: 115, size: '90ml',  tier: 'premium',    retailers: ['Sephora', 'YSL.com', 'Ulta', 'Nordstrom'] },
  17: { price: 140, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Mugler.com', 'Nordstrom', "Macy's"] },
  18: { price: 305, size: '50ml',  tier: 'luxury',     retailers: ['TomFord.com', 'Neiman Marcus', 'Saks Fifth Avenue'] },
  19: { price: 325, size: '70ml',  tier: 'luxury',     retailers: ['MFK Boutiques', 'Saks Fifth Avenue', 'Net-a-Porter', 'Harrods'] },
  20: { price: 130, size: '75ml',  tier: 'premium',    retailers: ['Sephora', 'Lancome.com', 'Nordstrom'] },
  21: { price: 115, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'YSL.com', 'Nordstrom', "Macy's"] },
  22: { price: 90,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Ulta', 'Amazon'] },
  23: { price: 90,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Ulta', 'Amazon'] },
  24: { price: 100, size: '90ml',  tier: 'accessible', retailers: ['Sephora', 'ViktorRolf.com', "Macy's"] },
  25: { price: 85,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Ulta', 'Amazon'] },
  26: { price: 95,  size: '100ml', tier: 'accessible', retailers: ['Sephora', 'Armani.com', "Macy's", 'Nordstrom'] },
  27: { price: 80,  size: '100ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Ulta', 'Amazon'] },
  28: { price: 55,  size: '125ml', tier: 'accessible', retailers: ['Sephora', "Macy's", 'Amazon', 'Ulta'] },
  29: { price: 155, size: '100ml', tier: 'premium',    retailers: ['Sephora', 'Dior.com', 'Nordstrom'] },
  30: { price: 305, size: '50ml',  tier: 'luxury',     retailers: ['TomFord.com', 'Neiman Marcus', 'Saks Fifth Avenue'] },
};

app.get('/api/fragrances', (req, res) => {
  res.json(fragrances.map(f => ({ ...f, ...(shopData[f.id] || {}) })));
});

app.post('/api/reactions', (req, res) => {
  const { fragranceId, action } = req.body;
  if (!fragranceId || !['like', 'superlike', 'dislike', 'skip'].includes(action)) {
    return res.status(400).json({ error: 'fragranceId and action (like|superlike|dislike|skip) required' });
  }
  reactions[fragranceId] = action;
  res.json({ ok: true, total: Object.keys(reactions).length });
});

app.get('/api/profile', (req, res) => {
  const familyScores = {};
  const intensityScores = {};
  const seasonScores = {};
  const superliked = [];
  const liked = [];

  for (const [id, action] of Object.entries(reactions)) {
    const f = fragrances.find(fr => fr.id === parseInt(id));
    if (!f) continue;
    const w = WEIGHTS[action] ?? 0;

    familyScores[f.family] = (familyScores[f.family] || 0) + w;
    intensityScores[f.intensity] = (intensityScores[f.intensity] || 0) + w;
    (Array.isArray(f.seasons) ? f.seasons : [f.seasons]).forEach(s => {
      seasonScores[s] = (seasonScores[s] || 0) + w;
    });

    const enriched = { ...f, ...(shopData[f.id] || {}) };
    if (action === 'superlike') superliked.push(enriched);
    else if (action === 'like') liked.push(enriched);
  }

  const sortedFamilies = Object.entries(familyScores).sort((a, b) => b[1] - a[1]);
  const positives = sortedFamilies.filter(([, v]) => v > 0).map(([k]) => k);
  const key = positives.length >= 2 ? `${positives[0]},${positives[1]}` : positives[0];
  const personality = PERSONALITIES[key]
    || PERSONALITIES[`${positives[1]},${positives[0]}`]
    || PERSONALITIES[positives[0]]
    || { name: 'The Explorer', desc: 'Adventurous and open-minded — every fragrance is worth trying.', icon: '🧭' };

  // Top season (excluding "All year" for display)
  const topSeason = Object.entries(seasonScores)
    .filter(([s]) => s !== 'All year')
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'All year';

  // Top intensity
  const topIntensity = Object.entries(intensityScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Moderate';

  res.json({
    personality,
    familyScores,
    intensityScores,
    topSeason,
    topIntensity,
    superliked,
    liked: liked.slice(0, 5),
    totalSwiped: Object.keys(reactions).length,
  });
});

app.delete('/api/reactions', (req, res) => {
  Object.keys(reactions).forEach(k => delete reactions[k]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
