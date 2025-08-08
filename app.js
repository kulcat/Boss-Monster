
//ANCHOR default objects / object arrays

const HEROES_DEFAULT = [
  {
    name: 'knight',
    type: 'a',
    damage: 5,
    health: 150,
    maxHealth: 150,
    level: 1,
    unlocked: true,
  },
  {
    name: 'archer',
    type: 'b',
    damage: 10,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: true,
  },
  {
    name: 'mage',
    type: 'c',
    damage: 20,
    health: 50,
    maxHealth: 50,
    level: 1,
    unlocked: false,
  },
  {
    name: 'assassin',
    type: 'd',
    damage: 15,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: false,
  },
];

const BOSSES_DEFAULT = [
  {
    name: 'boss1',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000, //2000
  },
  {
    name: 'boss2',
    health: 200,
    maxHealth: 2500,
    damage: 10,
    level: 1,
    maxLevel: 5,
    attackRate: 1750, //2000
  },
  {
    name: 'boss3',
    health: 400,
    maxHealth: 5000,
    damage: 20,
    level: 1,
    maxLevel: 5,
    attackRate: 1500, //2000
  },
  {
    name: 'dragon',
    health: 800,
    maxHealth: 10000,
    damage: 40,
    level: 1,
    maxLevel: 5,
    attackRate: 1250, //2000
  },
];

// Used to easily revert values to default
let heroes = structuredClone(HEROES_DEFAULT);
let bosses = structuredClone(BOSSES_DEFAULT);
let boss = bosses[0];
// let boss = structuredClone(bossDefault);

// ANCHOR Config

// Hero
const STARTING_HERO_GOLD = 1000000; //0, changed for testing purposes
let heroGold = STARTING_HERO_GOLD;

const HEAL_COST = 2;
const HEAL_PERCENTAGE = 0.1; //percent of max hp

const BASE_GOLD_AWARDED = 100;

// Boss
let bossAttackInterval = setInterval(bossAttack, boss.attackRate);

// Store
const HERO_PRICE = 500;
const AUTO_HEAL_PRICE = 1000;

let autoHealInterval = null;
const AUTO_HEAL_RATE = 5000;

// Game
let isGameOver = false;

//ANCHOR Hero 

