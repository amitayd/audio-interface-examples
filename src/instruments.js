"use strict";
/* global Tone, module */

function createSimpleSynth(attributes) {
  var synth = new Tone.SimpleSynth();
  synth.chain(Tone.Master);
  return synth;
}

function createPlayer(sample, attributes) {
  var player = new Tone.Player(sample);
  player.chain(Tone.Master);
  return player;
}

function createSampler(samples, attributes) {
  var sampler = new Tone.Sampler(samples);
  sampler.chain(Tone.Master);
  return sampler;
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
  createPolySynth: createPolySynth,
  createPlayer: createPlayer,
  createSampler: createSampler
};