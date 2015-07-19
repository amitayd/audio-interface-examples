function startStepSeq1() {
  var matrix1Element = document.createElement('canvas');
  matrix1Element.id = 'matrix1';
  matrix1Element.className = 'widget';
  matrix1Element.style.width = '100%';
  matrix1Element.style.height = '100%';
  matrix1Element.style.top = '0%';
  matrix1Element.style.left = '0%';

  document.body.appendChild(matrix1Element);

  var matrixWidget = nx.transform(matrix1Element, 'matrix');

  matrixWidget.row = 3;
  matrixWidget.col = 8;

  var synths = [
    new Tone.SimpleSynth().toMaster(),
    new Tone.SimpleSynth().toMaster(),
    new Tone.SimpleSynth().toMaster(),
  ];

  matrixWidget.on('*', function (data) {
    if (data.list) {
      console.log('sequencing');
      for (var i = 0; i < data.list.length; i++) {
        var shouldPlay = data.list[i] === 1;
        console.log('shouldPlay', i, shouldPlay);
        if (shouldPlay) {
          synths[i].triggerAttackRelease(440 * (i + 1), 0.25);
        }
      }

    } else {
      console.log('changing');
    }
  });

  matrixWidget.init();
  matrix1.sequence(120);
}


function startStepSeq() {
  var matrix1Element = document.createElement('canvas');
  matrix1Element.id = 'matrix1';
  matrix1Element.className = 'widget';
  matrix1Element.style.width = '100%';
  matrix1Element.style.height = '100%';
  matrix1Element.style.top = '0%';
  matrix1Element.style.left = '0%';

  document.body.appendChild(matrix1Element);

  var matrixWidget = nx.transform(matrix1Element, 'matrix');

  matrixWidget.row = 3;
  matrixWidget.col = 8;

  var synths = [
    new Tone.SimpleSynth().toMaster(),
    new Tone.SimpleSynth().toMaster(),
    new Tone.SimpleSynth().toMaster(),
  ];

  Tone.Transport.bpm.value = 120;

  var currentStep = 0;

  Tone.Transport.setInterval(function (time) {
    // Update widget display state
    matrixWidget.place = currentStep;
    matrixWidget.init();

    var currentRows = matrixWidget.matrix[currentStep];

    for (var i = 0; i < currentRows.length; i++) {
      var shouldPlay = currentRows[i] === 1;
      console.log('shouldPlay', i, shouldPlay);
      if (shouldPlay) {
        synths[i].triggerAttackRelease(440 * (i + 1), 0.25);
      }
    }

    currentStep = (currentStep + 1) % matrixWidget.col;

    console.log('transport signal', time);
  }, "4n");

  Tone.Transport.start();

  matrixWidget.init();

}