(function(){

  var functionQueue = [];

  window.onload = runQueue;

  function runQueue() {
    functionQueue.forEach(function(fn){
      fn.call();
    })
  }

  var $l = window.$l = function(arg){

    if (typeof arg === 'string'){
       queryResult = [].slice.call(document.querySelectorAll(arg));
       return new DomNodeCollection(queryResult);
    }

    if (arg instanceof HTMLElement){
      return new DomNodeCollection([arg]);
    }

    if (typeof arg === 'function') {
      if (document.readyState === "complete") {
        arg.call(window);
      } else {
        functionQueue.push(arg);
      }
    }
  };

  var DomNodeCollection = function(htmlElements){
    this.htmlElements = htmlElements;
  };

  DomNodeCollection.prototype.html = function(arg){
    if (typeof arg === 'undefined'){
      return this.htmlElements[0].innerHTML;
    } else {
      this.htmlElements.forEach(function(el) {
        el.innerHTML = arg;
      });
    }
  };

  DomNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DomNodeCollection.prototype.append = function (arg) {
    if (arg instanceof HTMLElement) {
      this.htmlElements.forEach(function(el) {
        // var newEl = new DomNodeCollection(arg);
        el.appendChild(arg);
      });
    } else if (arg instanceof DomNodeCollection) {
      this.htmlElements.forEach(function(el) {
        arg.forEach(function(el2){
          el.appendChild(el2);
        });
      });
    } else if (typeof arg === "string") {
      this.htmlElements.forEach(function(el){
        var newElement = document.createElement(arg);
        el.appendChild(newElement);
      })
    }
  };

  DomNodeCollection.prototype.attr = function(attributeName, value) {
    if (typeof value === "undefined") {
      var firstEl = this.htmlElements[0];
      var myAttributes = firstEl.attributes;
      return myAttributes[attributeName].value;
    }
    this.htmlElements.forEach( function(el) {
      el.setAttribute(attributeName, value);
    });
  };


  DomNodeCollection.prototype.addClass = function(className) {
    this.htmlElements.forEach(function (el) {
      el.className += " " + className;
    });

  };

  DomNodeCollection.prototype.removeClass = function(className) {
    this.htmlElements.forEach(function (el) {
      el.className = el.className.replace(className, "");
    })
  };

  DomNodeCollection.prototype.children = function () {
    var allChildren = [];
    var queue = [];

    this.htmlElements.forEach( function(el) {
      queue = queue.concat(
        [].slice.call(el.children)
      );
    });

    while (queue.length > 0){
      var current = queue.shift();
      var currentChildren = current.children;
      if (typeof currentChildren !== 'undefined'){
        currentChildren = [].slice.call(currentChildren);
        queue = queue.concat(currentChildren);
      }
      allChildren = allChildren.concat(current);
    }

    return new DomNodeCollection(allChildren);
  };

  DomNodeCollection.prototype.parent = function() {
    var parents = [];
    this.htmlElements.forEach(function (el){
      parents.push(el.parentElement);
    });
    return new DomNodeCollection(parents);
  };

  DomNodeCollection.prototype.find = function(selector) {

    var allMatched = [].slice.call(document.querySelectorAll(selector));
    var matchedChildren = [];
    this.children().htmlElements.forEach( function (child) {
      if (allMatched.indexOf(child) !== -1) {
        matchedChildren.push(child);
      }
    });

    return new DomNodeCollection(matchedChildren);

  };

  DomNodeCollection.prototype.lastChild = function() {
    var lastChild = [this.children().htmlElements.slice(-1)[0]];
    return new DomNodeCollection(lastChild);
  }

  DomNodeCollection.prototype.remove = function () {
    this.htmlElements.forEach(function(el){
      el.remove();
    });
  };

  DomNodeCollection.prototype.on = function(type, listener){

    this.htmlElements.forEach(function(el){
      el.addEventListener(type, listener);

    });
  };

  DomNodeCollection.prototype.off = function(type, listener){

    this.htmlElements.forEach(function(el){
      el.removeEventListener(type, listener);
    });
  };

  $l.extend = function(){
    var args = [].slice.call(arguments);
    var accumulator = args.shift();
    args.forEach(function(object){
      for (var attr in object) {
        accumulator[attr] = object[attr];
      }
    })
    return accumulator;
  }

  $l.ajax = function(options) {
    var defaults = {
      success:  function(data) {
                  console.log("Great Success, vary nahce");
                  console.log(data);
                },
      error:   function() {
                  console.error("An error occured.");
                },
      url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2de143494c0b295cca9337e1e96b00e0",
      method: "GET",
      data:  "",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8"
    }

    if (typeof options === "undefined") {
      options = defaults;
    } else {
    $l.extend(options, defaults);
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (xmlhttp.status == 200) {
        options['success'](xmlhttp.responseText);
      } else {
        options['error']();
      }
    };

    xmlhttp.open(options['method'], options['url'], true);
    xmlhttp.send();
  };

})();
