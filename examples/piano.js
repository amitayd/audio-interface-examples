keyboard = createWidget('keyboard', {
  width: '100%',
  height: '100%',
  top: '0%',
  left: '0%',
  octaves: 2,
  startNote: 'c5'
});

noteLabel = createWidget('label', {
  width: '20%',
  height: '10%',
  top: '90%',
  left: '80%',
  text: 'hello'
});

synth = createInstrument('simple', {polyphony:2});


keyboard.onPress(function (note) {
  console.log("Press. Note: %s", note);
  // For some reason triggerAttack(note, 0) has better performance, less clicks
  synth.play(note);
  noteLabel.text = note;
});

keyboard.onRelease(function (note) {
  console.log("Release. note: %s", note);
  synth.stop();
});
