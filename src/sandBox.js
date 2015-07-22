function getContentWindow(iframe) {
  var iframewindow = iframe.contentWindow ?
    iframe.contentWindow :
    iframe.contentDocument.defaultView;
  return iframewindow;
}

var sandboxRunner = {
  executeInIframeSandbox: function (input) {
    var html = input.compiledHtml;
    var $element = input.resultsElement;

    var existingIframe = $('iframe', $element);

    if (existingIframe.length) {
      existingIframe.remove();
    }

    var iframe = $('<iframe>');
    iframe.width($element.width());
    iframe.height($element.height());
    $element.append(iframe);


    var contentDocument = iframe.contents()[0];

    var deferred = Q.defer();

    iframe.bind('load', function () {
      var iframewindow = getContentWindow(iframe[0]);
      // execute the entry function
      // TODO: this should somehow be configured externally, and support globals
      if (iframewindow.sandboxEntry) {
        iframewindow.sandboxEntry();
      }
      deferred.resolve({
        sandboxIframeWindow: iframewindow
      });
    });


    contentDocument.open();
    contentDocument.write(html);
    contentDocument.close();
    return deferred.promise;
  }
};

