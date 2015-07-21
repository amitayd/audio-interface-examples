"use strict";
/* global nx, Tone, module, require */

var musical = require('./musical');
var _ = require('lodash');
var eventEmitter = require('event-emitter');
var midiToNote = musical.midiToNote,
  noteToMidi = musical.noteToMidi;

var widgetIdsByType = {};


function createWidgetId(type) {
  var lastId = widgetIdsByType[type] || 0;
  var newId = lastId + 1;
  widgetIdsByType[type] = newId;
  return type + String(newId);
}

var STYLE_ATTRIBUTES = {
  'top': true,
  'left': true,
  'width': true,
  'height': true,
};

function nxAttribute(attributeName) {
  return {
    getter: function (widget) {
      return widget._nxWidget[attributeName];
    },
    setter: function (widget, value) {
      widget._nxWidget[attributeName] = value;
      widget._nxWidget.init();
    }
  };
}

function dataAttribute(attributeName) {
  return {
    getter: function (widget) {
      return widget._data[attributeName];
    },
    setter: function (widget, value) {
      widget._data[attributeName] = value;
    }
  };
}

var WIDGET_DEFS = {

  'keyboard': {
    nxType: 'keyboard',
    events: ['onPress', 'onRelease'],
    attributes: {
      'octaves': nxAttribute('octaves'),
      'startNote': {
        getter: function (widget) {
          return midiToNote(widget._nxWidget.midibase);
        },
        setter: function (widget, value) {
          widget._nxWidget.midibase = noteToMidi(value);
          widget._nxWidget.init();
        },
      }
    },
    nxEventRoute: function (widget, emitter, data) {
      if (data.on === 0) {
        emitter.emit('onRelease', midiToNote(data['note']));
      } else {
        emitter.emit('onPress', midiToNote(data['note']));
      }
    },
  },
  'label': {
    nxType: 'comment',
    attributes: {
      'text': {
        getter: function (widget) {
          return widget._nxWidget.val.text;
        },
        setter: function (widget, value) {
          widget._nxWidget.val.text = value;
          widget._nxWidget.draw();
        }

      }
    }
  },

  'matrix': {
    nxType: 'matrix',
    attributes: {
      cols: nxAttribute('col'),
      rows: nxAttribute('row'),
      place: nxAttribute('place'),
      matrix: nxAttribute('matrix')
    }
  },

  'metronome': {
    nxType: 'button',
    events: ['onTick'],
    attributes: {
      interval: dataAttribute('interval'),
    },
    init: function (widget) {

      widget.start = function () {
        var interval = widget.interval || '4n';

        widget._interval = Tone.Transport.setInterval(function (time) {
          widget._emitter.emit('onTick', time);
          widget._nxWidget.val.press = 1;
          widget._nxWidget.draw();
          window.setTimeout(function () {
            widget._nxWidget.val.press = 0;
            widget._nxWidget.draw();
          }, 100);

        }, interval);
      };

      widget.stop = function () {
        Tone.Transport.clearInterval(widget._interval);
      };
    }
  },
};


function createWidget(type, attributes) {
  var widgetDef = WIDGET_DEFS[type];
  if (!widgetDef) {
    throw new Error('No widget type defined: ' + type);
  }

  var widget = {
    _data: {},
    _nxWidget: undefined
  };
  var emitter = eventEmitter({});

  widget._emitter = emitter;


  var containerElement = document.createElement('div');
  containerElement.className = "widgetContainer";
  window.document.body.appendChild(containerElement);

  // Create style attributes as getter and setter with nx widget initialization
  Object.keys(STYLE_ATTRIBUTES).forEach(function (attribute) {
    Object.defineProperty(widget, attribute, {
      get: function () {
        return containerElement.style[attribute];
      },
      set: function (value) {
        containerElement.style[attribute] = value;
        // nx widget needs to be resized if the container element is resized
        if (widget._nxWidget) {
          containerElement.style[attribute] = value;
          var width = Number(window.getComputedStyle(containerElement, null).getPropertyValue('width').slice(0, -2));
          var height = Number(window.getComputedStyle(containerElement, null).getPropertyValue('height').slice(0, -2));
          widget._nxWidget.resize(width, height);
        }

      }
    });

    // Canvas properties should be set in advance for nexusosc to work
    if (attributes[attribute]) {
      containerElement.style[attribute] = attributes[attribute];
    }
  });

  if (widgetDef.nxType) {
    var element = document.createElement('canvas');
    element.id = createWidgetId(type);
    element.className = 'widget';
    element.style.width = '100%';
    element.style.height = '100%';

    element.id = createWidgetId(type);
    element.className = 'widget';
    containerElement.appendChild(element);

    var nxWidget = nx.transform(element, widgetDef.nxType);
    widget._nxWidget = nxWidget;


    if (widgetDef.nxEventRoute) {
      nxWidget.on('*', function (data) {
        widgetDef.nxEventRoute(widget, emitter, data);
      });
    }

    nxWidget.init();
  }

  // Create  attributes as getters and setters
  Object.keys(widgetDef.attributes).forEach(function (attribute) {
    var attributeSettings = widgetDef.attributes[attribute];
    var getter = _.partial(attributeSettings.getter, widget);
    var setter = _.partial(attributeSettings.setter, widget);

    Object.defineProperty(widget, attribute, {
      get: getter,
      set: setter
    });
  });

  if (widgetDef.init) {
    widgetDef.init(widget);
  }

  if (widgetDef.events) {
    widgetDef.events.forEach(function (eventName) {
      // TODO: use currying (using lodash?) to make this clearer, since we're only proxying the emitter function
      widget[eventName] = function (listener) {
        emitter.on(eventName, listener);
      };
    });
  }

  // Apply the passed attributes to the widget
  Object.keys(attributes).forEach(function (attribute) {
    if (!widget.hasOwnProperty(attribute)) {
      throw new Error('widget ' + type + ' does not have attribute ' + attribute);
    }
    // skip style attributes, since they are already created
    if (STYLE_ATTRIBUTES[attribute]) {
      return;
    }

    widget[attribute] = attributes[attribute];
  });


  // Route nx event to the router function of the widget

  return widget;
}


module.exports = {
  createWidget: createWidget
};