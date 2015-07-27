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
  var synth = new Tone.PolySynth(polyphony, voice);
  synth.chain(Tone.Master);
  return synth;
}

function capitalize(s) {
  // returns the first letter capitalized + the string from index 1 and out aka. the rest of the string
  return s[0].toUpperCase() + s.substr(1);
}


var normalRangeDecibleConversion = {
  aToB: function (normalRange) {
    return Tone.Master.gainToDb(normalRange);
  },
  bToA: function (db) {
    return Tone.Master.dbToGain(db);
  }
};

var toneAttribute = function (attributeName, type, conversion) {
  return {
    attributeName: attributeName,
    type: type,
    extend: function (instrument) {
      var tone = instrument._tone;
      Object.defineProperty(instrument, attributeName, {
        get: function () {
          var toneValue = tone[attributeName];
          var convertedToneValue = conversion ?conversion.bToA(toneValue) : toneValue;
          return convertedToneValue;
        },
        set: function (value) {
          var convertedToneValue = conversion ? conversion.aToB(value) : value;
          tone[attributeName] = convertedToneValue;
        }
      });
    }
  };
};


var toneSignalAttribute = function (attributeName, type, conversion) {
  return {
    attributeName: attributeName,
    type: type,
    extend: function (instrument) {
      var tone = instrument._tone;
      Object.defineProperty(instrument, attributeName, {
        get: function () {
          var toneValue = tone[attributeName].value;
          var convertedToneValue = conversion ?conversion.bToA(toneValue) : toneValue;
          return convertedToneValue;
        },
        set: function (value) {
          var convertedToneValue = conversion ? conversion.aToB(value) : value;
          tone[attributeName].value = convertedToneValue;
        }
      });


      // Define a 'setSomeAttributeAtTime' function
      var setValueAtTimeFuncName = 'set' + capitalize(attributeName) + 'AtTime';
      instrument[setValueAtTimeFuncName] = function (value, time, ramp) {
        var setFunction = 'setValueAtTime';
        if (ramp === 'exponential') {
          setFunction = 'exponentialRampToValueAtTime';
        } else if (ramp) {
          setFunction = 'linearRampToValueAtTime';
        }

        tone[attributeName][setFunction](value, time);
      };
    }
  };
};

var DRUMS_SAMPLES = {
        'cymbal': 'resources/samples/drum_cymbal_soft.wav',
        'snare': 'resources/samples/drum_snare_hard.wav',
        'kick': 'resources/samples/drum_heavy_kick.wav',
        'tom': 'resources/samples/drum_tom_hi_hard.wav',
      };

var instruments = {
  'simple': {
    constructTone: function (attributes) {
      var polyphony = attributes.polyphony || 1;
      var voice = attributes.voice || Tone.SimpleSynth;
      return new Tone.PolySynth(polyphony, voice);
    },
    'attributes': [
      {attributeName: 'voices'},
      toneSignalAttribute('volume', 'normalRange', normalRangeDecibleConversion)
    ]
  },
  'drums': {
    constructTone: function (attributes) {
      return new Tone.Sampler(DRUMS_SAMPLES);
    },
    'attributes': [
      toneSignalAttribute('volume', 'normalRange', normalRangeDecibleConversion),
      toneAttribute('pitch', 'interval', normalRangeDecibleConversion)
    ]
  }
};

function createInstrument(instrumentType, attributes) {
  attributes = attributes || {};

  var instrumentDef = instruments[instrumentType];
  var tone = instrumentDef.constructTone(attributes);

  var playedNotes = [];

  var play = function (note, duration, startTime) {
    playedNotes.push(note);
    if (duration) {
      tone.triggerAttackRelease(note, duration, startTime);
    } else {
      tone.triggerAttack(note, startTime);
    }

  };

  var stopPoly = function (startTime, note) {
    // if a note is given then stop only that note, otherwise stop all underlying voices
    if (note) {
      tone.triggerRelease(note, startTime);
    } else {
      playedNotes.forEach(function(note) {
        tone.triggerRelease(note, startTime);
      });
      playedNotes = [];

    }
  };

  var stopMono = tone.triggerRelease.bind(tone);


  var instrument = {
    play: play,
    stop: tone.voices ? stopPoly : stopMono,
    _tone: tone
  };

  instrumentDef.attributes.forEach(function(attribute) {
    if (attribute.extend) {
      attribute.extend(instrument);
    }
  });

  Object.keys(attributes).forEach (function(attribute) {
    if (!instrumentDef.attributes[attribute]) {
      //throw new Error('Instrument does not have attribute ' + attribute + ' defined.');
    }
    instrument[attribute] = attributes[attribute];
  });

  instrument._tone.toMaster();

  return instrument;

}

module.exports = {
  createSimpleSynth: createSimpleSynth,
  createPolySynth: createPolySynth,
  createPlayer: createPlayer,
  createSampler: createSampler,
  createInstrument: createInstrument
};