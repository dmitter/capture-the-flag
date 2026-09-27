// Reference flag definitions. Each flag is rendered with the exact same
// drawShape() primitives the player uses, so pixel-diff scoring is fair.
// Coordinates are fractions of the canvas (0..1); colors are approximate.

export const FLAGS = [
  // ---- Easy: plain stripes ----
  { name: 'France', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#002654' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#ED2939' },
  ]},
  { name: 'Italy', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#009246' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#CE2B37' },
  ]},
  { name: 'Mexico', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#006847' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#CE1126' },
  ]},
  { name: 'Ireland', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#169B62' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#FF883E' },
  ]},
  { name: 'Nigeria', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#008751' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#008751' },
  ]},
  { name: 'Ivory Coast', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#FF8200' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#009A44' },
  ]},
  { name: 'Belgium', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#000000' },
    { type: 'rect', x: 1/3, y: 0, w: 1/3, h: 1, color: '#FAE042' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#ED2939' },
  ]},
  { name: 'Romania', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#002664' },
    { type: 'rect', x: 1/3, y: 0, w: 1/3, h: 1, color: '#FCD116' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#CE1126' },
  ]},
  { name: 'Mali', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1/3, h: 1, color: '#14B53A' },
    { type: 'rect', x: 1/3, y: 0, w: 1/3, h: 1, color: '#FCD116' },
    { type: 'rect', x: 2/3, y: 0, w: 1/3, h: 1, color: '#E11C1B' },
  ]},
  { name: 'Germany', difficulty: 'easy', bg: '#FFCE00', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#000000' },
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#DD0000' },
  ]},
  { name: 'Netherlands', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#AE1C28' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#21468B' },
  ]},
  { name: 'Russia', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#0039A6' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#D52B1E' },
  ]},
  { name: 'Austria', difficulty: 'easy', bg: '#ED2939', shapes: [
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#FFFFFF' },
  ]},
  { name: 'Poland', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 1/2, w: 1, h: 1/2, color: '#DC143C' },
  ]},
  { name: 'Indonesia', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/2, color: '#CE1126' },
  ]},
  { name: 'Bulgaria', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#00966E' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#D62612' },
  ]},
  { name: 'Hungary', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#CE2939' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#436F4D' },
  ]},
  { name: 'Lithuania', difficulty: 'easy', bg: '#FCD116', shapes: [
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#006A44' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#C1272D' },
  ]},
  { name: 'Estonia', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#0072CE' },
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#000000' },
  ]},
  { name: 'Latvia', difficulty: 'easy', bg: '#9E3039', shapes: [
    { type: 'rect', x: 0, y: 0.4, w: 1, h: 0.2, color: '#FFFFFF' },
  ]},
  { name: 'Gabon', difficulty: 'easy', bg: '#FCD116', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#009E60' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#3A75C4' },
  ]},
  { name: 'Sierra Leone', difficulty: 'easy', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#1EB53A' },
    { type: 'rect', x: 0, y: 2/3, w: 1, h: 1/3, color: '#0072C6' },
  ]},
  { name: 'Armenia', difficulty: 'easy', bg: '#F2A800', shapes: [
    { type: 'rect', x: 0, y: 0, w: 1, h: 1/3, color: '#D90012' },
    { type: 'rect', x: 0, y: 1/3, w: 1, h: 1/3, color: '#0033A0' },
  ]},
  { name: 'Colombia', difficulty: 'easy', bg: '#FCD116', shapes: [
    { type: 'rect', x: 0, y: 0.5, w: 1, h: 0.25, color: '#003893' },
    { type: 'rect', x: 0, y: 0.75, w: 1, h: 0.25, color: '#CE1126' },
  ]},

  // ---- Medium: stripes/field + one symbol ----
  { name: 'Japan', difficulty: 'medium', bg: '#FFFFFF', shapes: [
    { type: 'circle', x: 0.3665, y: 0.3, w: 0.3, h: 0.4, color: '#BC002D' },
  ]},
  { name: 'Bangladesh', difficulty: 'medium', bg: '#006A4E', shapes: [
    { type: 'circle', x: 0.28, y: 0.3, w: 0.3, h: 0.4, color: '#F42A41' },
  ]},
  { name: 'Somalia', difficulty: 'medium', bg: '#4189DD', shapes: [
    { type: 'star', x: 0.35, y: 0.275, w: 0.3, h: 0.45, color: '#FFFFFF' },
  ]},
  { name: 'Vietnam', difficulty: 'medium', bg: '#DA251D', shapes: [
    { type: 'star', x: 0.325, y: 0.25, w: 0.35, h: 0.5, color: '#FFFF00' },
  ]},
  { name: 'China', difficulty: 'medium', bg: '#DE2910', shapes: [
    { type: 'star', x: 0.12, y: 0.15, w: 0.25, h: 0.35, color: '#FFDE00' },
  ]},
  { name: 'Switzerland', difficulty: 'medium', bg: '#FF0000', shapes: [
    { type: 'rect', x: 0.44, y: 0.3, w: 0.12, h: 0.4, color: '#FFFFFF' },
    { type: 'rect', x: 0.34, y: 0.4, w: 0.32, h: 0.2, color: '#FFFFFF' },
  ]},
  { name: 'Sweden', difficulty: 'medium', bg: '#006AA7', shapes: [
    { type: 'rect', x: 0.3, y: 0, w: 0.12, h: 1, color: '#FECC02' },
    { type: 'rect', x: 0, y: 0.4, w: 1, h: 0.2, color: '#FECC02' },
  ]},
  { name: 'Finland', difficulty: 'medium', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0.3, y: 0, w: 0.12, h: 1, color: '#003580' },
    { type: 'rect', x: 0, y: 0.4, w: 1, h: 0.2, color: '#003580' },
  ]},
  { name: 'Denmark', difficulty: 'medium', bg: '#C60C30', shapes: [
    { type: 'rect', x: 0.3, y: 0, w: 0.12, h: 1, color: '#FFFFFF' },
    { type: 'rect', x: 0, y: 0.4, w: 1, h: 0.2, color: '#FFFFFF' },
  ]},
  { name: 'Norway', difficulty: 'medium', bg: '#EF2B2D', shapes: [
    { type: 'rect', x: 0.28, y: 0, w: 0.16, h: 1, color: '#FFFFFF' },
    { type: 'rect', x: 0, y: 0.38, w: 1, h: 0.24, color: '#FFFFFF' },
    { type: 'rect', x: 0.32, y: 0, w: 0.08, h: 1, color: '#002868' },
    { type: 'rect', x: 0, y: 0.42, w: 1, h: 0.16, color: '#002868' },
  ]},

  // ---- Hard: multiple combined elements ----
  { name: 'Turkey', difficulty: 'hard', bg: '#E30A17', shapes: [
    { type: 'crescent', x: 0.28, y: 0.2, w: 0.4, h: 0.6, color: '#FFFFFF', dir: 'right' },
    { type: 'star', x: 0.55, y: 0.39, w: 0.15, h: 0.22, color: '#FFFFFF' },
  ]},
  { name: 'Pakistan', difficulty: 'hard', bg: '#01411C', shapes: [
    { type: 'rect', x: 0, y: 0, w: 0.2, h: 1, color: '#FFFFFF' },
    { type: 'crescent', x: 0.45, y: 0.25, w: 0.35, h: 0.5, color: '#FFFFFF', dir: 'right' },
    { type: 'star', x: 0.68, y: 0.33, w: 0.13, h: 0.19, color: '#FFFFFF' },
  ]},
  { name: 'Brazil', difficulty: 'hard', bg: '#009739', shapes: [
    { type: 'diamond', x: 0.2, y: 0.125, w: 0.6, h: 0.75, color: '#FEDD00' },
    { type: 'circle', x: 0.367, y: 0.3, w: 0.267, h: 0.4, color: '#002776' },
  ]},
  { name: 'Czech Republic', difficulty: 'hard', bg: '#FFFFFF', shapes: [
    { type: 'rect', x: 0, y: 0.5, w: 1, h: 0.5, color: '#D7141A' },
    { type: 'triangle', x: 0, y: 0, w: 0.5, h: 1, color: '#11457E', dir: 'right' },
  ]},
  { name: 'Cuba', difficulty: 'hard', bg: '#002A8F', shapes: [
    { type: 'rect', x: 0, y: 0.2, w: 1, h: 0.2, color: '#FFFFFF' },
    { type: 'rect', x: 0, y: 0.6, w: 1, h: 0.2, color: '#FFFFFF' },
    { type: 'triangle', x: 0, y: 0, w: 0.35, h: 1, color: '#CB1515', dir: 'right' },
    { type: 'star', x: 0.1, y: 0.41, w: 0.12, h: 0.18, color: '#FFFFFF' },
  ]},
];

export function randomFlag(exclude, difficulty) {
  let pool = FLAGS;
  if (difficulty && difficulty !== 'all') pool = pool.filter(f => f.difficulty === difficulty);
  if (pool.length > 1 && exclude) pool = pool.filter(f => f.name !== exclude);
  if (pool.length === 0) pool = difficulty && difficulty !== 'all' ? FLAGS.filter(f => f.difficulty === difficulty) : FLAGS;
  return pool[Math.floor(Math.random() * pool.length)];
}
