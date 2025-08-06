
// Default Starting Arrays
const heroesDefault = [
  {
    name: 'a',
    type: 'a',
    damage: 5,
    health: 100,
    unlocked: true,
  },
  {
    name: 'b',
    type: 'b',
    damage: 5,
    health: 100,
    unlocked: true,
  },
  // {
  //   name: 'c',
  //   type: 'c',
  //   damage: 5,
  //   health: 100,
  //   unlocked: false,
  // }
];

const bossDefault = {
  health: 100,
  maxHealth: 100,
  damage: 5,
  level: 1,
  attackRate: 2000,
};

// Modifiable Arrays
let heroes = structuredClone(heroesDefault);
let boss = structuredClone(bossDefault);

// Hero Section

let heroGold = 0;

let healCost = 2;
let healAmount = 10;

let baseGoldAwarded = 50;

// Increases hero hp by consuming gold
function healHero(name) {
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
        hero.health += healAmount;
        drawHeroHealth(hero);

        heroGold -= healCost;
        drawHeroGold();
      }
      else {
        drawAlert("Not enough gold to heal.")
      }
      break;
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

// Decrease each hero's hp based on boss dmg * level
function bossAttack() {
  let totalHeroHealth = 0;

  heroes.forEach(hero => {
    hero.health -= (boss.damage * boss.level);

    totalHeroHealth += hero.health;
    drawHeroHealth(hero);
  });

  if (totalHeroHealth <= 0) {
    heroes.forEach(hero => {
      hero.health = 0;
      drawHeroHealth(hero);
    });

    // Game End
    clearInterval(bossAttackInterval);
    drawAlert("GAME OVER");
  }
}

let bossAttackInterval = setInterval(bossAttack, boss.attackRate);

function drawBossHealth() {
  let bossHealthElm = document.getElementById('boss').querySelector(".health");
  bossHealthElm.innerText = "HP: " + boss.health;
}

function levelUpBoss() {
  boss.level++;
  boss.maxHealth *= boss.level;
  boss.health = boss.maxHealth;

  // increase attack rate by 5% each level
  boss.attackRate = Math.ceil(boss.attackRate * 0.95);
  console.log(boss.attackRate);

  clearInterval(bossAttackInterval);
  bossAttackRate = setInterval(bossAttack, boss.attackRate);

  // Game End
  drawAlert(`Boss is now LVL ${boss.level}`);
  drawBossHealth();
}

// Game related functions

function resetGame() {

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

  // Redraw UI values
  heroes.forEach(hero => {
    drawHeroHealth(hero);
  });
  drawBossHealth();
  drawHeroGold();

  drawAlert("Reset successfully.")
}

function drawAlert(message) {
  let alertsContainer = document.getElementById('alerts');

  // If there are 5 alerts remove the oldest alert
  if (alertsContainer.children.length === 5) {
    alertsContainer.firstElementChild.remove();
  }
  alertsContainer.innerHTML += `<span class="alert">-${message}</span>`;
}

