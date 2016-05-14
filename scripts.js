var day_field = document.getElementsByClassName('day')[0];
var locaton_field = document.getElementsByClassName('location')[0];
var energy_bar = document.getElementsByClassName('energy-bar')[0];
var mood_bar = document.getElementsByClassName('mood-bar')[0];

var game_data;

var energy;
var mood;

function adjustEnergy(delta) {
  energy += delta;
  if (energy <= 0) {
    alert('You have run out of energy');
  }
  energy_bar.style.width = Math.min(100, energy) + '%';
}

function adjustMood(delta) {
  mood += delta;
  if (mood <= 0) {
    alert('You have run out of mood');
  }
  mood_bar.style.width = Math.min(100, mood) + '%';
}

function startGame() {
  energy = mood = 100;
  adjustEnergy(0);
  adjustMood(0);
}

// Load Game Data
var req = new XMLHttpRequest();
req.open('GET', './data.json', true);
req.onreadystatechange = function () {
  if (req.readyState != 4 || req.status !== 200) return;
  game_data = JSON.parse(req.responseText);
  startGame();
}
req.send();

// FOR TESTING ONLY!
energy_bar.addEventListener('click', function () {
  adjustEnergy(-10);
});

mood_bar.addEventListener('click', function () {
  adjustMood(-8);
});