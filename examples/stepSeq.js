function runApp() {

} // TODO: put correct location
var metronomeWidget = createWidget('metronome', {
  width: '10%',
  height: '10%',
  top: '0%',
  left: '0%',
  bpm: 120
});


var matrixWidget = createWidget('matrix', {
  width: '100%',
  height: '90%',
  top: '10%',
  left: '0%',
  rows: 3,
  cols: 8
});


var synth1 = createSimpleSynth();
var synth2 = createSimpleSynth();
var synth3 = createSimpleSynth();

var currentStep = 0;

metronomeWidget.onTick(function () {
  matrixWidget.place = currentStep;

  var currentRows = matrixWidget.matrix[currentStep];

  /*
  Note:
  First we will do that like that, and then teach about for loops!
  */

  if (currentRows[0] == true) {
    synth1.triggerAttackRelease(440, 0.25);
  }

  if (currentRows[1] == true) {
    synth2.triggerAttackRelease(880, 0.25);
  }

  if (currentRows[2] == true) {
    synth3.triggerAttackRelease(1760, 0.25);
  }

  currentStep = currentStep + 1;

  if (currentStep == matrixWidget.cols) {
    currentStep = 0;
  }
});

metronomeWidget.start();