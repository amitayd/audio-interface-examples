"use strict";
/* global Tone, module */

function createSimpleSynth(attributes) {
  var synth = new Tone.SimpleSynth();
  synth.chain(Tone.Master);
  return synth;
}

function createPolySynth(attributes) {
  var polyphony = attributes.polyphony || 4;
  var voice = attributes.voice || Tone.PluckSynth;
  var synth = new Tone.PolySynth (polyphony, voice);
  synth.chain(Tone.Master);
  return synth;
}

module.exports = {
  createSimpleSynth: createSimpleSynth,
  createPolySynth: createPolySynth
};