import { Game } from './Game.js';

const game = new Game();

document.getElementById('reset').addEventListener('click', game.resetGame);

// document.getElementById('autoHeal').addEventListener('click', game.buyItem('autoHeal'));
// document.getElementById('unlockHero').addEventListener('click', game.buyItem('unlockHero'));

document.querySelector('#boss img').addEventListener('click', game.attackBoss);

document.querySelectorAll('.hero img').forEach(img => {
  img.addEventListener('click', event => game.healHero(event.target.parentElement.id));
});

document.querySelectorAll('.levelUp').forEach(button => {
  button.addEventListener('click', event => game.levelUpHero(event.target.parentElement.id));
});