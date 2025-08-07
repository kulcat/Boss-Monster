
// Default starting Arrays
const heroesDefault = [
  {
    name: 'a',
    type: 'a',
    damage: 5,
    health: 100,
    maxHealth: 100,
    unlocked: true,
  },
  {
    name: 'b',
    type: 'b',
    damage: 5,
    health: 100,
    maxHealth: 100,
    unlocked: true,
  },
];

const bossDefault = {
  health: 100,
  maxHealth: 100,
  damage: 5,
  level: 1,
  attackRate: 250, //2000
};

// Modifiable arrays
let heroes = structuredClone(heroesDefault);
let boss = structuredClone(bossDefault);

// Hero Section

let heroGold = 0;

let healCost = 2;
let healAmount = 10;

let baseGoldAwarded = 50;

// Increases hero hp by consuming gold
function healHero(name) {
  if (!isGameOver) {
    let hero = heroes.find(hero => hero.name === name);

    switch (hero.health) {
      case 0:
        drawAlert("Hero is dead, cannot be healed.");
        break;

      case 100:
        drawAlert("Hero HP is full, cannot be healed.");
        break;

      default:
        if (heroGold >= healCost) {
          if ((hero.health + healAmount) > hero.maxHealth) {
            hero.health = hero.maxHealth;
          }
          else {
            hero.health += healAmount;
          }
          heroGold -= healCost;
          drawHeroHealth(hero);
          drawHeroGold();
        }
        else {
          drawAlert("Not enough gold.")
        }
        break;
    }
  }
}

function drawHeroHealth(hero) {
  let heroHealthElm = document.getElementById(hero.name).querySelector(".health");
  heroHealthElm.innerText = "HP: " + hero.health;
}

// Awards heroes gold for defeating a boss
function awardHeroes() {
  heroGold += (baseGoldAwarded * boss.level);
  drawHeroGold();
}

function drawHeroGold() {
  let heroGoldElm = document.getElementById('heroGold');
  heroGoldElm.innerText = "Gold: " + heroGold;
}

// Decreases boss hp based on combined hero dmg
function attackBoss() {
  if (!isGameOver) {
    let totalDamage = 0;
    heroes.forEach(hero => {
      if (hero.health > 0 && hero.unlocked === true) {
        totalDamage += hero.damage;
      }
    });
    boss.health -= totalDamage;

    drawBossHealth();

    if (boss.health <= 0) {
      awardHeroes();
      levelUpBoss();
    }
  }
}

// Decrease each hero's hp based on boss dmg * level
function bossAttack() {
  if (!isGameOver) {
    let totalHeroHealth = 0;

    heroes.forEach(hero => {
      if (hero.health > 0) {
        hero.health -= (boss.damage * Math.ceil(boss.level / 2));

        totalHeroHealth += hero.health;
        drawHeroHealth(hero);
      }
      else {
        hero.health = 0;
        drawHeroHealth(hero);
      }
    });

    if (totalHeroHealth <= 0) {
      // Game End
      clearInterval(bossAttackInterval);
      isGameOver = true;
      drawAlert("GAME OVER");
    }
  }
}

let bossAttackInterval = setInterval(bossAttack, boss.attackRate);

function drawBossHealth() {
  let bossHealthElm = document.getElementById('boss').querySelector(".health");
  bossHealthElm.innerText = "HP: " + boss.health;
}

function drawBossLevel() {
  let bossLevelElm = document.getElementById('boss').querySelector(".level");
  bossLevelElm.innerText = "LVL: " + boss.level;
}

function levelUpBoss() {
  boss.level++;
  boss.maxHealth *= Math.ceil(boss.level / 2);
  boss.health = boss.maxHealth;

  // increase attack rate by 5% each level
  boss.attackRate = Math.ceil(boss.attackRate * 0.95);
  console.log(boss.attackRate);

  clearInterval(bossAttackInterval);
  bossAttackInterval = setInterval(bossAttack, boss.attackRate);

  // Game End
  drawAlert(`Boss is now LVL ${boss.level}`);
  drawBossHealth();
  drawBossLevel();
}

// Game related functions

let isGameOver = false;

function resetGame() {

  isGameOver = false;
  // Reset object arrays to default
  heroes = structuredClone(heroesDefault);
  boss = structuredClone(bossDefault);

  heroGold = 0;

  // Reset boss attack interval
  clearInterval(bossAttackInterval);
  bossAttackInterval = setInterval(bossAttack, boss.attackRate);

  // Reset alerts
  let alertsContainer = document.getElementById('alerts');
  alertsContainer.innerHTML = '';

  // update DOM/UI
  heroes.forEach(hero => {
    drawHeroHealth(hero);
  });
  drawBossHealth();
  drawHeroGold();

  drawAlert("Reset successfully.")
}

function drawAlert(message) {
  let alertsContainer = document.getElementById('alerts');

  if (isGameOver) {
    alertsContainer.innerHTML = `<span class="alert text-danger">-GAME OVER</span>`;
  }
  else {
    alertsContainer.innerHTML = `<span class="alert text-warning">-${message}</span>`;
  }
}
