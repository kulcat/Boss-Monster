
const heroesDefault = [
  {
    name: 'knight', //knight
    type: 'a',
    damage: 5,
    health: 150,
    maxHealth: 150,
    level: 1,
    unlocked: true,
  },
  {
    name: 'archer', //archer
    type: 'b',
    damage: 10,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: true,
  },
  {
    name: 'mage', //mage
    type: 'c',
    damage: 20,
    health: 50,
    maxHealth: 50,
    level: 1,
    unlocked: false,
  },
  {
    name: 'assassin', //assassin
    type: 'd',
    damage: 15,
    health: 75,
    maxHealth: 75,
    level: 1,
    unlocked: false,
  },
];

const bossDefault = {
  health: 100,
  maxHealth: 100,
  damage: 5,
  level: 1,
  attackRate: 2000, //2000
};

//unused
const bossesDefault = [
  {
    name: 'boss',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000, //2000
  },
  {
    name: 'boss',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000, //2000
  },
  {
    name: 'boss',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000, //2000
  },
  {
    name: 'boss',
    health: 100,
    maxHealth: 100,
    damage: 5,
    level: 1,
    maxLevel: 5,
    attackRate: 2000, //2000
  },
];

// Modifiable arrays
let heroes = structuredClone(heroesDefault);
let boss = structuredClone(bossDefault);

// Hero Section
let heroGold = 10000000; //0

let healCost = 2;
let healAmount = 10;

let baseGoldAwarded = 50;

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

function levelUpHero(name) {
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

// Awards heroes gold for defeating a boss
function awardHeroes() {
  heroGold += (baseGoldAwarded * boss.level);
  drawHeroGold();
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

function bossAttack() {
  if (!isGameOver) {
    let totalHeroHealth = 0;

    heroes.forEach(hero => {
      if (hero.unlocked === true) {
        if (hero.health > 0) {
          hero.health -= (boss.damage * Math.ceil(boss.level / 2));

          totalHeroHealth += hero.health;
          drawHeroHealth(hero);
        }

        if (hero.health <= 0) {
          hero.health = 0;
          drawHeroHealth(hero);
        }
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

function levelUpBoss() {
  boss.level++;
  boss.maxHealth *= Math.ceil(boss.level / 3);
  boss.health = boss.maxHealth;

  // increase attack rate by 5% each level
  boss.attackRate = Math.ceil(boss.attackRate * 0.95);

  clearInterval(bossAttackInterval);
  bossAttackInterval = setInterval(bossAttack, boss.attackRate);

  // Game End
  drawAlert(`Boss is now LVL ${boss.level}`);
  drawBossHealth();
  drawBossLevel();
}

// UI/DOM
function drawAlert(message) {
  let alertsContainer = document.getElementById('alerts');

  if (isGameOver) {
    alertsContainer.innerHTML = `<span class="alert text-danger">-GAME OVER</span>`;
  }
  else {
    alertsContainer.innerHTML = `<span class="alert text-warning">-${message}</span>`;
  }
}

function drawHeroLevel(hero) {
  let heroLevelElm = document.getElementById(hero.name).querySelector(".level");
  heroLevelElm.innerText = "LVL: " + hero.level;
}

function drawHeroHealth(hero) {
  let heroHealthElm = document.getElementById(hero.name).querySelector(".health");
  heroHealthElm.innerText = "HP: " + hero.health;
}

function drawHeroGold() {
  let heroGoldElm = document.getElementById('heroGold');
  heroGoldElm.innerText = "Gold: " + heroGold;
}

function drawBossHealth() {
  let bossHealthElm = document.getElementById('boss').querySelector(".health");
  bossHealthElm.innerText = "HP: " + boss.health;
}

function drawBossLevel() {
  let bossLevelElm = document.getElementById('boss').querySelector(".level");
  bossLevelElm.innerText = "LVL: " + boss.level;
}

// UI update
heroes.forEach(hero => {
  if (hero.unlocked === true) {
    drawHeroHealth(hero);
    drawHeroLevel(hero);
  }
});

drawHeroGold();
drawBossHealth();
drawBossLevel();

// Store
let heroPrice = 500;
let autoHealPrice = 1000;

let autoHealInterval = null;
let autoHealRate = 5000;

function buyItem(itemName) {
  let item = document.getElementById(itemName);

  switch (itemName) {
    case 'autoHeal':
      if (heroGold >= autoHealPrice) {
        autoHealInterval = setInterval(() => {
          heroes.forEach(hero => {
            if (hero.unlocked === true && hero.health > 0 && hero.health < hero.maxHealth) {
              healHero(hero.name);
            }
          });
        }, autoHealRate);
        drawHeroGold();

        // make button disabled after purchasing
        item.disabled = true;
      }
      else {
        drawAlert("Not enough gold.");
      }
      break;
    case 'unlockHero':
      let hero = heroes.find(hero => hero.unlocked === false);
      if (heroGold >= heroPrice && hero) {
        hero.unlocked = true;

        let heroElm = document.getElementById(hero.name);
        heroElm.classList.remove("d-none");
        drawHeroHealth(hero);
        drawHeroLevel(hero);

        heroGold -= heroPrice;
        drawHeroGold();

        if (heroes.findIndex(hero => hero.unlocked === false) < 0) {
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

// Game
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

  clearInterval(autoHealInterval);
  autoHealInterval = null;

  // Reset alerts
  let alertsContainer = document.getElementById('alerts');
  alertsContainer.innerHTML = '';

  // update DOM/UI
  heroes.forEach(hero => {
    drawHeroHealth(hero);
  });
  drawBossHealth();
  drawHeroGold();

  // reset store buttons
  let items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.disabled = false;
  });

  // reset heroes visibility
  heroes.forEach(hero => {
    let heroElm = document.getElementById(hero.name);
    if (hero.unlocked === true) {
      heroElm.classList.remove("d-none");
    }
    else {
      heroElm.classList.add("d-none");
    }
  });

  drawAlert("Reset successfully.")
}


