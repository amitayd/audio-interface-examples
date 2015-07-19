function startTouchSynth() {

  var touchWidget = createWidget('multitouch', {
    width: '100%',
    height: '80%',
    top: 0,
    left: 0
  }, {
    text: 'TOUCH ME!!!'
  });

  var tilt = createWidget('tilt', {
    top: '80%',
    left: '0%',
    width: '25%',
    height: '20%'
  });

  var effect1 = new Tone.AutoWah();
  var synth1 = new Tone.SimpleSynth().chain(effect1, Tone.Master);
  var synth2 = new Tone.SimpleSynth().toMaster();


  touchWidget.on('*', function (data) {

    if (data.touch0 && data.touch0.x && data.touch0.y) {
      touch(0, data.touch0.x, data.touch0.y);
    } else {
      stopTouch(0);
    }

    if (data.touch1 && data.touch1.x && data.touch1.y) {
      touch(1, data.touch1.x, data.touch1.y);
    } else {
      stopTouch(1);
    }

  });

  tilt.on('*', function(data) {
    effect1.wet = Math.abs(data.x);
  });


  function touch(touchIndex, x, y) {
    var freq = x * 50 + 400;
    var volume = y;

    switch (touchIndex) {
    case 0:
      if (!synth1.isPlaying) {
        synth1.triggerAttack(freq, null, volume);
        synth1.isPlaying = true;
      } else {
        synth1.setNote(freq);
        synth1.volume.value = volume;

      }
      break;
    case 1:
      synth2.triggerAttack(freq, null, volume);
      break;
    }

  }

  function stopTouch(touchIndex) {
    switch (touchIndex) {
    case 0:
      synth1.triggerRelease();
      synth1.isPlaying = false;
      break;
    case 1:
      synth2.triggerRelease();
      break;
    }
  }


  // gridToggle.on('*', function (data) {
  //   console.log(data);

  //   if (data.value == 1) {
  //     touchWidget.mode = 'matrix';
  //   } else {
  //     touchWidget.mode = 'normal';
  //   }
  //   touchWidget.init();
  // });

}