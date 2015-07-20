window.Tone = require('../vendor/Tone.js');

var widgets = require('./widgets');
var synth = require('./synth');
var nexus = require('../vendor/NexusUI/nexusUI.js');

// Copy all widgets functions to the global scope
Object.keys(widgets).forEach(function (key) {
  window[key] = widgets[key];
});

Object.keys(synth).forEach(function (key) {
  window[key] = synth[key];
});