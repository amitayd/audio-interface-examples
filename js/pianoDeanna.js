var keyboard = createKeyboard({ width: '100%',
                                height: '100%',
                                top; '0%',
                                left: '0%',
                                octaves: 2
                                });

/*
Dilemma:
Using new or create function?
I guess it better if it would be with the same as creating widget
*/
var synth = createSynth(); 


keyboard.onPress(function(note) {
  /*
  Dilemma:
  Working with frequencies or notes?
  Because i think we will do some continous playing, so we we'll use frequencies at the end.
  */
  var frequency = note2frequency(note);
  /*
  Dilemma:
  Which kind of timing? For the piano I think for sure seconds, it's the most intuitive one
  And there is not so much need for notes
  (It's more relevant to the sequencing and sampling)
  */
  synth.triggerAttack(frequency, 0.25);
})

keyboard.onRelease(function(note) {
  synth.triggerRelease();
})


synth.toMaster();