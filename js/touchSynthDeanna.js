/*
Dilemma:
new or function?
In this file I chossed new to check how it feels
*/

var touchWidget = new MultiTouchWidget({
  width: '100%',
  height: '80%',
  top: 0,
  left: 0,
  text: 'TOUCH ME!!!'
});

var tilt = new TiltWidget({
  top: '80%',
  left: '0%',
  width: '25%',
  height: '20%'
});

var chorusEffect = new ChorusEffect();

/*
Dilemma:
Because every synth is connected directly to master by creation
adding fx to each synth
*/

synth1.fx.add(chorusEffect);

/*
Dilemma:
Using array or sperating to different vars.
Because the array doesnt have a real meaning
(e.g. 2D pixels array of picture, or one coloumn in the sequencer have a real meaining)
I choosed to seperate vars
*/
var synth1 = new SimpleSynth();
var synth2 = new AMSynth();

touchWidget.onTouch1Start(function(x, y) {
    /*
    Dilemma:
    The concept of value is very powerful when using signals
    We are using just numbers and not connecting other components
    So there is no point in using value, lets just put numbers in the args
    Nice To Have: I would like to be able using in rampTo & still being able to work with signal for advanced girls
    */
    synth1.volume = Math.max(y, 0);

    var freq = note2frequency(Math.floor(x * 10) + 60);
    synth1.triggerAttack(freq);
});

touchWidget.onTouch1Move(function(x, y) {    
    synth1.volume = Math.max(y, 0);

    var freq = note2frequency(Math.floor(x * 10) + 60);
    synth1.frequency = freq;
});

touchWidget.onTouch1End(function(x, y) {
  synth1.triggerRelease();
});

touchWidget.onTouch2Start(function(x, y) {
  synth1.volume = Math.max(y, 0);

  var freq = x * 50 + 400;
  synth2.triggerAttack(freq);
});

touchWidget.onTouch12ove(function(x, y) {
  synth2.volume = Math.max(y, 0);

  var freq = x * 50 + 400;
  synth2.frequency = freq;

});

touchWidget.onTouch2End(function(x, y) {
  synth2.triggerRelease();
});


tilt.onChange(function (x, y) {
  chorusEffect.wet = Math.abs(x);
})

