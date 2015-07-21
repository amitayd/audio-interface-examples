var matrixWidget = createWidget('matrix', {
  width: '100%',
  height: '100%',
  top: '0%',
  left: '0%',
  row: 3,
  col: 8
});


// TODO: put correct location
var metronomWidget = createWidget('metronom', {
  width: '100%',
  height: '100%',
  top: '0%',
  left: '0%',
  bpm: 120
});

var synth1 = createSimpleSynth();
var synth2 = createSimpleSynth();
var synth3 = createSimpleSynth();

var currentStep = 0;

metronomWidget.onTick(function() {
  matrixWidget.place = currentStep;

  var currentRows = matrixWidget.matrix[currentStep];

  /*
  Note:
  First we will do that like that, and then teach about for loops!
  */

  if (currentRows[0] == true) {
    synth1.triggerAttackRelease(synths[i].triggerAttackRelease(440, 0.25));
  }

  if (currentRows[1] == true) {
    synth2.triggerAttackRelease(synths[i].triggerAttackRelease(880, 0.25));
  }

  if (currentRows[2] == true) {
    synth3.triggerAttackRelease(synths[i].triggerAttackRelease(1760, 0.25));
  }

  currentStep = currentStep + 1
  
  if (currentStep == matrixWidget.col) {
    currentStep = 0;
  }
  

});

metronom.start();