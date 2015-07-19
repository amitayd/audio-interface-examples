var widgetIdsByType = {};

function createWidgetId(type) {
  var lastId = widgetIdsByType[type] || 0;
  var newId = lastId + 1;
  widgetIdsByType[type] = newId;
  return type + String(newId);

}

function createWidget(type, style, nxAtrributes) {
  style = style || {};
  nxAtrributes = nxAtrributes || {};

  var element = document.createElement('canvas');
  element.id = createWidgetId(type);
  element.className = 'widget';

  Object.keys(style).forEach(function(key) {
    element.style[key] = style[key];
  });
  document.body.appendChild(element);

  var widget = nx.transform(element, type);

  Object.keys(nxAtrributes).forEach(function(key) {
    widget[key] = nxAtrributes[key];
  });

  widget.init();

  return widget;
}

function decimalToPercentString(number) {
  return String(number * 100) + "%";
}