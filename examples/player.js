button1 = createWidget('button', {
  width: '30%',
  height: '30%',
  top: '0%',
  left: '0%'
});

position1 = createWidget('position', {
  width: '50%',
  height: '50%',
  top: '00%',
  left: '50%',
  fillColor: 'blue'
});


button2 = createWidget('button', {
  width: '20%',
  height: '30%',
  top: '50%',
  left: '0%',
  fillColor: 'red'
});

button3 = createWidget('button', {
  width: '20%',
  height: '30%',
  top: '50%',
  left: '20%',
  fillColor: 'red'
});

button4 = createWidget('button', {
  width: '20%',
  height: '30%',
  top: '50%',
  left: '40%',
  fillColor: 'red'
});

button5 = createWidget('button', {
  width: '20%',
  height: '30%',
  top: '50%',
  left: '60%',
  fillColor: 'red'
});

player = createPlayer('resources/samples/drum_cymbal_soft.wav');
// sampler = createSampler({
//   'cymbal': 'resources/samples/drum_cymbal_soft.wav',
//   'snare': 'resources/samples/drum_snare_hard.wav',
//   'kick': 'resources/samples/drum_heavy_kick.wav',
//   'tom': 'resources/samples/drum_tom_hi_hard.wav',
// });
// 

drums = createInstrument('drums');

Tone.Buffer.onload = function() {
  button1.onPress(function() {
    player.stop();
    player.start();
  });

  position1.onPress(function(x, y) {
    drums.pitch = y * 10;
    drums.volume = x;
  });

  position1.onMove(function(x, y) {
    drums.volume = x;
    drums.pitch = y * 10;
  });

  button2.onPress(function() {
    drums.play('cymbal');
  });

  button3.onPress(function() {
    drums.play('snare');
  });

  button4.onPress(function() {
    drums.play('kick');
  });

  button5.onPress(function() {
    drums.play('tom');
  });
};