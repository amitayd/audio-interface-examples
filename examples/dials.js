dial1 = createWidget('dial', {
  width: '20%',
  height: '20%',
  top: '5%',
  left: '5%',
  responsivity: 0.025
});

dial1Label = createWidget('label', {
  width: '20%',
  height: '10%',
  top: '25%',
  left: '5%',
  text: 'dial value'
});

slider1 = createWidget('slider', {
  width: '50%',
  height: '20%',
  top: '5%',
  left: '30%',
});

slider1Label = createWidget('label', {
  width: '20%',
  height: '10%',
  top: '25%',
  left: '30%',
  text: 'slider value'
});

slider2 = createWidget('slider', {
  width: '10%',
  height: '40%',
  top: '50%',
  left: '5%',
});


slider2Label = createWidget('label', {
  width: '20%',
  height: '10%',
  top: '90%',
  left: '5%',
  text: 'slider value'
});



dial1.onChange(function(value) {
  console.log(value);
  dial1Label.text = 'value: ' + value;
});

slider1.onChange(function(value) {
  console.log(value);
  slider1Label.text = 'value: ' + value;
});

slider2.onChange(function(value) {
  console.log(value);
  slider2Label.text = 'value: ' + value;
});


