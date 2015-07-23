guitarWidget = createWidget('strings', {
  width: '100%',
  height: '100%',
  top: '0%',
  left: '0%',
  numberOfStrings: 3,
  friction: 10,
});

stringLabel = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '90%',
  text: 'Pluck me! :)'
});

var synths = [];


synth = createPolySynth({
  polyphony: guitarWidget.numberOfStrings,
  voice: Tone.SimpleSynth
});

//synth = createSimpleSynth();

var scale = getNoteScale('a3', 'major');

guitarWidget.onPluck(function (stringIndex, x) {
  var notes;

  if (x < 25) {
    scaleIndex = 0;
  } else if (x < 50) {
    scaleIndex = 1;
  } else if (x < 75) {
    scaleIndex = 2;
  } else {
    scaleIndex = 3;
  }

  var baseNote = scale[scaleIndex];
  notes = getChordNotes(baseNote, 'minor');

  var note = notes[stringIndex];
  console.log(note);
  synth.triggerAttackRelease(note, 0.25, "+0.01");
});