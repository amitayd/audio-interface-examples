
multitouch1 = createWidget('multitouch', {
  width: '100%',
  height: '90%',
  top: '0%',
  left: '0%',
  text: 'Touch me!'
});

touchLabel0 = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '50%',
  text: 'touch 0'
});

touchLabel1 = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '60%',
  text: 'touch 1'
});

touchLabel2 = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '70%',
  text: 'touch 2'
});

touchLabel3 = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '80%',
  text: 'touch 3'
});

touchLabel4 = createWidget('label', {
  width: '10%',
  height: '10%',
  top: '90%',
  left: '90%',
  text: 'touch 4'
});




multitouch1.onTouch0(function(x, y) {
  touchLabel0.text = x + ', ' + y;
});

multitouch1.onRelease0(function() {
  touchLabel0.text = 'released';
});

multitouch1.onTouch1(function(x, y) {
  touchLabel1.text = x + ', ' + y;
});

multitouch1.onRelease1(function() {
  touchLabel1.text = 'released';
});


multitouch1.onTouch2(function(x, y) {
  touchLabel2.text = x + ', ' + y;
});

multitouch1.onRelease2(function() {
  touchLabel2.text = 'released';
});

multitouch1.onTouch3(function(x, y) {
  touchLabel3.text = x + ', ' + y;
});

multitouch1.onRelease3(function() {
  touchLabel3.text = 'released';
});

multitouch1.onTouch4(function(x, y) {
  touchLabel4.text = x + ', ' + y;
});

multitouch1.onRelease4(function() {
  touchLabel4.text = 'released';
});

multitouch1.onChange(function(data) {
  //debugLabel.text = JSON.stringify(data);
});