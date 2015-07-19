function startPiano() {
  // Create the element
  var keyboardElement = document.createElement('canvas');
  keyboardElement.id = 'keyboard1';
  keyboardElement.className = 'widget';
  keyboardElement.style.width = '100%';
  keyboardElement.style.height = '100%';
  keyboardElement.style.top = '0%';
  keyboardElement.style.left = '0%';

  document.body.appendChild(keyboardElement);
  var keyboardWidget = nx.transform(keyboardElement, 'keyboard');
  keyboard1.octaves = 2;
  //keyboard1.mode = 'sustain';
  //keyboard1.midibase = 48;
  keyboardWidget.init();

  var chorus = new Tone.Chorus(4, 2.5, 0.5).toMaster();
  var synth = new Tone.SimpleSynth().connect(chorus);


  var keyboardHandler = function(data) {
    console.log(data);
    if (data.on !== 0) {
      var frequency = nx.mtof(data['note']);
      synth.triggerAttack(frequency, 0.25);
    } else {
      synth.triggerRelease();
    }
  };

  keyboardWidget.on('*', keyboardHandler);

}