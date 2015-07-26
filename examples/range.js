range1 = createWidget('range', {
  width: '40%',
  height: '20%',
  top: '5%',
  left: '5%',
  //mode: 'edge',
  mode: 'area',
  start: 0,
  stop: 1
});


tilt1 = createWidget('tilt', {
  width: '40%',
  height: '20%',
  top: '5%',
  left: '55%',
  active: true,
  text: 'El Tiltolator'
});

labelX = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '30%',
  left: '55%',
  text: 'x',
  size: 20
});

labelY = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '30%',
  left: '65%',
  text: 'y',
  size: 20
});

labelZ = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '30%',
  left: '75%',
  text: 'z',
  size: 20
});

number1 = createWidget('number', {
  width: '20%',
  height: '10%',
  top: '55%',
  left: '5%',
  min: -100,
  max: 100,
  decimalPlaces: 2,
  step: 0.5,
  sensitivity: 1
});


crossfader1 = createWidget('crossfade', {
  width: '20%',
  height: '10%',
  top: '55%',
  left: '55%',
  value: -0.25
});

range1.onChange(function (start, stop, end) {
  console.log(start, stop, end);
});

tilt1.onChange(function(x,y,z) {
  labelX.text = 'x:' + x;
  labelY.text = 'y:' + y;
  labelZ.text = 'z:' + z;
});

number1.onChange(function(value) {
  console.log(value);
});

crossfader1.onChange(function(value) {
  console.log(value);
});