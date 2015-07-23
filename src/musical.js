"use strict";
/* global module, Tone, require */

var teoria = require('teoria');

var tone = new Tone();

function scientific(note) {
  return note.scientific();
}

function fq(note) {
  return note.fq();
}

module.exports = {
  midiToNote: tone.midiToNote.bind(tone),
  noteToMidi: tone.noteToMidi.bind(tone),
  getChordNotes: function(note, chord) {
    chord = chord || 'major';
    return teoria.note(note).chord(chord).notes().map(fq);
  },
  getNoteScale: function(note, scale) {
    scale = scale || 'major';
    return teoria.note(note).scale(scale).notes().map(scientific);
  },
  teoria: teoria
};