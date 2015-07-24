window.Tone = require('../vendor/Tone.js');

var widgets = require('./widgets');
var instruments = require('./instruments');
var musical = require('./musical');
var nexus = require('../vendor/NexusUI/nexusUI.js');

// Copy all widgets functions to the global scope
Object.keys(widgets).forEach(function (key) {
  window[key] = widgets[key];
});

Object.keys(instruments).forEach(function (key) {
  window[key] = instruments[key];
});

Object.keys(musical).forEach(function (key) {
  window[key] = musical[key];
});

Tone.Transport.start();


window.setBPM = function(bpm) {
  Tone.Transport.bpm.value = bpm;
};