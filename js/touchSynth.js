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

  var effect1 = new Tone.Chorus();
  var synths = [
    new Tone.SimpleSynth().chain(effect1, Tone.Master),
    new Tone.AMSynth().toMaster()
  ];



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

  tilt.on('*', function (data) {
    effect1.wet.value = Math.abs(data.x);
  });


  function touch(touchIndex, x, y) {
    var synth = synths[touchIndex];
    if (!synth) {
      return;
    }

    var freq = x * 50 + 400;
    if (touchIndex === 0) {
      freq = nx.mtof(Math.floor(x * 10) + 60);
    }
    // No reason why gainToDB is on Synth in particular, it's only since it has Tone as the prototype
    var volumeDb = synth.gainToDb(Math.max(y, 0));

    synth.volume.value = volumeDb;
    if (!synth.isPlaying) {
      synth.triggerAttack(freq, null);
      synth.isPlaying = true;
    } else {
      synth.setNote(freq);
    }
  }

  function stopTouch(touchIndex) {
    var synth = synths[touchIndex];
    synth.triggerRelease();
    synth.isPlaying = false;
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