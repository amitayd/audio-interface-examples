function runApp() {

  window.keyboard = createWidget('keyboard', {
    width: '100%',
    height: '100%',
    top: '0%',
    left: '0%',
    octaves: 2
  });

  window.noteLabel = createWidget('label', {
    width: '10%',
    height: '10%',
    top: '90%',
    left: '90%',
    text: 'hello'
  });

  synth = createSimpleSynth();


  keyboard.onPress(function (note) {
    console.log("Press. Note: %s", note);
    synth.triggerAttack(note);
  });

  keyboard.onRelease(function (note) {
    console.log("Release. note: %s", note);
    synth.triggerRelease();
  });

  keyboard.onPress(function (note) {
    noteLabel.text = note;
  });

}