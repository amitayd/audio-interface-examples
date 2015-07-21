"use strict";
/* global module, Tone */


var tone = new Tone();

module.exports = {
  midiToNote: tone.midiToNote.bind(tone),
  noteToMidi: tone.noteToMidi.bind(tone)
};