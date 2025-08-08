import { BOSS_CFG } from './config.js';

export class Boss {
  constructor({ name, health, maxHealth, damage, maxLevel, attackRate }) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.level = 1;
    this.maxLevel = maxLevel;
    this.attackRate = attackRate;
  }

  takeDamage() {
    this.health = Math.max(0, this.health - amount);
  }

  levelUp() {
    if (this.level < this.maxLevel) {
      this.level++;
      this.maxHealth *= Math.ceil(BOSS_CFG.healthScaling);
      this.health = this.maxHealth;

      this.damage *= Math.ceil(BOSS_CFG.damageScaling);

      this.attackRate *= Math.ceil(BOSS_CFG.attackRateScaling);
    }
  }
}