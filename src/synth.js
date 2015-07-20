"use strict";
/* global Tone, module */

function createSimpleSynth(attributes) {
  var synth = new Tone.SimpleSynth();
  synth.chain(Tone.Master);
  return synth;
}

module.exports = {
  createSimpleSynth: createSimpleSynth
};