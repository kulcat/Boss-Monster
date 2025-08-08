import { HERO_CFG } from './config.js';

export class Hero {

  constructor({ name, maxHealth, damage, level = 1, isUnlocked = true }) {
    this.name = name;

    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.damage = damage;

    this.level = level;

    this.isUnlocked = isUnlocked;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }

  levelUp() {
    this.level++;

    this.maxHealth *= Math.ceil(HERO_CFG.healthScaling);
    this.health = this.maxHealth;

    this.damage *= Math.ceil(HERO_CFG.damageScaling);
  }
}