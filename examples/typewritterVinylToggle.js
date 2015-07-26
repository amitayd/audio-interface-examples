toggle1 = createWidget('toggle', {
  width: '20%',
  height: '20%',
  top: '5%',
  left: '5%',
  on: true
});


typewriter1 = createWidget('typewriter', {
  width: '40%',
  height: '20%',
  top: '5%',
  left: '30%',
  active: true
});

vinyl1 = createWidget('vinyl', {
  width: '30%',
  height: '30%',
  top: '50%',
  left: '50%'
});

speedLabel = createWidget('label', {
  width: '30%',
  height: '10%',
  top: '80%',
  left: '50%'
});


toggle1.onChange(function(value) {
  console.log(value);
});

typewriter1.onPress(function(key, ascii) {
  console.log(key, ascii);
  if (key == 't') {
    toggle1.on = !toggle1.on;
  }
  if (key == '1') {
    vinyl1.defaultSpeed = 0;
  }
  if (key == '2') {
    vinyl1.defaultSpeed = 0.05;
  }
  if (key == '3') {
    vinyl1.defaultSpeed = 0.20;
  }
  if (key == 'space') {
    vinyl1.speed = 0.5;
  }
});

typewriter1.onRelease(function(key, ascii) {
  console.log(key, ascii);
});

vinyl1.onRotate(function(speed) {
  speedLabel.text = String(speed);
});