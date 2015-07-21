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
        getter: function(nxWidget) {
          return nxWidget.val.text;
        },
        setter: function(nxWidget, value) {
          nxWidget.val.text = value;
          nxWidget.draw();
        }

      }
    }
  }
};


function createWidget(type, attributes) {
  var widgetDef = WIDGET_DEFS[type];
  if (!widgetDef) {
    throw new Error('No widget type defined: ' + type);
  }


  var element = document.createElement('canvas');
  element.id = createWidgetId(type);
  element.className = 'widget';
  document.body.appendChild(element);

  var widget = {};



  // Create style attributes as getter and setter with nx widget initialization
  Object.keys(STYLE_ATTRIBUTES).forEach(function (attribute) {
    Object.defineProperty(widget, attribute, {
      get: function () {
        return element.style[attribute];
      },
      set: function (value) {
        element.style[attribute] = value;
        //nxWidget.resize();
      }
    });

    // Canvas properties should be set in advance for nexusosc to work
    if (attributes[attribute]) {
      element.style[attribute] = attributes[attribute];
    }
  });

  var nxWidget = nx.transform(element, widgetDef.nxType);

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
  var emitter = eventEmitter({});
  nxWidget.on('*', function (data) {
    widgetDef.nxEventRoute(widget, emitter, data);
  });

  if (widgetDef.events) {
    widgetDef.events.forEach(function (eventName) {
      // TODO: use currying (using lodash?) to make this clearer, since we're only proxying the emitter function
      widget[eventName] = function (listener) {
        emitter.on(eventName, listener);
      };
    });
  }


  nxWidget.init();

  return widget;
}


module.exports = {
  createWidget: createWidget
};