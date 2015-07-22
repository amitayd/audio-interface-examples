window.keyboard = createWidget('keyboard', {
  width: '100%',
  height: '100%',
  top: '0%',
  left: '0%',
  octaves: 3,
  startNote: 'a5'
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
  // For some reason triggerAttack(note, 0) has better performance, less clicks
  synth.triggerAttack(note);
});

keyboard.onRelease(function (note) {
  console.log("Release. note: %s", note);
  synth.triggerRelease();
});

keyboard.onPress(function (note) {
  noteLabel.text = note;
});