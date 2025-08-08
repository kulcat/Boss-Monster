
export const HEROES_DEFAULT = [
  {
    name: 'knight',
    damage: 5,
    health: 150,
    maxHealth: 150,
    level: 1,
    unlocked: true,
  },
  {
    name: 'archer',
    damage: 10,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: true,
  },
  {
    name: 'mage',
    damage: 20,
    health: 50,
    maxHealth: 50,
    level: 1,
    unlocked: false,
  },
  {
    name: 'assassin',
    damage: 15,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: false,
  },
];

export const BOSSES_DEFAULT = [
  {
    name: 'boss1',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000,
  },
  {
    name: 'boss2',
    health: 200,
    maxHealth: 2500,
    damage: 10,
    level: 1,
    maxLevel: 5,
    attackRate: 1750,
  },
  {
    name: 'boss3',
    health: 400,
    maxHealth: 5000,
    damage: 20,
    level: 1,
    maxLevel: 5,
    attackRate: 1500,
  },
  {
    name: 'dragon',
    health: 800,
    maxHealth: 10000,
    damage: 40,
    level: 1,
    maxLevel: 5,
    attackRate: 1250,
  },
];

export const BOSS_CFG = {
  healthScaling: 1,
  attackRateScaling: 1,
  damageScaling: 1,
}

export const HERO_CFG = {
  healthScaling: 1,
  damageScaling: 1,
}

export const ECONOMY_CFG = {
  startingHeroGold: 0,
  baseGoldAwarded: 100,
}

export const HEALING_CFG = {
  healPercentage: 0.1,
  autoHealRate: 5000,
}

export const PRICE_CFG = {
  heroPrice: 500,
  heroLevelUpPrice: 100,
  heroHealPrice: 2,
  autoHealPrice: 1000,
}

