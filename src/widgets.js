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


function nxColorAttribute(colorName) {
  return {
    getter: function (widget) {
      return widget._nxWidget.colors[colorName];
    },
    setter: function (widget, value) {
      widget._nxWidget.colors[colorName] = value;
      widget._nxWidget.init();
    }
  };
}

var enabledAttribute = {
  valueType: Boolean,
  defaultValue: true,
  getter: function (widget) {
    return widget._data.enabled;
  },
  setter: function (widget, value) {
    var containerElement = widget._containerElement;
    value = !!value;
    widget._data.enabled = value;
    containerElement.style.pointerEvents = value ? '' : 'none';
    // TODO: Disabled due to a problem
    containerElement.style.opacity = value ? 1 : 1;
  }
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

function nxSetter(attributeName, setFunctonName) {
  return {
    getter: function (widget) {
      return widget._nxWidget[attributeName];
    },
    setter: function (widget, value) {
      widget._nxWidget[setFunctonName](value);
    }
  };
}

function nxValue(attributeName) {
  return {
    getter: function (widget) {
      return widget._nxWidget.val[attributeName];
    },
    setter: function (widget, value) {
      widget._nxWidget.val[attributeName] = value;
      widget._nxWidget.init();
    }
  };
}

function dataAttribute(valueType, defaultValue, attributeName) {
  return {
    getter: function (widget) {
      return widget._data[attributeName];
    },
    setter: function (widget, value) {
      widget._data[attributeName] = value;
    },
    defaultValue: defaultValue,
    valueType: valueType
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

  'strings': {
    nxType: 'string',
    events: ['onPluck'],
    attributes: {
      'friction': nxAttribute('friction'),
      'numberOfStrings': nxSetter('numberOfStrings', 'setStrings')
    },
    nxEventRoute: function (widget, emitter, data) {
      emitter.emit('onPluck', data.string, data.x * 100);
    }
  },

  'button': {
    nxType: 'button',
    events: ['onPress', 'onRelease'],
    attributes: {},

    methods: {
      'press': {
        func: function (widget) {

          widget._nxWidget.set({
            'press': 1
          }, true);
        }
      },
      'release': {
        func: function (widget) {
          widget._nxWidget.set({
            'press': 0
          });
        }
      },
      'pressRelease': {
        func: function (widget, time) {
          time = time || 0.25;
          widget.press();
          setTimeout(_.partial(widget.release, widget), time * 1000);
        }
      },
    },

    nxEventRoute: function (widget, emitter, data) {
      if (data.press === 0) {
        emitter.emit('onRelease');
      } else {
        emitter.emit('onPress');
      }
    },
  },

  'label': {
    nxType: 'comment',
    attributes: {
      'text': nxValue('text'),
      'size': nxSetter('size', 'setSize')
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
    events: ['onTick', 'onEnd'],
    attributes: {
      interval: dataAttribute('interval', '4n', 'interval'),
    },
    init: function (widget) {

      widget.start = function (options) {
        var BUTTON_CLICK_TIME = 100;

        options = options || {};
        var ticks = options.ticks || null;
        var wait = options.wait || 0;
        if (widget._interval) {
          widget.stop();
        }
        var interval = widget.interval || '4n';
        var tickIndex = 0;

        var scheduleTransport = function () {
          widget._interval = Tone.Transport.setInterval(function (time) {

            widget._emitter.emit('onTick', time, tickIndex);
            tickIndex++;
            widget._nxWidget.val.press = 1;
            widget._nxWidget.draw();
            window.setTimeout(function () {
              widget._nxWidget.val.press = 0;
              widget._nxWidget.draw();
            }, BUTTON_CLICK_TIME);
            if (tickIndex === ticks) {
              widget.stop();
              widget._emitter.emit('onEnd');
              return;
            }



          }, interval);
        };

        if (!wait) {
          scheduleTransport();
        } else {
          setTimeout(scheduleTransport, wait * 1000);
        }




      };

      widget.stop = function () {
        Tone.Transport.clearInterval(widget._interval);
      };
    }
  },
};

// Extend defs with some common attributes
Object.keys(WIDGET_DEFS).forEach(function (key) {
  var def = WIDGET_DEFS[key];

  def.attributes.enabled = enabledAttribute;

  if (def.nxType) {
    //“accent”, “fill”, “border”, “black”, and “white”)
    ['accent', 'fill', 'border', 'black', 'white'].forEach(function(color) {
      def.attributes[color+'Color'] = nxColorAttribute(color);
    });
  }

});


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
  widget._containerElement = containerElement;
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

    if (attributeSettings.hasOwnProperty('defaultValue')) {
      widget[attribute] = attributeSettings.defaultValue;
    }
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

  if (widgetDef.methods) {
    Object.keys(widgetDef.methods).forEach(function (methodName) {
      var functionDef = widgetDef.methods[methodName];
      widget[methodName] = _.partial(functionDef.func, widget);
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