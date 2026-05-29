const WEIGHTS = { superlike: 3, like: 1, skip: 0, dislike: -1 };

const PERSONALITIES = {
  'fresh,woody':    { name: 'The Urban Explorer',      desc: 'Balanced and sophisticated — clean yet complex.',                 icon: '🌆' },
  'fresh,floral':   { name: 'The Garden Wanderer',     desc: 'Fresh natural scents that feel close to nature.',                 icon: '🌼' },
  'fresh,aquatic':  { name: 'The Ocean Dreamer',       desc: 'Breezy, watery scents that feel free and expansive.',             icon: '🌊' },
  'fresh,oriental': { name: 'The Curious Wanderer',    desc: 'Fresh openings with warm, exotic depth.',                         icon: '🧭' },
  'fresh,spicy':    { name: 'The Bold Fresh',          desc: 'Fresh top notes with surprising spicy kicks.',                    icon: '⚡' },
  'woody,floral':   { name: 'The Refined Romantic',    desc: 'Woody depth with floral heart — elegant and timeless.',           icon: '🌹' },
  'woody,oriental': { name: 'The Sophisticate',        desc: 'Rich, complex fragrances with depth and gravitas.',               icon: '🎩' },
  'woody,spicy':    { name: 'The Trailblazer',         desc: 'Bold, grounded scents with powerful projection.',                 icon: '🔥' },
  'woody,aquatic':  { name: 'The Nature Seeker',       desc: 'You love the forest and the sea — earthy and wild.',              icon: '🌲' },
  'floral,oriental':{ name: 'The Romantic Sensualist', desc: 'Warm, floral and captivating — your scent tells a love story.',  icon: '💫' },
  'floral,spicy':   { name: 'The Confident Bloom',     desc: 'Sweet flowers with a spicy kick — beautiful but unforgettable.', icon: '🌸' },
  'floral,aquatic': { name: 'The Spring Breeze',       desc: 'Delicate florals kissed by sea air.',                             icon: '🌺' },
  'oriental,spicy': { name: 'The Provocateur',         desc: 'Intense, mysterious and seductive.',                              icon: '👁️' },
  'oriental,aquatic':{ name: 'The Mystical',           desc: 'Depth of the sea meets exotic warmth.',                           icon: '🌙' },
  'spicy,aquatic':  { name: 'The Contrarian',          desc: 'Marine freshness with fiery spice — you love contrast.',          icon: '🌶️' },
  fresh:    { name: 'The Purist',      desc: 'Clean, fresh and effortless — simplicity that speaks volumes.', icon: '✨' },
  woody:    { name: 'The Naturalist',  desc: 'Earthy, grounded and timeless — woody is your territory.',      icon: '🌳' },
  floral:   { name: 'The Romantic',   desc: 'Floral and feminine — you believe in the language of flowers.', icon: '🌺' },
  oriental: { name: 'The Sensualist', desc: 'Warm, opulent and magnetic — you dress in layers of luxury.',   icon: '🔮' },
  spicy:    { name: 'The Maverick',   desc: 'Bold, edgy and unforgettable — born to make an entrance.',      icon: '💥' },
  aquatic:  { name: 'The Free Spirit', desc: 'Light, airy and oceanic — you carry the sea with you.',        icon: '🐚' },
};

export function computeProfile(reactions, fragrances) {
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

    if (action === 'superlike') superliked.push(f);
    else if (action === 'like') liked.push(f);
  }

  const sortedFamilies = Object.entries(familyScores).sort((a, b) => b[1] - a[1]);
  const positives = sortedFamilies.filter(([, v]) => v > 0).map(([k]) => k);
  const key = positives.length >= 2 ? `${positives[0]},${positives[1]}` : positives[0];
  const personality = PERSONALITIES[key]
    || PERSONALITIES[`${positives[1]},${positives[0]}`]
    || PERSONALITIES[positives[0]]
    || { name: 'The Explorer', desc: 'Adventurous and open-minded — every fragrance is worth trying.', icon: '🧭' };

  const topSeason = Object.entries(seasonScores)
    .filter(([s]) => s !== 'All year')
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'All year';

  const topIntensity = Object.entries(intensityScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Moderate';

  return { personality, familyScores, intensityScores, topSeason, topIntensity, superliked, liked };
}
