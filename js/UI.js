export class UI {
  static drawHeroLevel(hero) {
    document.getElementById(hero.name).querySelector(".level").innerText = "LVL: " + hero.level;
  }

  static drawHeroHealth(hero) {
    document.getElementById(hero.name).querySelector(".health").innerText = "HP: " + hero.health;
  }

  static drawHeroDamage(hero) {
    document.getElementById(hero.name).querySelector(".damage").innerText = "DMG: " + hero.damage;
  }

  static drawHeroGold(amount) {
    document.getElementById('heroGold').innerText = "Gold: " + amount;
  }

  static drawBossHealth(boss) {
    document.getElementById('boss').querySelector(".health").innerText = "HP: " + boss.health;
  }

  static drawBossLevel(boss) {
    document.getElementById('boss').querySelector(".level").innerText = "LVL: " + boss.level;
  }

  static drawBossName(boss) {
    document.getElementById('boss').querySelector(".name").innerText = boss.name;
  }

  static drawAlert(message, isGameOver = false) {
    let alertsContainer = document.getElementById('alerts');
    alertsContainer.innerHTML = isGameOver
      ? `<span class="alert text-danger">-GAME OVER</span>`
      : `<span class="alert text-warning">-${message}</span>`;
  }
}