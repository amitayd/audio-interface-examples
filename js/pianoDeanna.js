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
I dont know now what is better "new" or function.
In this file I choosed create, in another one I'll try with new, just to get the feeling
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

  Amitay: Maybe a solution would be the "Frequency Type" of Tone.js, which uses either frequency in hz,
  and note names as note+Ocatave strings: 'a4', 'c5', etc
  http://tonejs.org/docs/#Frequency
  */
  synth.triggerAttack(frequency, 0.25);
})

keyboard.onRelease(function(note) {
  synth.triggerRelease();
})

/*
Dilemma:
Because we are not going to create crazy synth,
maybe by default (as in gibber.js), every new instrument is connected
to the master
*/
synth.toMaster();