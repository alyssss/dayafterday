function getElement(className) {
  return document.getElementsByClassName(className)[0];
}

var splash_screen = getElement('splash-screen');
var day_field = getElement('day');
var location_field = getElement('location');
var background_img = getElement('background');

var message_field = getElement('message');
var choice_btns = [
  getElement('choice1'),
  getElement('choice2'),
  getElement('choice3')
];

var energy_bar = getElement('energy-bar');
var mood_bar = getElement('mood-bar');

var done = getElement('done');
var out_of_energy = getElement('out-of-energy');
var out_of_mood = getElement('out-of-mood');
var restart = getElement('restart');

var game_data;

var state = {};

function finishGame(energyOrMood) {
  if (state.done) {
    return;
  }
  state.done = true;
  if (energyOrMood === 'energy') {
    out_of_energy.style.display = 'block';
    out_of_mood.style.display = 'none';
  } else {
    out_of_energy.style.display = 'none';
    out_of_mood.style.display = 'block';
  }
  done.style.display = 'block';
}

function adjustEnergy(delta) {
  state.energy += delta;
  if (state.energy <= 0) {
    finishGame('energy');
  } else if (state.energy > 100) {
    state.energy = 100;
  }
  energy_bar.style.width = Math.min(100, state.energy) + '%';
}

function adjustMood(delta) {
  state.mood += delta;
  if (state.mood <= 0) {
    finishGame('mood');
  } else if (state.mood > 100) {
    state.mood = 100;
  }
  mood_bar.style.width = Math.min(100, state.mood) + '%';
}

function loadStep() {
  var step = game_data[current_step];
  
  day_field.innerHTML = step.day;
  location_field.innerHTML = step.location;
  background_img.src = 'images/' + step.background;
  
  message_field.innerHTML = step.message;
  
  state.choices = [null, null, null];
  if (step.choices.length === 3) {
    state.choices = step.choices;
  } else if (step.choices.length === 2) {
    state.choices[1] = step.choices[0];
    state.choices[2] = step.choices[1];
  } else if (step.choices.length === 1) {
    state.choices[2] = step.choices[0];
  }
  
  state.choices.forEach(function (choice, i) {
    if (choice) {
      choice_btns[i].style.display = 'block';
      choice_btns[i].innerHTML = choice.text;
    } else {
      choice_btns[i].style.display = 'none';
    }
  });
}

function startGame() {
  state.energy = state.mood = 100;
  state.done = false;
  adjustEnergy(0);
  adjustMood(0);
  current_step = 0;
  loadStep();
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

// Event Handlers
function choiceHandler(idx) {
  adjustEnergy(state.choices[idx].energy);
  adjustMood(state.choices[idx].mood);
  current_step++;
  if (state.choices[idx].skip) {
    current_step += state.choices[idx].skip;
  }
  loadStep();
}

choice_btns[0].addEventListener('click', function () {
  choiceHandler(0);
});
choice_btns[1].addEventListener('click', function () {
  choiceHandler(1);
});
choice_btns[2].addEventListener('click', function () {
  choiceHandler(2);
});

splash_screen.addEventListener('click', function () {
  splash_screen.style.opacity = 0;
  setTimeout(function () {
    splash_screen.style.display = 'none';
  }, 2000);
});

restart.addEventListener('click', function () {
  done.style.display = 'none';
  startGame();
});

// Hidden functionality - clicking on the day field dismisses the 'done' dialog
day_field.addEventListener('click', function () {
  if (state.done) {
    done.style.display = 'none';
  }
});

