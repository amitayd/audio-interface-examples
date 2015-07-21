"use strict";
/* global nx, module, require */

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


var WIDGET_DEFS = {

  'keyboard': {
    nxType: 'keyboard',
    events: ['onPress', 'onRelease'],
    nxAttributes: {
      'octaves': {},
      'startNote': {
        getter: function (nxWidget) {
          return midiToNote(nxWidget.midibase);
        },
        setter: function (nxWidget, value) {
          nxWidget.midibase = noteToMidi(value);
          nxWidget.init();
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
    nxAttributes: {
      'text': {
        getter: function (nxWidget) {
          return nxWidget.val.text;
        },
        setter: function (nxWidget, value) {
          nxWidget.val.text = value;
          nxWidget.draw();
        }

      }
    }
  },

  'metronome': {
    init: function (widget) {

    }
  },
};


function createWidget(type, attributes) {
  var widgetDef = WIDGET_DEFS[type];
  if (!widgetDef) {
    throw new Error('No widget type defined: ' + type);
  }

  var widget = {};
  var emitter = eventEmitter({});

  var canvasElement = document.createElement('canvas');
  canvasElement.id = createWidgetId(type);
  canvasElement.className = 'widget';
  canvasElement.style.width = '100%';
  canvasElement.style.height = '100%';
  var containerElement = document.createElement('div');
  containerElement.className = "widgetContainer";
  containerElement.appendChild(canvasElement);
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
          console.log('resizing');
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
    element.style.width = '100%';
    element.style.height = '100%';

    element.id = createWidgetId(type);
    element.className = 'widget';
    containerElement.appendChild(element);

    var nxWidget = nx.transform(element, widgetDef.nxType);
    widget._nxWidget = nxWidget;

    // Create nx widget attributes as getter and setter with nx widget initialization
    Object.keys(widgetDef.nxAttributes).forEach(function (attribute) {
      function defaultGetter() {
        return nxWidget(attribute);
      }

      function defaultSetter(value) {
        nxWidget[attribute] = value;
        nxWidget.init();
      }

      var attributeSettings = widgetDef.nxAttributes[attribute];
      var customGetter = attributeSettings.getter && _.partial(attributeSettings.getter, nxWidget);
      var customSetter = attributeSettings.setter && _.partial(attributeSettings.setter, nxWidget);

      Object.defineProperty(widget, attribute, {
        get: customGetter || defaultGetter,
        set: customSetter || defaultSetter
      });
    });


    if (widgetDef.nxEventRoute) {
      nxWidget.on('*', function (data) {
        widgetDef.nxEventRoute(widget, emitter, data);
      });
    }

    if (widgetDef.events) {
      widgetDef.events.forEach(function (eventName) {
        // TODO: use currying (using lodash?) to make this clearer, since we're only proxying the emitter function
        widget[eventName] = function (listener) {
          emitter.on(eventName, listener);
        };
      });
    }


    nxWidget.init();
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