function healHero(name) {
  if (!isGameOver) {
    let hero = heroes.find(hero => hero.name === name);

    switch (hero.health) {
      case 0:
        drawAlert("Hero is dead, cannot be healed.");
        break;

      case hero.maxHealth:
        drawAlert("Hero HP is full, cannot be healed.");
        break;

      default:
        if (heroGold >= HEAL_COST) {

          let healAmount = Math.ceil(hero.maxHealth * HEAL_PERCENTAGE);
          if ((hero.health + healAmount) > hero.maxHealth) {
            hero.health = hero.maxHealth;
          }
          else {
            hero.health += healAmount;
          }
          heroGold -= HEAL_COST;
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

function levelUpHero(name) {
  if (!isGameOver) {
    let hero = heroes.find(hero => hero.name === name);

    if (hero.health > 0) {
      if (heroGold >= 100) {
        hero.level++;
        hero.damage = Math.ceil(hero.damage * 1.2);
        hero.maxHealth = Math.ceil(hero.maxHealth * 1.2);
        hero.health = hero.maxHealth;

        heroGold -= 100;

        drawHeroLevel(hero);
        drawHeroHealth(hero);
        drawHeroDamage(hero);
        drawHeroGold();
      }
      else {
        drawAlert("Not enough gold to level up.");
      }
    }
    else {
      drawAlert("Hero is dead, cannot be healed.");
    }
  }
}

// Awards heroes gold for defeating a boss
function awardHeroes() {
  heroGold += (BASE_GOLD_AWARDED * boss.level);
  drawHeroGold();
}

// Decreases boss hp based on combined hero dmg
function attackBoss() {
  if (!isGameOver) {
    let totalDamage = 0;
    heroes.forEach(hero => {
      if (hero.health > 0 && hero.unlocked) {
        totalDamage += hero.damage;
      }
    });
    boss.health -= totalDamage;

    if (boss.health <= 0) {
      boss.health = 0;
      drawBossHealth();

      awardHeroes();
      levelUpBoss();
    }
    else {
      drawBossHealth();
    }
  }
}

//ANCHOR Boss 

function bossAttack() {
  let totalHeroHealth = 0;

  heroes.forEach(hero => {
    if (hero.unlocked) {
      if (hero.health > 0) {
        hero.health -= (boss.damage * Math.ceil(boss.level / 2));

        totalHeroHealth += hero.health;
      }

      if (hero.health <= 0) {
        hero.health = 0;
      }
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

function levelUpBoss() {
  if (!isGameOver) {
    if (boss.level < boss.maxLevel) {
      boss.level++;
      boss.maxHealth *= Math.ceil(boss.level / 3)
      boss.health = boss.maxHealth;

      // increase attack rate by 5% each level
      boss.attackRate = Math.ceil(boss.attackRate * 0.95);

      clearInterval(bossAttackInterval);
      bossAttackInterval = setInterval(bossAttack, boss.attackRate);

      drawAlert(`Boss is now LVL ${boss.level}`);
      drawBossHealth();
      drawBossLevel();
    }
    else {
      changeBoss();
    }
  }
}

function changeBoss() {
  if (bosses.length > 1) {
    bosses.shift();
    boss = bosses[0];

    drawBossHealth();
    drawBossLevel();
    drawBossName();

    clearInterval(bossAttackInterval);
    bossAttackInterval = setInterval(bossAttack, boss.attackRate);

    drawAlert(`Boss changed to ${boss.name}.`);
  }
  else {
    clearInterval(bossAttackInterval);
    isGameOver = true;
    drawAlert("GAME OVER");
  }
}

//ANCHOR UI/DOM

function drawAlert(message) {
  let alertsContainer = document.getElementById('alerts');

  if (isGameOver) {
    alertsContainer.innerHTML = `<span class="alert text-danger">-GAME OVER</span>`;
  }
  else {
    alertsContainer.innerHTML = `<span class="alert text-warning">-${message}</span>`;
  }
}

// Hero UI

function drawHeroLevel(hero) {
  let heroLevelElm = document.getElementById(hero.name).querySelector(".level");
  heroLevelElm.innerText = "LVL: " + hero.level;
}

function drawHeroHealth(hero) {
  let heroHealthElm = document.getElementById(hero.name).querySelector(".health");
  heroHealthElm.innerText = "HP: " + hero.health;
}

function drawHeroDamage(hero) {
  let heroDamageElm = document.getElementById(hero.name).querySelector(".damage");
  heroDamageElm.innerText = "DMG: " + hero.damage;
}

function drawHeroGold() {
  let heroGoldElm = document.getElementById('heroGold');
  heroGoldElm.innerText = "Gold: " + heroGold;
}

// Boss UI

function drawBossHealth() {
  let bossHealthElm = document.getElementById('boss').querySelector(".health");
  bossHealthElm.innerText = "HP: " + boss.health;
}

function drawBossLevel() {
  let bossLevelElm = document.getElementById('boss').querySelector(".level");
  bossLevelElm.innerText = "LVL: " + boss.level;
}

function drawBossName() {
  let bossNameElm = document.getElementById('boss').querySelector(".name");
  bossNameElm.innerText = boss.name;
}
//ANCHOR Store

function buyItem(itemName) {
  if (!isGameOver) {
    let item = document.getElementById(itemName);

    switch (itemName) {
      case 'autoHeal':
        if (heroGold >= AUTO_HEAL_PRICE) {
          autoHealInterval = setInterval(() => {
            heroes.forEach(hero => {
              if (hero.unlocked && hero.health > 0 && hero.health < hero.maxHealth) {
                healHero(hero.name);
              }
            });
          }, AUTO_HEAL_RATE);
          drawHeroGold();

          // make button disabled after purchasing
          item.disabled = true;
        }
        else {
          drawAlert("Not enough gold.");
        }
        break;
      case 'unlockHero':
        let hero = heroes.find(hero => !hero.unlocked);
        if (heroGold >= HERO_PRICE && hero) {
          hero.unlocked = true;

          let heroElm = document.getElementById(hero.name);
          heroElm.classList.remove("d-none");
          drawHeroHealth(hero);
          drawHeroDamage(hero);
          drawHeroLevel(hero);

          heroGold -= HERO_PRICE;
          drawHeroGold();

          if (heroes.findIndex(hero => !hero.unlocked) < 0) {
            item.disabled = true;
          }
        }
        else {
          drawAlert("Not enough gold.");
        }
        break;
      default:
        break;
    }
  }
}

//ANCHOR Reset Game
function resetGame() {

  isGameOver = false;

  // Reset object arrays to default
  heroes = structuredClone(HEROES_DEFAULT);
  bosses = structuredClone(BOSSES_DEFAULT);
  boss = bosses[0];

  heroGold = STARTING_HERO_GOLD;

  // Reset boss attack interval
  clearInterval(bossAttackInterval);
  bossAttackInterval = setInterval(bossAttack, boss.attackRate);

  clearInterval(autoHealInterval);
  autoHealInterval = null;

  // reset alerts
  let alertsContainer = document.getElementById('alerts');
  alertsContainer.innerHTML = '';

  // reset store buttons
  let items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.disabled = false;
  });

  // update DOM/UI
  heroes.forEach(hero => {
    let heroElm = document.getElementById(hero.name);
    if (hero.unlocked) {
      heroElm.classList.remove("d-none");
      drawHeroHealth(hero);
      drawHeroDamage(hero);
      drawHeroLevel(hero);
    }
    else {
      heroElm.classList.add("d-none");
    }
  });

  drawHeroGold();

  drawBossHealth();
  drawBossLevel();
  drawBossName();

  drawAlert("Reset successfully.");
}

// ANCHOR Main

// UI update at start
heroes.forEach(hero => {
  if (hero.unlocked) {
    drawHeroHealth(hero);
    drawHeroDamage(hero);

    drawHeroLevel(hero);
  }
});

drawHeroGold();
drawBossHealth();
drawBossLevel();
drawBossName();