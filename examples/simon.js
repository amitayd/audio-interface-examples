function runApp() {

  var button1 = createWidget('button', {
    width: '50%',
    height: '40%',
    top: '0%',
    left: '0%'
  });

  var button2 = createWidget('button', {
    width: '50%',
    height: '40%',
    top: '0%',
    left: '50%'
  });

  var button3 = createWidget('button', {
    width: '50%',
    height: '40%',
    top: '40%',
    left: '0%'
  });

  var button4 = createWidget('button', {
    width: '50%',
    height: '40%',
    top: '40%',
    left: '50%'
  });

  var text1 = createWidget('comment', {
    width: '50%',
    height: '20%',
    top: '80%',
    left: '0%'
  });

  var buttons = [
    button1, button2, button3, button4
  ];


  function setText(text) {
    text1.val.text = text;
    text1.init();
  }

  setText('Welcome!');

  var notes = [];
  var position = 0;
  var playerPosition = 0;


  var synth = new Tone.SimpleSynth().toMaster();

  function getButtonFreq(buttonIndex) {
    return nx.mtof(60 + buttonIndex * 2);
  }

  // Tone.Transport.setInterval(function (time) {
  //   console.log('interval', time);
  // });


  function playStage() {
    var wait = 1;

    playerPosition = 0;
    Tone.Transport.clearTimelines();
    Tone.Transport.position = 0;

    function addTimeLine(time, button) {
      Tone.Transport.setTimeout(function () {
        console.log('timeLine1', time, button);
        var freq = getButtonFreq(button);
        synth.triggerAttackRelease(freq, 0.25);
        buttons[button].val.press = 1;
        buttons[button].draw();
      }, wait + time);

      Tone.Transport.setTimeout(function () {
        buttons[button].val.press = 0;
        buttons[button].draw();
      }, wait + time + 0.5);
    }

    var button = getRandomInt(0, 3);
    notes.push(button);

    for (var i = 0; i < notes.length; i++) {
      addTimeLine(i, notes[i]);
    }

    //Tone.Transport.stop();
    Tone.Transport.start();
  }


  buttons.forEach(function (button) {
    button.on('*', function (data) {
      if (data.press === 0) {
        return;
      }

      var buttonIndex = buttons.indexOf(button);
      var freq = getButtonFreq(buttonIndex);
      console.log('guess:', playerPosition, notes[playerPosition], buttonIndex);

      if (notes[playerPosition] != buttonIndex) {
        setText('try again!');
        notes = [];
        playStage();
      } else {
        synth.triggerAttackRelease(freq, 0.25);
        playerPosition++;
        if (playerPosition === notes.length) {
          setText('Good Job! ' + notes.length + ' presses!')
          playStage();
        }
      }

    });
  });


  playStage();
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}