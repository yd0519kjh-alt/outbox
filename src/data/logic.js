import { CHARACTER_DB } from './characterDB';

export const getFinalResult = (month, scores) => {
  const pool = CHARACTER_DB[month];
  if (!pool) return null;

  if (scores.villain >= 5) return pool.find(p => p.id === "lee_wanyong");
  if (scores.villain >= 1) return pool.find(p => p.id === "spy_jung");
  
  if (scores.hero >= 4) {
    const heroes = pool.filter(p => p.type === "hero");
    return heroes[Math.floor(Math.random() * heroes.length)];
  }
  
  if (scores.hero >= 2) {
    const supports = pool.filter(p => p.type === "support");
    return supports[Math.floor(Math.random() * supports.length)];
  }

  const neutrals = pool.filter(p => p.type === "neutral");
  return neutrals[Math.floor(Math.random() * neutrals.length)];
};