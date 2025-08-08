import * as CFG from './config.js';

import { Hero } from './Hero.js';
import { Boss } from './Boss.js';
import { Store } from './Store.js';
import { UI } from './UI.js';


export class Game {
  constructor() {
    this.heroes = CFG.HEROES_DEFAULT.map(hero => new Hero(hero));
    this.bosses = CFG.BOSSES_DEFAULT.map(boss => new Boss(boss));
    this.boss = this.bosses[0];

    this.heroGold = CFG.ECONOMY_CFG.startingHeroGold;
    this.isGameOver = false;

    this.autoHealInterval = null;
    this.bossAttackInterval = setInterval(() => this.bossAttack(), this.boss.attackRate);

    this.updateUI();
  }

  updateUI() {
    this.heroes.forEach(hero => {
      if (hero.isUnlocked) {
        UI.drawHeroHealth(hero);
        UI.drawHeroDamage(hero);
        UI.drawHeroLevel(hero);
      }
    });
    UI.drawHeroGold(this.heroGold);
    UI.drawBossHealth(this.boss);
    UI.drawBossLevel(this.boss);
    UI.drawBossName(this.boss);
  }

  healHero(name) {
    if (this.isGameOver) return;

    const hero = this.heroes.find(h => h.name === name);
    if (!hero) return;

    if (hero.health <= 0) return UI.drawAlert("Hero is dead, cannot be healed.");
    if (hero.health === hero.maxHealth) return UI.drawAlert("Hero HP is full, cannot be healed.");
    if (this.heroGold < CFG.HEALING_CFG.healCost) return UI.drawAlert("Not enough gold.");

    this.heroGold -= CFG.PRICE_CFG.heroHealPrice;
    UI.drawHeroHealth(hero);
    UI.drawHeroGold(this.heroGold);
  }

  levelUpHero(name) {
    if (this.isGameOver) return;

    const hero = this.heroes.find(h => h.name === name);
    if (!hero) return;

    if (hero.health <= 0) return UI.drawAlert("Hero is dead, cannot level up.");
    if (this.heroGold < 100) return UI.drawAlert("Not enough gold to level up.");

    this.heroGold -= CFG.PRICE_CFG.heroLevelUpPrice;
    UI.drawHeroLevel(hero);
    UI.drawHeroHealth(hero);
    UI.drawHeroDamage(hero);
    UI.drawHeroGold(this.heroGold);
  }

  attackBoss() {
    if (this.isGameOver) return;

    let totalDamage = 0;
    console.log(this.heroes.filter(hero => hero.isUnlocked && hero.health > 0));

    // not functional
    this.heroes.filter(hero => hero.isUnlocked && hero.health > 0).forEach(hero => {
      totalDamage += hero.damage;
    });

    this.boss.takeDamage(totalDamage);

    UI.drawBossHealth(this.boss);

    if (this.boss.health <= 0) {
      this.heroGold += (CFG.ECONOMY_CFG.baseGoldAwarded * this.boss.level);
      UI.drawHeroGold(this.heroGold);

      this.levelUpBoss();
    }
  }

  bossAttack() {
    let totalHeroHealth = 0;

    // not functional
    this.heroes.filter(hero => hero.isUnlocked && hero.health > 0).forEach(hero => {
      hero.takeDamage(this.boss.damage);
      totalHeroHealth += hero.health;
      UI.drawHeroHealth(hero);
    });

    if (totalHeroHealth <= 0) {
      clearInterval(this.bossAttackInterval);
      this.isGameOver = true;
      UI.drawAlert("GAME OVER", true);
    }
  }

  levelUpBoss() {
    if (this.boss.levelUp()) {
      clearInterval(this.bossAttackInterval);
      this.bossAttackInterval = setInterval(() => this.bossAttack(), this.boss.attackRate);
      UI.drawAlert(`Boss is now LVL ${this.boss.level}`);
      UI.drawBossHealth(this.boss);
      UI.drawBossLevel(this.boss);
    }
    else {
      this.changeBoss();
    }
  }

  changeBoss() {
    this.bosses.shift();
    if (this.bosses.length > 1) {
      this.boss = this.bosses[0];

      clearInterval(this.bossAttackInterval);
      this.bossAttackInterval = setInterval(() => this.bossAttack(), this.boss.attackRate);

      this.updateUI();
      UI.drawAlert(`Boss changed to ${this.boss.name}`);
    }
    else {
      this.isGameOver = true;
      UI.drawAlert("GAME OVER", true);
    }
  }

  resetGame() {
    clearInterval(this.bossAttackInterval);
    clearInterval(this.autoHealInterval);

    this.heroes = CFG.HEROES_DEFAULT.map(h => new Hero(h));
    this.bosses = CFG.BOSSES_DEFAULT.map(b => new Boss(b));
    this.boss = this.bosses[0];

    this.heroGold = CFG.ECONOMY_CFG.startingHeroGold;

    this.isGameOver = false;

    this.bossAttackInterval = setInterval(() => this.bossAttack(), this.boss.attackRate);

    document.querySelectorAll('.item').forEach(button => button.disabled = false);

    this.updateUI();
    UI.drawAlert("Reset successfully.");
  }
}