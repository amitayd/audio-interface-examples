window.metronome = createWidget('metronome', {
  width: '10%',
  height: '10%',
  top: '80%',
  left: '80%',
  interval: '4n'
});

window.button1 = createWidget('button', {
  width: '50%',
  height: '40%',
  top: '0%',
  left: '0%',
  fillColor: '#001bc9',
  accentColor: '#00083b'
});

var button2 = createWidget('button', {
  width: '50%',
  height: '40%',
  top: '0%',
  left: '50%',
  fillColor: '#0ad100',
  accentColor: '#045200'
});

var button3 = createWidget('button', {
  width: '50%',
  height: '40%',
  top: '40%',
  left: '0%',
  fillColor: '#f5f513',
  accentColor: '#525208'
});

var button4 = createWidget('button', {
  width: '50%',
  height: '40%',
  top: '40%',
  left: '50%',
  fillColor: '#ff0000',
  accentColor: '#4d0000'
});

var text1 = createWidget('label', {
  width: '50%',
  height: '20%',
  top: '80%',
  left: '0%'
});

var buttons = [
  button1, button2, button3, button4
];

var synth = createSimpleSynth();

var sequence = [];

var position = 0;
var notes = ['a5', 'b5', 'c5', 'd5'];
var isPlayerTurn = false;

text1.text = 'Welcome!';
setBPM(60);

buttons.forEach(function (button) {
  button.onPress(function (data) {

  });
});


// When it's the computer turn a new button is added to the sequence, and the metronome is 
// scheduled to play the notes.
// All the buttons are disabled to prevent the player incrementing the position

function computerTurn() {
  isPlayerTurn = false;
  var newButton = getRandomInt(0, 3);
  sequence.push(newButton);

  metronome.start({
    wait: 1,
    ticks: sequence.length
  });
}

// A metronome triggers clicking the button.
metronome.onTick(function (time, tick) {
  // Get the current step
  var buttonIndex = sequence[tick];
  buttons[buttonIndex].pressRelease(0.5);
});

// When the metronome stopped
metronome.onEnd(function (time, tick) {
  text1.text = 'Your turn!';

  position = 0;
  isPlayerTurn = true;
});


// Skips if it's not player's turn yet.
// If it's the expected button, increments the position to expect the next note.
// If it's the expected note, and the player played the entire sequence, computer turn.
// If it's wrong, reset the sequence and it's computer's turn again.
function checkPlayerNote(buttonIndex) {
  if (isPlayerTurn) {
    if (sequence[position] == buttonIndex) {
      position++;
      if (position == sequence.length) {
        text1.text = 'Correct! Number of steps:' + (position);
        computerTurn();
      }
    } else {
      text1.text = 'Wrong!';
      sequence = [];
      computerTurn();
    }
  }
}

button1.onPress(function () {
  synth.triggerAttackRelease('a5', 0.25);
  checkPlayerNote(0);
});

button2.onPress(function () {
  synth.triggerAttackRelease('b5', 0.25);
  checkPlayerNote(1);
});

button3.onPress(function () {
  synth.triggerAttackRelease('c5', 0.25);
  checkPlayerNote(2);
});

button4.onPress(function () {
  synth.triggerAttackRelease('d5', 0.25);
  checkPlayerNote(3);
});

// Start!
computerTurn();




// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}