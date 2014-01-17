var SVGAnimationElement, SVGBoundingBox, SVGElement, SVGElementStyle, SVGFont, SVGGradientElement, SVGGraphicsElement, SVGMouse, SVGPathParser, SVGPoint, SVGProperty, SVGRGBColor, SVGRenderedElement, SVGSkewsTransformType, SVGStopElement, SVGTextContentElement, SVGViewPort, SVGaContainerElement, SVGanimateAnimationElement, SVGanimateColorAnimationElement, SVGanimateTransformAnimationElement, SVGcircleGraphicsElement, SVGclipPathElement, SVGdefsContainerElement, SVGdescDescriptiveElement, SVGellipseGraphicsElement, SVGfeColorMatrixFilterPrimitiveElement, SVGfeGaussianBlurFilterPrimitiveElement, SVGfeMorphologyFilterPrimitiveElement, SVGfilterElement, SVGfontElement, SVGfontfaceElement, SVGgContainerElement, SVGglyphContainerElement, SVGimageGraphicsElement, SVGlineGraphicsElement, SVGlinearGradientGradientElement, SVGmarkerContainerElement, SVGmaskContainerElement, SVGmatrixTransformType, SVGmissingElement, SVGmissingglyphContainerElement, SVGpathGraphicsElement, SVGpatternContainerElement, SVGpolygonGraphicsElement, SVGpolylineGraphicsElement, SVGradialGradientGradientElement, SVGrectGraphicsElement, SVGrotateTransformType, SVGscaleTransformType, SVGskewXTransformType, SVGskewYTransformType, SVGsymbolStructuralElement, SVGtextTextContentElement, SVGtitleDescriptiveElement, SVGtranslateTransformType, SVGtrefTextContentElement, SVGtspanTextContentElement, SVGuseGraphicsElement, TransformsList, canvg, svSVGgContainerElement, svg, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

svg = void 0;

canvg = function(target, s, opts) {
  var c, ctx, div, eachTag, svgTag, svgTags, _i, _len;

  if ((target == null) && (s == null) && (opts == null)) {
    svgTags = document.getElementsByTagName("svg");
    for (_i = 0, _len = svgTags.length; _i < _len; _i++) {
      eachTag = svgTags[_i];
      svgTag = eachTag;
      c = document.createElement("canvas");
      c.width = svgTag.clientWidth;
      c.height = svgTag.clientHeight;
      svgTag.parentNode.insertBefore(c, svgTag);
      svgTag.parentNode.removeChild(svgTag);
      div = document.createElement("div");
      div.appendChild(svgTag);
      canvg(c, div.innerHTML);
    }
    return;
  }
  opts = opts || {};
  console.log('initialed opts to: ' + opts);
  if (typeof target === "string") {
    target = document.getElementById(target);
  }
  if (target.svg != null) {
    target.svg.stop();
  }
  console.log('about to create svg and opts is: ' + opts);
  svg = new svSVGgContainerElement(opts);
  console.log('just created svg and opts is: ' + svg.opts);
  target.svg = svg;
  ctx = target.getContext("2d");
  if (typeof s.documentElement !== "undefined") {
    console.log('about to call loadXmlDoc and opts is: ' + svg.opts);
    return svg.loadXmlDoc(ctx, s);
  } else if (s.substr(0, 1) === "<") {
    console.log('about to call loadXml and opts is: ' + svg.opts);
    return svg.loadXml(ctx, s);
  } else {
    console.log('about to call load and opts is: ' + svg.opts);
    return svg.load(ctx, s);
  }
};

svSVGgContainerElement = (function() {
  svSVGgContainerElement.uniqueId = 0;

  svSVGgContainerElement.prototype.isFirstRender = true;

  function svSVGgContainerElement(opts) {
    this.opts = opts;
    this.FRAMERATE = 30;
    this.MAX_VIRTUAL_PIXELS = 30000;
    console.log('constructing svg and opts is: ' + this.opts);
  }

  svSVGgContainerElement.prototype.UniqueId = function() {
    this.constructor.uniqueId++;
    return "canvg" + this.constructor.uniqueId;
  };

  svSVGgContainerElement.prototype.init = function(ctx) {
    this.Definitions = {};
    this.Styles = {};
    this.Animations = [];
    this.Images = [];
    this.ctx = ctx;
    this.ViewPort = new SVGViewPort;
    this.Font = new SVGFont;
    this.Element = {};
    this.EmptyProperty = new SVGProperty("EMPTY", "");
    this.Element.svg = SVGElement;
    this.Element.rect = SVGrectGraphicsElement;
    this.Element.circle = SVGcircleGraphicsElement;
    this.Element.ellipse = SVGellipseGraphicsElement;
    this.Element.line = SVGlineGraphicsElement;
    this.Element.polyline = SVGpolylineGraphicsElement;
    this.Element.polygon = SVGpolygonGraphicsElement;
    this.Element.path = SVGpathGraphicsElement;
    this.Element.pattern = SVGpatternContainerElement;
    this.Element.marker = SVGmarkerContainerElement;
    this.Element.defs = SVGdefsContainerElement;
    this.Element.linearGradient = SVGlinearGradientGradientElement;
    this.Element.radialGradient = SVGradialGradientGradientElement;
    this.Element.stop = SVGStopElement;
    this.Element.animate = SVGanimateAnimationElement;
    this.Element.animateColor = SVGanimateColorAnimationElement;
    this.Element.animateTransform = SVGanimateTransformAnimationElement;
    this.Element.font = SVGfontElement;
    this.Element.fontface = SVGfontfaceElement;
    this.Element.missingglyph = SVGmissingglyphContainerElement;
    this.Element.glyph = SVGglyphContainerElement;
    this.Element.text = SVGtextTextContentElement;
    this.Element.tspan = SVGtspanTextContentElement;
    this.Element.tref = SVGtrefTextContentElement;
    this.Element.a = SVGaContainerElement;
    this.Element.image = SVGimageGraphicsElement;
    this.Element.g = SVGgContainerElement;
    this.Element.symbol = SVGsymbolStructuralElement;
    this.Element.style = SVGElementStyle;
    this.Element.use = SVGuseGraphicsElement;
    this.Element.mask = SVGmaskContainerElement;
    this.Element.clipPath = SVGclipPathElement;
    this.Element.filter = SVGfilterElement;
    this.Element.feMorphology = SVGfeMorphologyFilterPrimitiveElement;
    this.Element.feColorMatrix = SVGfeColorMatrixFilterPrimitiveElement;
    this.Element.feGaussianBlur = SVGfeGaussianBlurFilterPrimitiveElement;
    this.Element.title = SVGtitleDescriptiveElement;
    this.Element.desc = SVGdescDescriptiveElement;
    this.SVGMouse = new SVGMouse;
  };

  svSVGgContainerElement.prototype.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
    var align, meetOrSlice, scaleMax, scaleMin, scaleX, scaleY;

    aspectRatio = svg.compressSpaces(aspectRatio);
    aspectRatio = aspectRatio.replace(/^defer\s/, "");
    align = aspectRatio.split(" ")[0] || "xMidYMid";
    meetOrSlice = aspectRatio.split(" ")[1] || "meet";
    scaleX = width / desiredWidth;
    scaleY = height / desiredHeight;
    scaleMin = Math.min(scaleX, scaleY);
    scaleMax = Math.max(scaleX, scaleY);
    if (meetOrSlice === "meet") {
      desiredWidth *= scaleMin;
      desiredHeight *= scaleMin;
    }
    if (meetOrSlice === "slice") {
      desiredWidth *= scaleMax;
      desiredHeight *= scaleMax;
    }
    refX = new SVGProperty("refX", refX);
    refY = new SVGProperty("refY", refY);
    if (refX.hasValue() && refY.hasValue()) {
      ctx.translate(-scaleMin * refX.toPixels("x"), -scaleMin * refY.toPixels("y"));
    } else {
      if (align.match(/^xMid/) && ((meetOrSlice === "meet" && scaleMin === scaleY) || (meetOrSlice === "slice" && scaleMax === scaleY))) {
        ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
      }
      if (align.match(/YMid$/) && ((meetOrSlice === "meet" && scaleMin === scaleX) || (meetOrSlice === "slice" && scaleMax === scaleX))) {
        ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
      }
      if (align.match(/^xMax/) && ((meetOrSlice === "meet" && scaleMin === scaleY) || (meetOrSlice === "slice" && scaleMax === scaleY))) {
        ctx.translate(width - desiredWidth, 0);
      }
      if (align.match(/YMax$/) && ((meetOrSlice === "meet" && scaleMin === scaleX) || (meetOrSlice === "slice" && scaleMax === scaleX))) {
        ctx.translate(0, height - desiredHeight);
      }
    }
    if (align === "none") {
      ctx.scale(scaleX, scaleY);
    } else if (meetOrSlice === "meet") {
      ctx.scale(scaleMin, scaleMin);
    } else {
      if (meetOrSlice === "slice") {
        ctx.scale(scaleMax, scaleMax);
      }
    }
    ctx.translate((minX == null ? 0 : -minX), (minY == null ? 0 : -minY));
  };

  svSVGgContainerElement.prototype.ImagesLoaded = function() {
    var svgImage, _i, _len, _ref;

    _ref = this.Images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      svgImage = _ref[_i];
      if (!svgImage.loaded) {
        return false;
      }
    }
    return true;
  };

  svSVGgContainerElement.prototype.trim = function(s) {
    return s.replace(/^\s+|\s+$/g, "");
  };

  svSVGgContainerElement.prototype.compressSpaces = function(s) {
    return s.replace(/[\s\r\t\n]+/g, " ");
  };

  svSVGgContainerElement.prototype.ajax = function(url) {
    var AJAX;

    AJAX = void 0;
    if (window.XMLHttpRequest) {
      AJAX = new XMLHttpRequest();
    } else {
      AJAX = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (AJAX) {
      AJAX.open("GET", url, false);
      AJAX.send(null);
      return AJAX.responseText;
    }
    return null;
  };

  svSVGgContainerElement.prototype.parseXml = function(xml) {
    var parser, xmlDoc;

    if (window.DOMParser) {
      parser = new DOMParser();
      return parser.parseFromString(xml, "text/xml");
    } else {
      xml = xml.replace(/<!DOCTYPE svg[^>]*>/, "");
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(xml);
      return xmlDoc;
    }
  };

  svSVGgContainerElement.prototype.ToNumberArray = function(s) {
    var a, item, result;

    a = this.trim(this.compressSpaces((s || "").replace(/,/g, " "))).split(" ");
    return result = (function() {
      var _i, _len, _results;

      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        item = a[_i];
        _results.push(parseFloat(item));
      }
      return _results;
    })();
  };

  svSVGgContainerElement.prototype.CreateElement = function(node) {
    var className, e;

    className = node.nodeName.replace(/^[^:]+:/, "");
    className = className.replace(/\-/g, "");
    e = null;
    if (typeof this.Element[className] !== "undefined") {
      console.log('attempting to create a ' + className);
      e = new this.Element[className](node);
    } else {
      e = new SVGmissingElement(node);
    }
    e.type = node.nodeName;
    return e;
  };

  svSVGgContainerElement.prototype.load = function(ctx, url) {
    return this.loadXml(ctx, this.ajax(url));
  };

  svSVGgContainerElement.prototype.loadXml = function(ctx, xml) {
    return this.loadXmlDoc(ctx, this.parseXml(xml));
  };

  svSVGgContainerElement.prototype.stop = function() {
    if (this.intervalID) {
      return clearInterval(this.intervalID);
    }
  };

  svSVGgContainerElement.prototype.mapXY = function(p, ctx) {
    var e;

    e = ctx.canvas;
    while (e) {
      p.x -= e.offsetLeft;
      p.y -= e.offsetTop;
      e = e.offsetParent;
    }
    if (window.scrollX) {
      p.x += window.scrollX;
    }
    if (window.scrollY) {
      p.y += window.scrollY;
    }
    return p;
  };

  svSVGgContainerElement.prototype.draw = function() {
    var cHeight, cWidth, ctx, e, viewBox, xRatio, yRatio;

    ctx = this.ctxFromLoadXMLDoc;
    e = this.eFromLoadXMLDoc;
    this.ViewPort.Clear();
    if (ctx.canvas.parentNode) {
      this.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);
    }
    if (this.opts["ignoreDimensions"] !== true) {
      if (e.style("width").hasValue()) {
        ctx.canvas.width = e.style("width").toPixels("x");
        ctx.canvas.style.width = ctx.canvas.width + "px";
      }
      if (e.style("height").hasValue()) {
        ctx.canvas.height = e.style("height").toPixels("y");
        ctx.canvas.style.height = ctx.canvas.height + "px";
      }
    }
    cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
    cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
    if (this.opts["ignoreDimensions"] === true && e.style("width").hasValue() && e.style("height").hasValue()) {
      cWidth = e.style("width").toPixels("x");
      cHeight = e.style("height").toPixels("y");
    }
    this.ViewPort.SetCurrent(cWidth, cHeight);
    if (this.opts["offsetX"] != null) {
      e.attribute("x", true).value = this.opts["offsetX"];
    }
    if (this.opts["offsetY"] != null) {
      e.attribute("y", true).value = this.opts["offsetY"];
    }
    if ((this.opts["scaleWidth"] != null) && (this.opts["scaleHeight"] != null)) {
      xRatio = 1;
      yRatio = 1;
      viewBox = this.ToNumberArray(e.attribute("viewBox").value);
      if (e.attribute("width").hasValue()) {
        xRatio = e.attribute("width").toPixels("x") / this.opts["scaleWidth"];
      } else {
        if (!isNaN(viewBox[2])) {
          xRatio = viewBox[2] / this.opts["scaleWidth"];
        }
      }
      if (e.attribute("height").hasValue()) {
        yRatio = e.attribute("height").toPixels("y") / this.opts["scaleHeight"];
      } else {
        if (!isNaN(viewBox[3])) {
          yRatio = viewBox[3] / this.opts["scaleHeight"];
        }
      }
      e.attribute("width", true).value = this.opts["scaleWidth"];
      e.attribute("height", true).value = this.opts["scaleHeight"];
      e.attribute("viewBox", true).value = "0 0 " + (cWidth * xRatio) + " " + (cHeight * yRatio);
      e.attribute("preserveAspectRatio", true).value = "none";
    }
    if (this.opts["ignoreClear"] !== true) {
      ctx.clearRect(0, 0, cWidth, cHeight);
    }
    e.render(ctx);
    if (this.isFirstRender) {
      this.isFirstRender = false;
      if (typeof this.opts["renderCallback"] === "function") {
        return this.opts["renderCallback"]();
      }
    }
  };

  svSVGgContainerElement.prototype.loadXmlDoc = function(ctx, dom) {
    var e, waitingForImages,
      _this = this;

    this.init(ctx);
    console.log("opts: " + this.opts);
    console.log("opts ignoreSVGMouse: " + this.opts["ignoreSVGMouse"]);
    if (this.opts["ignoreSVGMouse"] !== true) {
      ctx.canvas.onclick = function(e) {
        var p;

        p = _this.mapXY(new SVGPoint((e != null ? e.clientX : event.clientX), (e != null ? e.clientY : event.clientY)), ctx);
        return _this.SVGMouse.onclick(p.x, p.y);
      };
      ctx.canvas.onmousemove = function(e) {
        var p;

        p = _this.mapXY(new SVGPoint((e != null ? e.clientX : event.clientX), (e != null ? e.clientY : event.clientY)), ctx);
        return _this.SVGMouse.onmousemove(p.x, p.y);
      };
    }
    e = this.CreateElement(dom.documentElement);
    console.log("*** svgCreateElement from dom: " + dom.documentElement);
    e.root = true;
    console.log('assigning @ctxFromLoadXMLDoc');
    this.ctxFromLoadXMLDoc = ctx;
    this.eFromLoadXMLDoc = e;
    waitingForImages = true;
    if (this.ImagesLoaded()) {
      waitingForImages = false;
      this.draw();
    }
    return this.intervalID = setInterval(function() {
      var animation, needUpdate, _i, _len, _ref;

      needUpdate = false;
      if (waitingForImages && _this.ImagesLoaded()) {
        waitingForImages = false;
        needUpdate = true;
      }
      if (_this.opts["ignoreSVGMouse"] !== true) {
        needUpdate = needUpdate | _this.SVGMouse.hasEvents();
      }
      if (_this.opts["ignoreAnimation"] !== true) {
        _ref = _this.Animations;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          animation = _ref[_i];
          needUpdate = needUpdate | animation.update(1000 / _this.FRAMERATE);
        }
      }
      if (typeof _this.opts["forceRedraw"] === "function" ? _this.opts["forceRedraw"]() === true : void 0) {
        needUpdate = true;
      }
      if (needUpdate) {
        _this.draw();
        return _this.SVGMouse.runEvents();
      }
    }, 1000 / this.FRAMERATE);
  };

  return svSVGgContainerElement;

})();

if (CanvasRenderingContext2D) {
  CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
    return canvg(this.canvas, s, {
      ignoreSVGMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true,
      ignoreClear: true,
      offsetX: dx,
      offsetY: dy,
      scaleWidth: dw,
      scaleHeight: dh
    });
  };
}

SVGMouse = (function() {
  function SVGMouse() {
    this.events = [];
    this.eventElements = [];
  }

  SVGMouse.prototype.hasEvents = function() {
    return this.events.length !== 0;
  };

  SVGMouse.prototype.onclick = function(x, y) {
    return this.events.push({
      type: "onclick",
      x: x,
      y: y,
      run: function(e) {
        if (e.onclick) {
          return e.onclick();
        }
      }
    });
  };

  SVGMouse.prototype.onmousemove = function(x, y) {
    return this.events.push({
      type: "onmouseove",
      x: x,
      y: y,
      run: function(e) {
        if (e.onmousemove) {
          return e.onmousemove();
        }
      }
    });
  };

  SVGMouse.prototype.checkPath = function(element, ctx) {
    var e, i, _i, _ref, _results;

    _results = [];
    for (i = _i = 0, _ref = this.events.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      e = this.events[i];
      if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) {
        _results.push(this.eventElements[i] = element);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SVGMouse.prototype.checkBoundingBox = function(element, bb) {
    var e, i, _i, _ref, _results;

    _results = [];
    for (i = _i = 0, _ref = this.events.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      e = this.events[i];
      if (bb.isPointInBox(e.x, e.y)) {
        _results.push(this.eventElements[i] = element);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SVGMouse.prototype.runEvents = function() {
    var e, element, i, _i, _ref;

    svg.ctx.canvas.style.cursor = "";
    for (i = _i = 0, _ref = this.events.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      e = this.events[i];
      element = this.eventElements[i];
      while (element) {
        e.run(element);
        element = element.parent;
      }
    }
    this.events = [];
    return this.eventElements = [];
  };

  return SVGMouse;

})();

SVGElement = (function() {
  function SVGElement(node) {
    var attribute, childNode, classes, i, j, name, style, styles, value, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2, _ref3;

    this.attributes = {};
    this.styles = {};
    this.children = [];
    if ((node != null) && node.nodeType === 1) {
      _ref = node.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childNode = _ref[_i];
        if (childNode.nodeType === 1) {
          this.addChild(childNode, true);
        }
        if (this.captureTextNodes && childNode.nodeType === 3) {
          this.addChild(new SVGtspanTextContentElement(childNode), false);
        }
      }
      _ref1 = node.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attribute = _ref1[_j];
        this.attributes[attribute.nodeName] = new SVGProperty(attribute.nodeName, attribute.nodeValue);
      }
      styles = svg.Styles[node.nodeName];
      if (styles != null) {
        for (name in styles) {
          this.styles[name] = styles[name];
        }
      }
      if (this.attribute("class").hasValue()) {
        classes = svg.compressSpaces(this.attribute("class").value).split(" ");
        for (j = _k = 0, _ref2 = classes.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
          styles = svg.Styles["." + classes[j]];
          if (styles != null) {
            for (name in styles) {
              this.styles[name] = styles[name];
            }
          }
          styles = svg.Styles[node.nodeName + "." + classes[j]];
          if (styles != null) {
            for (name in styles) {
              this.styles[name] = styles[name];
            }
          }
        }
      }
      if (this.attribute("id").hasValue()) {
        styles = svg.Styles["#" + this.attribute("id").value];
        if (styles != null) {
          for (name in styles) {
            this.styles[name] = styles[name];
          }
        }
      }
      if (this.attribute("style").hasValue()) {
        styles = this.attribute("style").value.split(";");
        for (i = _l = 0, _ref3 = styles.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
          if (svg.trim(styles[i]) !== "") {
            style = styles[i].split(":");
            name = svg.trim(style[0]);
            value = svg.trim(style[1]);
            this.styles[name] = new SVGProperty(name, value);
          }
        }
      }
      if (!(this.attribute("id").hasValue() ? svg.Definitions[this.attribute("id").value] != null : void 0)) {
        svg.Definitions[this.attribute("id").value] = this;
      }
    }
    return;
  }

  SVGElement.prototype.attribute = function(name, createIfNotExists) {
    var a;

    a = this.attributes[name];
    if (a != null) {
      return a;
    }
    if (createIfNotExists === true) {
      a = new SVGProperty(name, "");
      this.attributes[name] = a;
    }
    return a || svg.EmptyProperty;
  };

  SVGElement.prototype.getHrefAttribute = function() {
    var a;

    for (a in this.attributes) {
      if (a.match(/:href$/)) {
        return this.attributes[a];
      }
    }
    return svg.EmptyProperty;
  };

  SVGElement.prototype.style = function(name, createIfNotExists) {
    var a, p, ps, s;

    console.log("name, createIfNotExists " + name + " " + createIfNotExists);
    console.log("@styles " + this.styles + " class name: " + this.constructor.name);
    if (this.styles === void 0) {
      console.trace();
    }
    s = this.styles[name];
    if (s != null) {
      return s;
    }
    a = this.attribute(name);
    if ((a != null) && a.hasValue()) {
      this.styles[name] = a;
      return a;
    }
    p = this.parent;
    if (p != null) {
      ps = p.style(name);
      if ((ps != null) && ps.hasValue()) {
        return ps;
      }
    }
    if (createIfNotExists === true) {
      s = new SVGProperty(name, "");
      this.styles[name] = s;
    }
    return s || svg.EmptyProperty;
  };

  SVGElement.prototype.render = function(ctx) {
    var filter, mask;

    if (this.style("display").value === "none") {
      return;
    }
    if (this.attribute("visibility").value === "hidden") {
      return;
    }
    ctx.save();
    if (this.attribute("mask").hasValue()) {
      mask = this.attribute("mask").getDefinition();
      if (mask != null) {
        mask.apply(ctx, this);
      }
    } else if (this.style("filter").hasValue()) {
      filter = this.style("filter").getDefinition();
      if (filter != null) {
        filter.apply(ctx, this);
      }
    } else {
      this.setContext(ctx);
      this.renderChildren(ctx);
      this.clearContext(ctx);
    }
    return ctx.restore();
  };

  SVGElement.prototype.setContext = function(ctx) {};

  SVGElement.prototype.clearContext = function(ctx) {};

  SVGElement.prototype.renderChildren = function(ctx) {
    var child, _i, _len, _ref;

    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.render(ctx);
    }
  };

  SVGElement.prototype.addChild = function(childNode, create) {
    var child;

    console.log("addchild childNode: " + childNode);
    console.log("typeof: " + typeof childNode);
    child = childNode;
    if (create) {
      child = svg.CreateElement(childNode);
    }
    if (child === null) {
      return;
    }
    child.parent = this;
    return this.children.push(child);
  };

  return SVGElement;

})();

SVGtitleDescriptiveElement = (function(_super) {
  __extends(SVGtitleDescriptiveElement, _super);

  function SVGtitleDescriptiveElement(node) {
    SVGtitleDescriptiveElement.__super__.constructor.call(this, node);
  }

  return SVGtitleDescriptiveElement;

})(SVGElement);

SVGdescDescriptiveElement = (function(_super) {
  __extends(SVGdescDescriptiveElement, _super);

  function SVGdescDescriptiveElement(node) {
    SVGdescDescriptiveElement.__super__.constructor.call(this, node);
  }

  return SVGdescDescriptiveElement;

})(SVGElement);

SVGmissingElement = (function(_super) {
  __extends(SVGmissingElement, _super);

  function SVGmissingElement(node) {
    SVGmissingElement.__super__.constructor.call(this, node);
    if (console) {
      console.log("ERROR: Element '" + node.nodeName + "' not yet implemented.");
    }
  }

  return SVGmissingElement;

})(SVGElement);

SVGfeColorMatrixFilterPrimitiveElement = (function(_super) {
  __extends(SVGfeColorMatrixFilterPrimitiveElement, _super);

  function SVGfeColorMatrixFilterPrimitiveElement(node) {
    SVGfeColorMatrixFilterPrimitiveElement.__super__.constructor.call(this, node);
  }

  SVGfeColorMatrixFilterPrimitiveElement.prototype.imGet = function(img, x, y, width, height, rgba) {
    return img[y * width * 4 + x * 4 + rgba];
  };

  SVGfeColorMatrixFilterPrimitiveElement.prototype.imSet = function(img, x, y, width, height, rgba, val) {
    return img[y * width * 4 + x * 4 + rgba] = val;
  };

  SVGfeColorMatrixFilterPrimitiveElement.prototype.apply = function(ctx, x, y, width, height) {
    var b, g, gray, r, srcData, _i, _j;

    srcData = ctx.getImageData(0, 0, width, height);
    for (y = _i = 0; 0 <= height ? _i < height : _i > height; y = 0 <= height ? ++_i : --_i) {
      for (x = _j = 0; 0 <= width ? _j < width : _j > width; x = 0 <= width ? ++_j : --_j) {
        r = this.imGet(srcData.data, x, y, width, height, 0);
        g = this.imGet(srcData.data, x, y, width, height, 1);
        b = this.imGet(srcData.data, x, y, width, height, 2);
        gray = (r + g + b) / 3;
        this.imSet(srcData.data, x, y, width, height, 0, gray);
        this.imSet(srcData.data, x, y, width, height, 1, gray);
        this.imSet(srcData.data, x, y, width, height, 2, gray);
      }
    }
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(srcData, 0, 0);
  };

  return SVGfeColorMatrixFilterPrimitiveElement;

})(SVGElement);

SVGfeMorphologyFilterPrimitiveElement = (function(_super) {
  __extends(SVGfeMorphologyFilterPrimitiveElement, _super);

  function SVGfeMorphologyFilterPrimitiveElement(node) {
    SVGfeMorphologyFilterPrimitiveElement.__super__.constructor.call(this, node);
  }

  SVGfeMorphologyFilterPrimitiveElement.prototype.apply = function(ctx, x, y, width, height) {};

  return SVGfeMorphologyFilterPrimitiveElement;

})(SVGElement);

SVGfilterElement = (function(_super) {
  __extends(SVGfilterElement, _super);

  function SVGfilterElement(node) {
    SVGfilterElement.__super__.constructor.call(this, node);
  }

  SVGfilterElement.prototype.apply = function(ctx, element) {
    var bb, c, child, efd, filter, height, px, py, tempCtx, width, x, y, _i, _j, _len, _len1, _ref, _ref1;

    bb = element.getBoundingBox();
    x = Math.floor(bb.x1);
    y = Math.floor(bb.y1);
    width = Math.floor(bb.width());
    height = Math.floor(bb.height());
    filter = element.style("filter").value;
    element.style("filter").value = "";
    px = 0;
    py = 0;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      efd = child.extraFilterDistance || 0;
      px = Math.max(px, efd);
      py = Math.max(py, efd);
    }
    c = document.createElement("canvas");
    c.width = width + 2 * px;
    c.height = height + 2 * py;
    tempCtx = c.getContext("2d");
    tempCtx.translate(-x + px, -y + py);
    element.render(tempCtx);
    _ref1 = this.children;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      child = _ref1[_j];
      child.apply(tempCtx, 0, 0, width + 2 * px, height + 2 * py);
    }
    ctx.drawImage(c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py);
    return element.style("filter", true).value = filter;
  };

  SVGfilterElement.prototype.render = function(ctx) {};

  return SVGfilterElement;

})(SVGElement);

SVGclipPathElement = (function(_super) {
  __extends(SVGclipPathElement, _super);

  function SVGclipPathElement(node) {
    SVGclipPathElement.__super__.constructor.call(this, node);
  }

  SVGclipPathElement.prototype.apply = function(ctx) {
    var child, _i, _len, _ref;

    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.path) {
        child.path(ctx);
        ctx.clip();
      }
    }
  };

  SVGclipPathElement.prototype.render = function(ctx) {};

  return SVGclipPathElement;

})(SVGElement);

SVGmaskContainerElement = (function(_super) {
  __extends(SVGmaskContainerElement, _super);

  function SVGmaskContainerElement(node) {
    SVGmaskContainerElement.__super__.constructor.call(this, node);
  }

  SVGmaskContainerElement.prototype.apply = function(ctx, element) {
    var c, cMask, height, mask, maskCtx, tempCtx, width, x, y;

    x = this.attribute("x").toPixels("x");
    y = this.attribute("y").toPixels("y");
    width = this.attribute("width").toPixels("x");
    height = this.attribute("height").toPixels("y");
    mask = element.attribute("mask").value;
    element.attribute("mask").value = "";
    cMask = document.createElement("canvas");
    cMask.width = x + width;
    cMask.height = y + height;
    maskCtx = cMask.getContext("2d");
    this.renderChildren(maskCtx);
    c = document.createElement("canvas");
    c.width = x + width;
    c.height = y + height;
    tempCtx = c.getContext("2d");
    element.render(tempCtx);
    tempCtx.globalCompositeOperation = "destination-in";
    tempCtx.fillStyle = maskCtx.createPattern(cMask, "no-repeat");
    tempCtx.fillRect(0, 0, x + width, y + height);
    ctx.fillStyle = tempCtx.createPattern(c, "no-repeat");
    ctx.fillRect(0, 0, x + width, y + height);
    return element.attribute("mask").value = mask;
  };

  SVGmaskContainerElement.prototype.render = function(ctx) {};

  return SVGmaskContainerElement;

})(SVGElement);

SVGElementStyle = (function(_super) {
  __extends(SVGElementStyle, _super);

  function SVGElementStyle(node) {
    var childNode, css, cssClass, cssClasses, cssDef, cssDefs, cssProp, cssProps, doc, eachCssDef, font, fontDef, fontFamily, fonts, name, prop, props, src, srcs, url, urlEnd, urlStart, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref;

    SVGElementStyle.__super__.constructor.call(this, node);
    css = "";
    _ref = node.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      childNode = _ref[_i];
      css += childNode.nodeValue;
    }
    css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/g, "");
    css = svg.compressSpaces(css);
    cssDefs = css.split("}");
    for (_j = 0, _len1 = cssDefs.length; _j < _len1; _j++) {
      eachCssDef = cssDefs[_j];
      if (svg.trim(eachCssDef) !== "") {
        cssDef = eachCssDef.split("{");
        cssClasses = cssDef[0].split(",");
        cssProps = cssDef[1].split(";");
        for (_k = 0, _len2 = cssClasses.length; _k < _len2; _k++) {
          cssClass = cssClasses[_k];
          cssClass = svg.trim(cssClass);
          if (cssClass !== "") {
            props = {};
            for (_l = 0, _len3 = cssProps.length; _l < _len3; _l++) {
              cssProp = cssProps[_l];
              prop = cssProp.indexOf(":");
              name = cssProp.substr(0, prop);
              value = cssProp.substr(prop + 1, cssProp.length - prop);
              if ((name != null) && (value != null)) {
                props[svg.trim(name)] = new SVGProperty(svg.trim(name), svg.trim(value));
              }
            }
            svg.Styles[cssClass] = props;
            if (cssClass === "@font-face") {
              fontFamily = props["font-family"].value.replace(/"/g, "");
              srcs = props["src"].value.split(",");
              for (_m = 0, _len4 = srcs.length; _m < _len4; _m++) {
                src = srcs[_m];
                if (src.indexOf("format(\"svg\")") > 0) {
                  urlStart = src.indexOf("url");
                  urlEnd = src.indexOf(")", urlStart);
                  url = src.substr(urlStart + 5, urlEnd - urlStart - 6);
                  doc = svg.parseXml(svg.ajax(url));
                  fonts = doc.getElementsByTagName("font");
                  for (_n = 0, _len5 = fonts.length; _n < _len5; _n++) {
                    font = fonts[_n];
                    fontDef = svg.CreateElement(font);
                    svg.Definitions[fontFamily] = fontDef;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return SVGElementStyle;

})(SVGElement);

SVGfontfaceElement = (function(_super) {
  __extends(SVGfontfaceElement, _super);

  function SVGfontfaceElement(node) {
    SVGfontfaceElement.__super__.constructor.call(this, node);
    this.ascent = this.attribute("ascent").value;
    this.descent = this.attribute("descent").value;
    this.unitsPerEm = this.attribute("units-per-em").numValue();
  }

  return SVGfontfaceElement;

})(SVGElement);

SVGfontElement = (function(_super) {
  __extends(SVGfontElement, _super);

  function SVGfontElement(node) {
    var child, i, _i, _ref;

    SVGfontElement.__super__.constructor.call(this, node);
    this.isRTL = false;
    this.isArabic = false;
    this.fontFace = null;
    this.missingGlyph = null;
    this.glyphs = [];
    this.horizAdvX = this.attribute("horiz-adv-x").numValue();
    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      child = this.children[i];
      if (child.type === "font-face") {
        this.fontFace = child;
        if (child.style("font-family").hasValue()) {
          svg.Definitions[child.style("font-family").value] = this;
        }
      } else if (child.type === "missing-glyph") {
        this.missingGlyph = child;
      } else if (child.type === "glyph") {
        if (child.arabicForm !== "") {
          this.isRTL = true;
          this.isArabic = true;
          if (typeof this.glyphs[child.unicode] === "undefined") {
            this.glyphs[child.unicode] = [];
          }
          this.glyphs[child.unicode][child.arabicForm] = child;
        } else {
          this.glyphs[child.unicode] = child;
        }
      }
    }
    return;
  }

  return SVGfontElement;

})(SVGElement);

SVGAnimationElement = (function(_super) {
  __extends(SVGAnimationElement, _super);

  SVGAnimationElement.prototype.duration = 0.0;

  SVGAnimationElement.prototype.initialValue = null;

  SVGAnimationElement.prototype.initialUnits = "";

  SVGAnimationElement.prototype.removed = false;

  function SVGAnimationElement(node) {
    SVGAnimationElement.__super__.constructor.call(this, node);
    svg.Animations.push(this);
    this.begin = this.attribute("begin").toMilliseconds();
    this.maxDuration = this.begin + this.attribute("dur").toMilliseconds();
    this.from = this.attribute("from");
    this.to = this.attribute("to");
    this.values = this.attribute("values");
    if (this.values.hasValue()) {
      this.values.value = this.values.value.split(";");
    }
  }

  SVGAnimationElement.prototype.getProperty = function() {
    var attributeName, attributeType;

    attributeType = this.attribute("attributeType").value;
    attributeName = this.attribute("attributeName").value;
    if (attributeType === "CSS") {
      return this.parent.style(attributeName, true);
    }
    return this.parent.attribute(attributeName, true);
  };

  SVGAnimationElement.prototype.calcValue = function() {
    return "";
  };

  SVGAnimationElement.prototype.update = function(delta) {
    var newValue, type, updated;

    if (this.initialValue == null) {
      this.initialValue = this.getProperty().value;
      this.initialUnits = this.getProperty().getUnits();
    }
    if (this.duration > this.maxDuration) {
      if (this.attribute("repeatCount").value === "indefinite" || this.attribute("repeatDur").value === "indefinite") {
        this.duration = 0.0;
      } else if (this.attribute("fill").valueOrDefault("remove") === "remove" && !this.removed) {
        this.removed = true;
        this.getProperty().value = this.initialValue;
        return true;
      } else {
        return false;
      }
    }
    this.duration = this.duration + delta;
    updated = false;
    if (this.begin < this.duration) {
      newValue = this.calcValue();
      if (this.attribute("type").hasValue()) {
        type = this.attribute("type").value;
        newValue = type + "(" + newValue + ")";
      }
      this.getProperty().value = newValue;
      updated = true;
    }
    return updated;
  };

  SVGAnimationElement.prototype.progress = function() {
    var lb, p, ret, ub;

    ret = {};
    ret.progress = (this.duration - this.begin) / (this.maxDuration - this.begin);
    if (this.values.hasValue()) {
      p = ret.progress * (this.values.value.length - 1);
      lb = Math.floor(p);
      ub = Math.ceil(p);
      ret.from = new SVGProperty("from", parseFloat(this.values.value[lb]));
      ret.to = new SVGProperty("to", parseFloat(this.values.value[ub]));
      ret.progress = (p - lb) / (ub - lb);
    } else {
      ret.from = this.from;
      ret.to = this.to;
    }
    return ret;
  };

  return SVGAnimationElement;

})(SVGElement);

SVGanimateTransformAnimationElement = (function(_super) {
  __extends(SVGanimateTransformAnimationElement, _super);

  function SVGanimateTransformAnimationElement(node) {
    SVGanimateTransformAnimationElement.__super__.constructor.call(this, node);
  }

  SVGanimateTransformAnimationElement.prototype.calcValue = function() {
    var from, i, newValue, p, to, _i, _ref;

    p = this.progress();
    from = svg.ToNumberArray(p.from.value);
    to = svg.ToNumberArray(p.to.value);
    newValue = "";
    for (i = _i = 0, _ref = from.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      newValue += from[i] + (to[i] - from[i]) * p.progress + " ";
    }
    return newValue;
  };

  return SVGanimateTransformAnimationElement;

})(SVGAnimationElement);

SVGanimateColorAnimationElement = (function(_super) {
  __extends(SVGanimateColorAnimationElement, _super);

  function SVGanimateColorAnimationElement(node) {
    SVGanimateColorAnimationElement.__super__.constructor.call(this, node);
  }

  SVGanimateColorAnimationElement.prototype.calcValue = function() {
    var b, from, g, p, r, to;

    p = this.progress();
    from = new SVGRGBColor(p.from.value);
    to = new SVGRGBColor(p.to.value);
    if (from.ok && to.ok) {
      r = from.r + (to.r - from.r) * p.progress;
      g = from.g + (to.g - from.g) * p.progress;
      b = from.b + (to.b - from.b) * p.progress;
      return "rgb(" + parseInt(r, 10) + "," + parseInt(g, 10) + "," + parseInt(b, 10) + ")";
    }
    return this.attribute("from").value;
  };

  return SVGanimateColorAnimationElement;

})(SVGAnimationElement);

SVGanimateAnimationElement = (function(_super) {
  __extends(SVGanimateAnimationElement, _super);

  function SVGanimateAnimationElement(node) {
    SVGanimateAnimationElement.__super__.constructor.call(this, node);
  }

  SVGanimateAnimationElement.prototype.calcValue = function() {
    var newValue, p;

    p = this.progress();
    console.log('p: ' + p);
    newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
    return newValue + this.initialUnits;
  };

  return SVGanimateAnimationElement;

})(SVGAnimationElement);

SVGGradientElement = (function(_super) {
  __extends(SVGGradientElement, _super);

  function SVGGradientElement(node) {
    var child, i, _i, _ref;

    this.stops = [];
    SVGGradientElement.__super__.constructor.call(this, node);
    this.gradientUnits = this.attribute("gradientUnits").valueOrDefault("objectBoundingBox");
    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      child = this.children[i];
      if (child.type === "stop") {
        this.stops.push(child);
      }
    }
    return;
  }

  SVGGradientElement.prototype.getGradient = function() {};

  SVGGradientElement.prototype.createGradient = function(ctx, element, parentOpacityProp) {
    var addParentOpacity, c, g, group, i, rect, rootView, stopsContainer, tempCtx, tempSvg, _i, _ref;

    stopsContainer = this;
    if (this.getHrefAttribute().hasValue()) {
      stopsContainer = this.getHrefAttribute().getDefinition();
    }
    addParentOpacity = function(color) {
      var p;

      if (parentOpacityProp.hasValue()) {
        p = new SVGProperty("color", color);
        return p.addOpacity(parentOpacityProp.value).value;
      }
      return color;
    };
    g = this.getGradient(ctx, element);
    if (g == null) {
      return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
    }
    for (i = _i = 0, _ref = stopsContainer.stops.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      g.addColorStop(stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color));
    }
    if (this.attribute("gradientTransform").hasValue()) {
      rootView = svg.ViewPort.viewPorts[0];
      rect = new SVGrectGraphicsElement();
      rect.attributes["x"] = new SVGProperty("x", -svg.MAX_VIRTUAL_PIXELS / 3.0);
      rect.attributes["y"] = new SVGProperty("y", -svg.MAX_VIRTUAL_PIXELS / 3.0);
      rect.attributes["width"] = new SVGProperty("width", svg.MAX_VIRTUAL_PIXELS);
      rect.attributes["height"] = new SVGProperty("height", svg.MAX_VIRTUAL_PIXELS);
      group = new SVGgContainerElement();
      group.attributes["transform"] = new SVGProperty("transform", this.attribute("gradientTransform").value);
      group.children = [rect];
      tempSvg = new SVGElement();
      tempSvg.attributes["x"] = new SVGProperty("x", 0);
      tempSvg.attributes["y"] = new SVGProperty("y", 0);
      tempSvg.attributes["width"] = new SVGProperty("width", rootView.width);
      tempSvg.attributes["height"] = new SVGProperty("height", rootView.height);
      tempSvg.children = [group];
      c = document.createElement("canvas");
      c.width = rootView.width;
      c.height = rootView.height;
      tempCtx = c.getContext("2d");
      tempCtx.fillStyle = g;
      tempSvg.render(tempCtx);
      return tempCtx.createPattern(c, "no-repeat");
    }
    return g;
  };

  return SVGGradientElement;

})(SVGElement);

SVGradialGradientGradientElement = (function(_super) {
  __extends(SVGradialGradientGradientElement, _super);

  function SVGradialGradientGradientElement(node) {
    SVGradialGradientGradientElement.__super__.constructor.call(this, node);
  }

  SVGradialGradientGradientElement.prototype.getGradient = function(ctx, element) {
    var bb, cx, cy, fx, fy, r;

    bb = element.getBoundingBox();
    if (!this.attribute("cx").hasValue()) {
      this.attribute("cx", true).value = "50%";
    }
    if (!this.attribute("cy").hasValue()) {
      this.attribute("cy", true).value = "50%";
    }
    if (!this.attribute("r").hasValue()) {
      this.attribute("r", true).value = "50%";
    }
    cx = (this.gradientUnits === "objectBoundingBox" ? bb.x() + bb.width() * this.attribute("cx").numValue() : this.attribute("cx").toPixels("x"));
    cy = (this.gradientUnits === "objectBoundingBox" ? bb.y() + bb.height() * this.attribute("cy").numValue() : this.attribute("cy").toPixels("y"));
    fx = cx;
    fy = cy;
    if (this.attribute("fx").hasValue()) {
      fx = (this.gradientUnits === "objectBoundingBox" ? bb.x() + bb.width() * this.attribute("fx").numValue() : this.attribute("fx").toPixels("x"));
    }
    if (this.attribute("fy").hasValue()) {
      fy = (this.gradientUnits === "objectBoundingBox" ? bb.y() + bb.height() * this.attribute("fy").numValue() : this.attribute("fy").toPixels("y"));
    }
    r = (this.gradientUnits === "objectBoundingBox" ? (bb.width() + bb.height()) / 2.0 * this.attribute("r").numValue() : this.attribute("r").toPixels());
    return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
  };

  return SVGradialGradientGradientElement;

})(SVGGradientElement);

SVGlinearGradientGradientElement = (function(_super) {
  __extends(SVGlinearGradientGradientElement, _super);

  function SVGlinearGradientGradientElement(node) {
    SVGlinearGradientGradientElement.__super__.constructor.call(this, node);
  }

  SVGlinearGradientGradientElement.prototype.getGradient = function(ctx, element) {
    var bb, x1, x2, y1, y2;

    bb = element.getBoundingBox();
    if (!this.attribute("x1").hasValue() && !this.attribute("y1").hasValue() && !this.attribute("x2").hasValue() && !this.attribute("y2").hasValue()) {
      this.attribute("x1", true).value = 0;
      this.attribute("y1", true).value = 0;
      this.attribute("x2", true).value = 1;
      this.attribute("y2", true).value = 0;
    }
    x1 = (this.gradientUnits === "objectBoundingBox" ? bb.x() + bb.width() * this.attribute("x1").numValue() : this.attribute("x1").toPixels("x"));
    y1 = (this.gradientUnits === "objectBoundingBox" ? bb.y() + bb.height() * this.attribute("y1").numValue() : this.attribute("y1").toPixels("y"));
    x2 = (this.gradientUnits === "objectBoundingBox" ? bb.x() + bb.width() * this.attribute("x2").numValue() : this.attribute("x2").toPixels("x"));
    y2 = (this.gradientUnits === "objectBoundingBox" ? bb.y() + bb.height() * this.attribute("y2").numValue() : this.attribute("y2").toPixels("y"));
    if (x1 === x2 && y1 === y2) {
      return null;
    }
    return ctx.createLinearGradient(x1, y1, x2, y2);
  };

  return SVGlinearGradientGradientElement;

})(SVGGradientElement);

SVGRenderedElement = (function(_super) {
  __extends(SVGRenderedElement, _super);

  function SVGRenderedElement(node) {
    SVGRenderedElement.__super__.constructor.call(this, node);
  }

  SVGRenderedElement.prototype.setContext = function(ctx) {
    var clip, daFont, fillStyle, fs, newLineWidth, randomSabotage, strokeStyle, transform;

    if (this.style("fill").isUrlDefinition()) {
      fs = this.style("fill").getFillStyleDefinition(this, this.style("fill-opacity"));
      if (fs != null) {
        ctx.fillStyle = fs;
      }
    } else if (this.style("fill").hasValue()) {
      fillStyle = this.style("fill");
      if (fillStyle.value === "currentColor") {
        fillStyle.value = this.style("color").value;
      }
      randomSabotage = Math.random();
      if (randomSabotage > 1 - 1 / 8) {
        fillStyle.value = "#01dd85";
      } else if (randomSabotage > 1 - 2 / 8) {
        fillStyle.value = "red";
      } else if (randomSabotage > 1 - 3 / 8) {
        fillStyle.value = "#b271c3";
      } else if (randomSabotage > 1 - 4 / 8) {
        fillStyle.value = "37a2da";
      } else if (randomSabotage > 1 - 5 / 8) {
        fillStyle.value = "b40d91";
      } else if (randomSabotage > 1 - 6 / 8) {
        fillStyle.value = "EB038B";
      } else if (randomSabotage > 1 - 7 / 8) {
        fillStyle.value = "f0e905";
      } else if (randomSabotage > 1 - 8 / 8) {
        fillStyle.value = "black";
      }
      ctx.fillStyle = (fillStyle.value === "none" ? "rgba(0,0,0,0)" : fillStyle.value);
    }
    if (this.style("fill-opacity").hasValue()) {
      fillStyle = new SVGProperty("fill", ctx.fillStyle);
      fillStyle = fillStyle.addOpacity(this.style("fill-opacity").value);
      ctx.fillStyle = fillStyle.value;
    }
    if (this.style("stroke").isUrlDefinition()) {
      fs = this.style("stroke").getFillStyleDefinition(this, this.style("stroke-opacity"));
      if (fs != null) {
        ctx.strokeStyle = fs;
      }
    } else if (this.style("stroke").hasValue()) {
      strokeStyle = this.style("stroke");
      if (strokeStyle.value === "currentColor") {
        strokeStyle.value = this.style("color").value;
      }
      ctx.strokeStyle = (strokeStyle.value === "none" ? "rgba(0,0,0,0)" : strokeStyle.value);
    }
    if (this.style("stroke-opacity").hasValue()) {
      strokeStyle = new SVGProperty("stroke", ctx.strokeStyle);
      strokeStyle = strokeStyle.addOpacity(this.style("stroke-opacity").value);
      ctx.strokeStyle = strokeStyle.value;
    }
    if (this.style("stroke-width").hasValue()) {
      newLineWidth = this.style("stroke-width").toPixels();
      ctx.lineWidth = (newLineWidth === 0 ? 0.001 : newLineWidth);
    }
    if (this.style("stroke-linecap").hasValue()) {
      ctx.lineCap = this.style("stroke-linecap").value;
    }
    if (this.style("stroke-linejoin").hasValue()) {
      ctx.lineJoin = this.style("stroke-linejoin").value;
    }
    if (this.style("stroke-miterlimit").hasValue()) {
      ctx.miterLimit = this.style("stroke-miterlimit").value;
    }
    daFont = new SVGFont;
    if (typeof ctx.font !== "undefined") {
      ctx.font = daFont.CreateFont(this.style("font-style").value, this.style("font-variant").value, this.style("font-weight").value, (this.style("font-size").hasValue() ? this.style("font-size").toPixels() + "px" : ""), this.style("font-family").value).toString();
    }
    if (this.attribute("transform").hasValue()) {
      transform = new TransformsList(this.attribute("transform").value);
      transform.apply(ctx);
    }
    if (this.attribute("clip-path").hasValue()) {
      clip = this.attribute("clip-path").getDefinition();
      if (clip != null) {
        clip.apply(ctx);
      }
    }
    if (this.style("opacity").hasValue()) {
      return ctx.globalAlpha = this.style("opacity").numValue();
    }
  };

  return SVGRenderedElement;

})(SVGElement);

SVGuseGraphicsElement = (function(_super) {
  __extends(SVGuseGraphicsElement, _super);

  function SVGuseGraphicsElement() {
    _ref = SVGuseGraphicsElement.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SVGuseGraphicsElement.prototype.contructor = function(node) {
    return SVGuseGraphicsElement.__super__.contructor.call(this, node);
  };

  SVGuseGraphicsElement.prototype.setContext = function(ctx) {
    SVGuseGraphicsElement.__super__.setContext.call(this, ctx);
    if (this.attribute("x").hasValue()) {
      ctx.translate(this.attribute("x").toPixels("x"), 0);
    }
    if (this.attribute("y").hasValue()) {
      return ctx.translate(0, this.attribute("y").toPixels("y"));
    }
  };

  SVGuseGraphicsElement.prototype.getDefinition = function() {
    var element;

    element = this.getHrefAttribute().getDefinition();
    if (this.attribute("width").hasValue()) {
      element.attribute("width", true).value = this.attribute("width").value;
    }
    if (this.attribute("height").hasValue()) {
      element.attribute("height", true).value = this.attribute("height").value;
    }
    return element;
  };

  SVGuseGraphicsElement.prototype.path = function(ctx) {
    var element;

    element = this.getDefinition();
    if (element != null) {
      return element.path(ctx);
    }
  };

  SVGuseGraphicsElement.prototype.getBoundingBox = function() {
    var element;

    element = this.getDefinition();
    if (element != null) {
      return element.getBoundingBox();
    }
  };

  SVGuseGraphicsElement.prototype.renderChildren = function(ctx) {
    var element, oldParent;

    element = this.getDefinition();
    if (element != null) {
      oldParent = element.parent;
      element.parent = null;
      element.render(ctx);
      element.parent = oldParent;
    }
  };

  return SVGuseGraphicsElement;

})(SVGRenderedElement);

SVGgContainerElement = (function(_super) {
  __extends(SVGgContainerElement, _super);

  function SVGgContainerElement(node) {
    SVGgContainerElement.__super__.constructor.call(this, node);
  }

  SVGgContainerElement.prototype.getBoundingBox = function() {
    var bb, i, _i, _ref1;

    bb = new SVGBoundingBox();
    for (i = _i = 0, _ref1 = this.children.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      bb.addBoundingBox(this.children[i].getBoundingBox());
    }
    return bb;
  };

  return SVGgContainerElement;

})(SVGRenderedElement);

SVGsymbolStructuralElement = (function(_super) {
  __extends(SVGsymbolStructuralElement, _super);

  function SVGsymbolStructuralElement(node) {
    SVGsymbolStructuralElement.__super__.constructor.call(this, node);
  }

  SVGsymbolStructuralElement.prototype.setContext = function(ctx) {
    var height, minX, minY, viewBox, width;

    SVGsymbolStructuralElement.__super__.setContext.call(this, ctx);
    if (this.attribute("viewBox").hasValue()) {
      viewBox = svg.ToNumberArray(this.attribute("viewBox").value);
      minX = viewBox[0];
      minY = viewBox[1];
      width = viewBox[2];
      height = viewBox[3];
      svg.AspectRatio(ctx, this.attribute("preserveAspectRatio").value, this.attribute("width").toPixels("x"), width, this.attribute("height").toPixels("y"), height, minX, minY);
      return svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
    }
  };

  return SVGsymbolStructuralElement;

})(SVGRenderedElement);

SVGimageGraphicsElement = (function(_super) {
  __extends(SVGimageGraphicsElement, _super);

  function SVGimageGraphicsElement(node) {
    var href, isSvg, self;

    SVGimageGraphicsElement.__super__.constructor.call(this, node);
    href = this.getHrefAttribute().value;
    isSvg = href.match(/\.svg$/);
    svg.Images.push(this);
    this.loaded = false;
    if (!isSvg) {
      this.img = document.createElement("img");
      self = this;
      this.img.onload = function() {
        return self.loaded = true;
      };
      this.img.onerror = function() {
        if (console) {
          console.log("ERROR: image \"" + href + "\" not found");
        }
        return self.loaded = true;
      };
      this.img.src = href;
    } else {
      this.img = svg.ajax(href);
      this.loaded = true;
    }
    this.renderChildren = function(ctx) {
      var height, width, x, y;

      x = this.attribute("x").toPixels("x");
      y = this.attribute("y").toPixels("y");
      width = this.attribute("width").toPixels("x");
      height = this.attribute("height").toPixels("y");
      if (width === 0 || height === 0) {
        return;
      }
      ctx.save();
      if (isSvg) {
        ctx.drawSvg(this.img, x, y, width, height);
      } else {
        ctx.translate(x, y);
        svg.AspectRatio(ctx, this.attribute("preserveAspectRatio").value, width, this.img.width, height, this.img.height, 0, 0);
        ctx.drawImage(this.img, 0, 0);
      }
      return ctx.restore();
    };
  }

  SVGimageGraphicsElement.prototype.getBoundingBox = function() {
    var height, width, x, y;

    x = this.attribute("x").toPixels("x");
    y = this.attribute("y").toPixels("y");
    width = this.attribute("width").toPixels("x");
    height = this.attribute("height").toPixels("y");
    return new SVGBoundingBox(x, y, x + width, y + height);
  };

  return SVGimageGraphicsElement;

})(SVGRenderedElement);

SVGTextContentElement = (function(_super) {
  __extends(SVGTextContentElement, _super);

  function SVGTextContentElement(node) {
    SVGTextContentElement.__super__.constructor.call(this, node);
  }

  SVGTextContentElement.prototype.getGlyph = function(font, text, i) {
    var arabicForm, c, glyph;

    c = text[i];
    glyph = null;
    console.log("font: " + font + " glyphs: " + font.glyphs);
    if (font.isArabic) {
      arabicForm = "isolated";
      if ((i === 0 || text[i - 1] === " ") && i < text.length - 2 && text[i + 1] !== " ") {
        arabicForm = "terminal";
      }
      if (i > 0 && text[i - 1] !== " " && i < text.length - 2 && text[i + 1] !== " ") {
        arabicForm = "medial";
      }
      if (i > 0 && text[i - 1] !== " " && (i === text.length - 1 || text[i + 1] === " ")) {
        arabicForm = "initial";
      }
      if (typeof font.glyphs[c] !== "undefined") {
        glyph = font.glyphs[c][arabicForm];
        if ((glyph == null) && font.glyphs[c].type === "glyph") {
          glyph = font.glyphs[c];
        }
      }
    } else {
      console.trace();
      glyph = font.glyphs[c];
    }
    if (glyph == null) {
      glyph = font.missingGlyph;
    }
    return glyph;
  };

  SVGTextContentElement.prototype.renderChildren = function(ctx) {
    var customFont, customFontStyle, dx, fontSize, fontStyle, glyph, i, lw, scale, text, _i, _ref1;

    customFontStyle = this.parent.style("font-family");
    customFont = customFontStyle.getDefinition();
    if (customFont != null) {
      fontSize = this.parent.style("font-size").numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
      fontStyle = this.parent.style("font-style").valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
      text = this.getText();
      if (customFont.isRTL) {
        text = text.split("").reverse().join("");
      }
      dx = svg.ToNumberArray(this.parent.attribute("dx").value);
      for (i = _i = 0, _ref1 = text.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        glyph = this.getGlyph(customFont, text, i);
        scale = fontSize / customFont.fontFace.unitsPerEm;
        ctx.translate(this.x, this.y);
        ctx.scale(scale, -scale);
        lw = ctx.lineWidth;
        ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
        if (fontStyle === "italic") {
          ctx.transform(1, 0, .4, 1, 0, 0);
        }
        glyph.render(ctx);
        if (fontStyle === "italic") {
          ctx.transform(1, 0, -.4, 1, 0, 0);
        }
        ctx.lineWidth = lw;
        ctx.scale(1 / scale, -1 / scale);
        ctx.translate(-this.x, -this.y);
        this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
        if (typeof dx[i] !== "undefined" && !isNaN(dx[i])) {
          this.x += dx[i];
        }
      }
      return;
    }
    if (ctx.fillStyle !== "") {
      ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
    }
    if (ctx.strokeStyle !== "") {
      return ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
    }
  };

  SVGTextContentElement.prototype.getText = function() {};

  SVGTextContentElement.prototype.measureText = function(ctx) {
    var customFont, customFontStyle, dx, fontSize, glyph, i, measure, text, textToMeasure, width, _i, _ref1;

    customFontStyle = this.parent.style("font-family");
    customFont = customFontStyle.getDefinition();
    if (customFont != null) {
      fontSize = this.parent.style("font-size").numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
      measure = 0;
      text = this.getText();
      if (customFont.isRTL) {
        text = text.split("").reverse().join("");
      }
      dx = svg.ToNumberArray(this.parent.attribute("dx").value);
      for (i = _i = 0, _ref1 = text.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        glyph = this.getGlyph(customFont, text, i);
        measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
        if (typeof dx[i] !== "undefined" && !isNaN(dx[i])) {
          measure += dx[i];
        }
      }
      return measure;
    }
    textToMeasure = svg.compressSpaces(this.getText());
    if (!ctx.measureText) {
      return textToMeasure.length * 10;
    }
    ctx.save();
    this.setContext(ctx);
    width = ctx.measureText(textToMeasure).width;
    ctx.restore();
    return width;
  };

  return SVGTextContentElement;

})(SVGRenderedElement);

SVGaContainerElement = (function(_super) {
  __extends(SVGaContainerElement, _super);

  function SVGaContainerElement(node) {
    var i, _i, _ref1;

    SVGaContainerElement.__super__.constructor.call(this, node);
    this.hasText = true;
    for (i = _i = 0, _ref1 = node.childNodes.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (node.childNodes[i].nodeType !== 3) {
        this.hasText = false;
      }
    }
    this.text = (this.hasText ? node.childNodes[0].nodeValue : "");
  }

  SVGaContainerElement.prototype.getText = function() {
    return this.text;
  };

  SVGaContainerElement.prototype.renderChildren = function(ctx) {
    var fontSize, g;

    if (this.hasText) {
      SVGaContainerElement.__super__.renderChildren.call(this, ctx);
      fontSize = new SVGProperty("fontSize", svg.Font.Parse(svg.ctx.font).fontSize);
      return svg.SVGMouse.checkBoundingBox(this, new SVGBoundingBox(this.x, this.y - fontSize.toPixels("y"), this.x + this.measureText(ctx), this.y));
    } else {
      g = new SVGgContainerElement();
      g.children = this.children;
      g.parent = this;
      return g.render(ctx);
    }
  };

  SVGaContainerElement.prototype.onclick = function() {
    return window.open(this.getHrefAttribute().value);
  };

  SVGaContainerElement.prototype.onmousemove = function() {
    return svg.ctx.canvas.style.cursor = "pointer";
  };

  return SVGaContainerElement;

})(SVGTextContentElement);

SVGtrefTextContentElement = (function(_super) {
  __extends(SVGtrefTextContentElement, _super);

  function SVGtrefTextContentElement(node) {
    SVGtrefTextContentElement.__super__.constructor.call(this, node);
  }

  SVGtrefTextContentElement.prototype.getText = function() {
    var element;

    element = this.getHrefAttribute().getDefinition();
    if (element != null) {
      return element.children[0].getText();
    }
  };

  return SVGtrefTextContentElement;

})(SVGTextContentElement);

SVGtspanTextContentElement = (function(_super) {
  __extends(SVGtspanTextContentElement, _super);

  function SVGtspanTextContentElement(node) {
    this.captureTextNodes = true;
    SVGtspanTextContentElement.__super__.constructor.call(this, node);
    this.text = node.nodeValue || node.text || "";
  }

  SVGtspanTextContentElement.prototype.getText = function() {
    return this.text;
  };

  return SVGtspanTextContentElement;

})(SVGTextContentElement);

SVGtextTextContentElement = (function(_super) {
  __extends(SVGtextTextContentElement, _super);

  function SVGtextTextContentElement(node) {
    this.captureTextNodes = true;
    SVGtextTextContentElement.__super__.constructor.call(this, node);
  }

  SVGtextTextContentElement.prototype.setContext = function(ctx) {
    SVGtextTextContentElement.__super__.setContext.call(this, ctx);
    if (this.style("dominant-baseline").hasValue()) {
      ctx.textBaseline = this.style("dominant-baseline").value;
    }
    if (this.style("alignment-baseline").hasValue()) {
      ctx.textBaseline = this.style("alignment-baseline").value;
    }
  };

  SVGtextTextContentElement.prototype.getBoundingBox = function() {
    return new SVGBoundingBox(this.attribute("x").toPixels("x"), this.attribute("y").toPixels("y"), 0, 0);
  };

  SVGtextTextContentElement.prototype.renderChildren = function(ctx) {
    var i, _i, _ref1;

    this.textAnchor = this.style("text-anchor").valueOrDefault("start");
    this.x = this.attribute("x").toPixels("x");
    this.y = this.attribute("y").toPixels("y");
    for (i = _i = 0, _ref1 = this.children.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.renderChild(ctx, this, i);
    }
  };

  SVGtextTextContentElement.prototype.renderChild = function(ctx, parent, i) {
    var child, childInGroup, childLength, groupLength, j, _i, _j, _ref1, _ref2, _ref3;

    child = parent.children[i];
    if (child.attribute("x").hasValue()) {
      child.x = child.attribute("x").toPixels("x");
    } else {
      if (this.attribute("dx").hasValue()) {
        this.x += this.attribute("dx").toPixels("x");
      }
      if (child.attribute("dx").hasValue()) {
        this.x += child.attribute("dx").toPixels("x");
      }
      child.x = this.x;
    }
    childLength = (typeof (child.measureText === "undefined") ? 0 : child.measureText(ctx));
    if (this.textAnchor !== "start" && (i === 0 || child.attribute("x").hasValue())) {
      groupLength = childLength;
      for (j = _i = _ref1 = i + 1, _ref2 = this.children.length; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; j = _ref1 <= _ref2 ? ++_i : --_i) {
        childInGroup = this.children[j];
        if (childInGroup.attribute("x").hasValue()) {
          break;
        }
        groupLength += childInGroup.measureText(ctx);
      }
      child.x -= (this.textAnchor === "end" ? groupLength : groupLength / 2.0);
    }
    this.x = child.x + childLength;
    if (child.attribute("y").hasValue()) {
      child.y = child.attribute("y").toPixels("y");
    } else {
      if (this.attribute("dy").hasValue()) {
        this.y += this.attribute("dy").toPixels("y");
      }
      if (child.attribute("dy").hasValue()) {
        this.y += child.attribute("dy").toPixels("y");
      }
      child.y = this.y;
    }
    this.y = child.y;
    child.render(ctx);
    for (i = _j = 0, _ref3 = child.children.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; i = 0 <= _ref3 ? ++_j : --_j) {
      this.renderChild(ctx, child, i);
    }
  };

  return SVGtextTextContentElement;

})(SVGRenderedElement);

SVGElement = (function(_super) {
  __extends(SVGElement, _super);

  function SVGElement(node) {
    SVGElement.__super__.constructor.call(this, node);
  }

  SVGElement.prototype.clearContext = function(ctx) {
    SVGElement.__super__.clearContext.call(this, ctx);
    return svg.ViewPort.RemoveCurrent();
  };

  SVGElement.prototype.setContext = function(ctx) {
    var height, minX, minY, viewBox, width, x, y;

    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 4;
    SVGElement.__super__.setContext.call(this, ctx);
    if (!this.attribute("x").hasValue()) {
      this.attribute("x", true).value = 0;
    }
    if (!this.attribute("y").hasValue()) {
      this.attribute("y", true).value = 0;
    }
    ctx.translate(this.attribute("x").toPixels("x"), this.attribute("y").toPixels("y"));
    width = svg.ViewPort.width();
    height = svg.ViewPort.height();
    if (!this.attribute("width").hasValue()) {
      this.attribute("width", true).value = "100%";
    }
    if (!this.attribute("height").hasValue()) {
      this.attribute("height", true).value = "100%";
    }
    if (typeof this.root === "undefined") {
      width = this.attribute("width").toPixels("x");
      height = this.attribute("height").toPixels("y");
      x = 0;
      y = 0;
      if (this.attribute("refX").hasValue() && this.attribute("refY").hasValue()) {
        x = -this.attribute("refX").toPixels("x");
        y = -this.attribute("refY").toPixels("y");
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(width, y);
      ctx.lineTo(width, height);
      ctx.lineTo(x, height);
      ctx.closePath();
      ctx.clip();
    }
    svg.ViewPort.SetCurrent(width, height);
    if (this.attribute("viewBox").hasValue()) {
      viewBox = svg.ToNumberArray(this.attribute("viewBox").value);
      minX = viewBox[0];
      minY = viewBox[1];
      width = viewBox[2];
      height = viewBox[3];
      svg.AspectRatio(ctx, this.attribute("preserveAspectRatio").value, svg.ViewPort.width(), width, svg.ViewPort.height(), height, minX, minY, this.attribute("refX").value, this.attribute("refY").value);
      svg.ViewPort.RemoveCurrent();
      return svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
    }
  };

  return SVGElement;

})(SVGRenderedElement);

SVGGraphicsElement = (function(_super) {
  __extends(SVGGraphicsElement, _super);

  function SVGGraphicsElement(node) {
    SVGGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGGraphicsElement.prototype.path = function(ctx) {
    if (ctx != null) {
      ctx.beginPath();
    }
    return new SVGBoundingBox();
  };

  SVGGraphicsElement.prototype.renderChildren = function(ctx) {
    var i, marker, markers, _i, _ref1;

    this.path(ctx);
    svg.SVGMouse.checkPath(this, ctx);
    if (ctx.fillStyle !== "") {
      ctx.fill();
    }
    if (ctx.strokeStyle !== "") {
      ctx.stroke();
    }
    markers = this.getMarkers();
    if (markers != null) {
      if (this.style("marker-start").isUrlDefinition()) {
        marker = this.style("marker-start").getDefinition();
        marker.render(ctx, markers[0][0], markers[0][1]);
      }
      if (this.style("marker-mid").isUrlDefinition()) {
        marker = this.style("marker-mid").getDefinition();
        for (i = _i = 1, _ref1 = markers.length - 1; 1 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
          marker.render(ctx, markers[i][0], markers[i][1]);
        }
      }
      if (this.style("marker-end").isUrlDefinition()) {
        marker = this.style("marker-end").getDefinition();
        return marker.render(ctx, markers[markers.length - 1][0], markers[markers.length - 1][1]);
      }
    }
  };

  SVGGraphicsElement.prototype.getBoundingBox = function() {
    return this.path();
  };

  SVGGraphicsElement.prototype.getMarkers = function() {
    return null;
  };

  return SVGGraphicsElement;

})(SVGRenderedElement);

SVGPathParser = (function() {
  function SVGPathParser(d) {
    this.tokens = d.split(" ");
  }

  SVGPathParser.prototype.reset = function() {
    this.i = -1;
    this.command = "";
    this.previousCommand = "";
    this.start = new SVGPoint(0, 0);
    this.control = new SVGPoint(0, 0);
    this.current = new SVGPoint(0, 0);
    this.points = [];
    return this.angles = [];
  };

  SVGPathParser.prototype.isEnd = function() {
    return this.i >= this.tokens.length - 1;
  };

  SVGPathParser.prototype.isCommandOrEnd = function() {
    if (this.isEnd()) {
      return true;
    }
    return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
  };

  SVGPathParser.prototype.isRelativeCommand = function() {
    switch (this.command) {
      case "m":
      case "l":
      case "h":
      case "v":
      case "c":
      case "s":
      case "q":
      case "t":
      case "a":
      case "z":
        return true;
    }
    return false;
  };

  SVGPathParser.prototype.getToken = function() {
    this.i++;
    return this.tokens[this.i];
  };

  SVGPathParser.prototype.getScalar = function() {
    return parseFloat(this.getToken());
  };

  SVGPathParser.prototype.nextCommand = function() {
    this.previousCommand = this.command;
    this.command = this.getToken();
  };

  SVGPathParser.prototype.getPoint = function() {
    var p;

    p = new SVGPoint(this.getScalar(), this.getScalar());
    return this.makeAbsolute(p);
  };

  SVGPathParser.prototype.getAsControlPoint = function() {
    var p;

    p = this.getPoint();
    this.control = p;
    return p;
  };

  SVGPathParser.prototype.getAsCurrentPoint = function() {
    var p;

    p = this.getPoint();
    this.current = p;
    return p;
  };

  SVGPathParser.prototype.getReflectedControlPoint = function() {
    var p;

    if (this.previousCommand.toLowerCase() !== "c" && this.previousCommand.toLowerCase() !== "s" && this.previousCommand.toLowerCase() !== "q" && this.previousCommand.toLowerCase() !== "t") {
      return this.current;
    }
    p = new SVGPoint(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
    return p;
  };

  SVGPathParser.prototype.makeAbsolute = function(p) {
    if (this.isRelativeCommand()) {
      p.x += this.current.x;
      p.y += this.current.y;
    }
    return p;
  };

  SVGPathParser.prototype.addMarker = function(p, from, priorTo) {
    if ((priorTo != null) && this.angles.length > 0 && (this.angles[this.angles.length - 1] == null)) {
      this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(priorTo);
    }
    return this.addMarkerAngle(p, (from == null ? null : from.angleTo(p)));
  };

  SVGPathParser.prototype.addMarkerAngle = function(p, a) {
    this.points.push(p);
    this.angles.push(a);
  };

  SVGPathParser.prototype.getMarkerPoints = function() {
    return this.points;
  };

  SVGPathParser.prototype.getMarkerAngles = function() {
    var i, j, _i, _j, _ref1, _ref2, _ref3;

    for (i = _i = 0, _ref1 = this.angles.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (this.angles[i] == null) {
        for (j = _j = _ref2 = i + 1, _ref3 = this.angles.length; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
          if (this.angles[j] != null) {
            this.angles[i] = this.angles[j];
            break;
          }
        }
      }
    }
    return this.angles;
  };

  return SVGPathParser;

})();

SVGpathGraphicsElement = (function(_super) {
  __extends(SVGpathGraphicsElement, _super);

  function SVGpathGraphicsElement(node) {
    var d;

    console.log('creating a SVGpathGraphicsElement');
    SVGpathGraphicsElement.__super__.constructor.call(this, node);
    console.log('created a SVGGraphicsElement');
    d = this.attribute("d").value;
    d = d.replace(/,/g, " ");
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2");
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2");
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/g, "$1 $2");
    d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2");
    d = d.replace(/([0-9])([+\-])/g, "$1 $2");
    d = d.replace(/(\.[0-9]*)(\.)/g, "$1 $2");
    d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/g, "$1 $3 $4 ");
    d = svg.compressSpaces(d);
    d = svg.trim(d);
    this.d = d;
    console.log('finished creating a path');
  }

  SVGpathGraphicsElement.prototype.path = function(ctx) {
    var a, a1, ad, ah, bb, c, centp, cntrl, cp, cpp, curr, currp, dir, halfWay, l, largeArcFlag, m, newP, p, p1, pp, r, rx, ry, s, sweepFlag, sx, sy, u, v, xAxisRotation;

    pp = new SVGPathParser(this.d);
    this.pp = pp;
    pp.reset();
    bb = new SVGBoundingBox();
    if (ctx != null) {
      ctx.beginPath();
    }
    while (!pp.isEnd()) {
      pp.nextCommand();
      switch (pp.command) {
        case "M":
        case "m":
          p = pp.getAsCurrentPoint();
          pp.addMarker(p);
          bb.addPoint(p.x, p.y);
          if (ctx != null) {
            ctx.moveTo(p.x, p.y);
          }
          pp.start = pp.current;
          while (!pp.isCommandOrEnd()) {
            p = pp.getAsCurrentPoint();
            pp.addMarker(p, pp.start);
            bb.addPoint(p.x, p.y);
            if (ctx != null) {
              ctx.lineTo(p.x, p.y);
            }
          }
          break;
        case "L":
        case "l":
          while (!pp.isCommandOrEnd()) {
            c = pp.current;
            p = pp.getAsCurrentPoint();
            pp.addMarker(p, c);
            bb.addPoint(p.x, p.y);
            if (ctx != null) {
              ctx.lineTo(p.x, p.y);
            }
          }
          break;
        case "H":
        case "h":
          while (!pp.isCommandOrEnd()) {
            newP = new SVGPoint((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
            pp.addMarker(newP, pp.current);
            pp.current = newP;
            bb.addPoint(pp.current.x, pp.current.y);
            if (ctx != null) {
              ctx.lineTo(pp.current.x, pp.current.y);
            }
          }
          break;
        case "V":
        case "v":
          while (!pp.isCommandOrEnd()) {
            newP = new SVGPoint(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
            pp.addMarker(newP, pp.current);
            pp.current = newP;
            bb.addPoint(pp.current.x, pp.current.y);
            if (ctx != null) {
              ctx.lineTo(pp.current.x, pp.current.y);
            }
          }
          break;
        case "C":
        case "c":
          while (!pp.isCommandOrEnd()) {
            curr = pp.current;
            p1 = pp.getPoint();
            cntrl = pp.getAsControlPoint();
            cp = pp.getAsCurrentPoint();
            pp.addMarker(cp, cntrl, p1);
            bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            if (ctx != null) {
              ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            }
          }
          break;
        case "S":
        case "s":
          while (!pp.isCommandOrEnd()) {
            curr = pp.current;
            p1 = pp.getReflectedControlPoint();
            cntrl = pp.getAsControlPoint();
            cp = pp.getAsCurrentPoint();
            pp.addMarker(cp, cntrl, p1);
            bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            if (ctx != null) {
              ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            }
          }
          break;
        case "Q":
        case "q":
          while (!pp.isCommandOrEnd()) {
            curr = pp.current;
            cntrl = pp.getAsControlPoint();
            cp = pp.getAsCurrentPoint();
            pp.addMarker(cp, cntrl, cntrl);
            bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
            if (ctx != null) {
              ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
            }
          }
          break;
        case "T":
        case "t":
          while (!pp.isCommandOrEnd()) {
            curr = pp.current;
            cntrl = pp.getReflectedControlPoint();
            pp.control = cntrl;
            cp = pp.getAsCurrentPoint();
            pp.addMarker(cp, cntrl, cntrl);
            bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
            if (ctx != null) {
              ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
            }
          }
          break;
        case "A":
        case "a":
          while (!pp.isCommandOrEnd()) {
            curr = pp.current;
            rx = pp.getScalar();
            ry = pp.getScalar();
            xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
            largeArcFlag = pp.getScalar();
            sweepFlag = pp.getScalar();
            cp = pp.getAsCurrentPoint();
            currp = new SVGPoint(Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0, -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0);
            l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
            if (l > 1) {
              rx *= Math.sqrt(l);
              ry *= Math.sqrt(l);
            }
            s = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
            if (isNaN(s)) {
              s = 0;
            }
            cpp = new SVGPoint(s * rx * currp.y / ry, s * -ry * currp.x / rx);
            centp = new SVGPoint((curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
            m = function(v) {
              return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
            };
            r = function(u, v) {
              return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
            };
            a = function(u, v) {
              return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
            };
            a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
            u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
            v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
            ad = a(u, v);
            if (r(u, v) <= -1) {
              ad = Math.PI;
            }
            if (r(u, v) >= 1) {
              ad = 0;
            }
            dir = (1 - sweepFlag ? 1.0 : -1.0);
            ah = a1 + dir * (ad / 2.0);
            halfWay = new SVGPoint(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah));
            pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
            pp.addMarkerAngle(cp, ah - dir * Math.PI);
            bb.addPoint(cp.x, cp.y);
            if (ctx != null) {
              r = (rx > ry ? rx : ry);
              sx = (rx > ry ? 1 : rx / ry);
              sy = (rx > ry ? ry / rx : 1);
              ctx.translate(centp.x, centp.y);
              ctx.rotate(xAxisRotation);
              ctx.scale(sx, sy);
              ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
              ctx.scale(1 / sx, 1 / sy);
              ctx.rotate(-xAxisRotation);
              ctx.translate(-centp.x, -centp.y);
            }
          }
          break;
        case "Z":
        case "z":
          if (ctx != null) {
            ctx.closePath();
          }
          pp.current = pp.start;
      }
    }
    return bb;
  };

  SVGpathGraphicsElement.prototype.getMarkers = function() {
    var angles, i, markers, points, _i, _ref1;

    points = this.pp.getMarkerPoints();
    angles = this.pp.getMarkerAngles();
    markers = [];
    for (i = _i = 0, _ref1 = points.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      markers.push([points[i], angles[i]]);
    }
    return markers;
  };

  return SVGpathGraphicsElement;

})(SVGGraphicsElement);

SVGglyphContainerElement = (function(_super) {
  __extends(SVGglyphContainerElement, _super);

  function SVGglyphContainerElement(node) {
    SVGglyphContainerElement.__super__.constructor.call(this, node);
    this.horizAdvX = this.attribute("horiz-adv-x").numValue();
    this.unicode = this.attribute("unicode").value;
    this.arabicForm = this.attribute("arabic-form").value;
    return;
  }

  return SVGglyphContainerElement;

})(SVGpathGraphicsElement);

/*
From http://www.w3.org/TR/SVG/fonts.html#MissingGlyphElement:
The ‘missing-glyph’ element defines the graphics to use
if there is an attempt to draw a glyph from a given font
and the given glyph has not been defined. The attributes
on the ‘missing-glyph’ element have the same meaning as
the corresponding attributes on the ‘glyph’ element.
*/


SVGmissingglyphContainerElement = (function(_super) {
  __extends(SVGmissingglyphContainerElement, _super);

  function SVGmissingglyphContainerElement(node) {
    SVGmissingglyphContainerElement.__super__.constructor.call(this, node);
    this.horizAdvX = 0;
    return;
  }

  return SVGmissingglyphContainerElement;

})(SVGpathGraphicsElement);

SVGpolylineGraphicsElement = (function(_super) {
  __extends(SVGpolylineGraphicsElement, _super);

  function SVGpolylineGraphicsElement(node) {
    SVGpolylineGraphicsElement.__super__.constructor.call(this, node);
    this.points = SVGPoint.pointsArrayFromNumberArray(this.attribute("points").value);
  }

  SVGpolylineGraphicsElement.prototype.path = function(ctx) {
    var bb, i, _i, _ref1;

    bb = new SVGBoundingBox(this.points[0].x, this.points[0].y);
    if (ctx != null) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
    }
    for (i = _i = 1, _ref1 = this.points.length; 1 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
      bb.addPoint(this.points[i].x, this.points[i].y);
      if (ctx != null) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }
    return bb;
  };

  SVGpolylineGraphicsElement.prototype.getMarkers = function() {
    var i, markers, _i, _ref1;

    markers = [];
    for (i = _i = 0, _ref1 = this.points.length - 1; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      markers.push([this.points[i], this.points[i].angleTo(this.points[i + 1])]);
    }
    markers.push([this.points[this.points.length - 1], markers[markers.length - 1][1]]);
    return markers;
  };

  return SVGpolylineGraphicsElement;

})(SVGGraphicsElement);

SVGpolygonGraphicsElement = (function(_super) {
  __extends(SVGpolygonGraphicsElement, _super);

  function SVGpolygonGraphicsElement(node) {
    SVGpolygonGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGpolygonGraphicsElement.prototype.path = function(ctx) {
    var bb;

    bb = SVGpolygonGraphicsElement.__super__.path.call(this, ctx);
    if (ctx != null) {
      ctx.lineTo(this.points[0].x, this.points[0].y);
      ctx.closePath();
    }
    return bb;
  };

  return SVGpolygonGraphicsElement;

})(SVGpolylineGraphicsElement);

SVGlineGraphicsElement = (function(_super) {
  __extends(SVGlineGraphicsElement, _super);

  function SVGlineGraphicsElement(node) {
    SVGlineGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGlineGraphicsElement.prototype.getPoints = function() {
    return [new SVGPoint(this.attribute("x1").toPixels("x"), this.attribute("y1").toPixels("y")), new SVGPoint(this.attribute("x2").toPixels("x"), this.attribute("y2").toPixels("y"))];
  };

  SVGlineGraphicsElement.prototype.path = function(ctx) {
    var points;

    points = this.getPoints();
    if (ctx != null) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
    }
    return new SVGBoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
  };

  SVGlineGraphicsElement.prototype.getMarkers = function() {
    var a, points;

    points = this.getPoints();
    a = points[0].angleTo(points[1]);
    return [[points[0], a], [points[1], a]];
  };

  return SVGlineGraphicsElement;

})(SVGGraphicsElement);

SVGellipseGraphicsElement = (function(_super) {
  __extends(SVGellipseGraphicsElement, _super);

  function SVGellipseGraphicsElement(node) {
    SVGellipseGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGellipseGraphicsElement.prototype.path = function(ctx) {
    var KAPPA, cx, cy, rx, ry;

    KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
    rx = this.attribute("rx").toPixels("x");
    ry = this.attribute("ry").toPixels("y");
    cx = this.attribute("cx").toPixels("x");
    cy = this.attribute("cy").toPixels("y");
    if (ctx != null) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - ry);
      ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry, cx + rx, cy - (KAPPA * ry), cx + rx, cy);
      ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
      ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
      ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
      ctx.closePath();
    }
    return new SVGBoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
  };

  return SVGellipseGraphicsElement;

})(SVGGraphicsElement);

SVGcircleGraphicsElement = (function(_super) {
  __extends(SVGcircleGraphicsElement, _super);

  function SVGcircleGraphicsElement(node) {
    SVGcircleGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGcircleGraphicsElement.prototype.path = function(ctx) {
    var cx, cy, r;

    cx = this.attribute("cx").toPixels("x");
    cy = this.attribute("cy").toPixels("y");
    r = this.attribute("r").toPixels();
    if (ctx != null) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
      ctx.closePath();
    }
    return new SVGBoundingBox(cx - r, cy - r, cx + r, cy + r);
  };

  return SVGcircleGraphicsElement;

})(SVGGraphicsElement);

SVGrectGraphicsElement = (function(_super) {
  __extends(SVGrectGraphicsElement, _super);

  function SVGrectGraphicsElement(node) {
    SVGrectGraphicsElement.__super__.constructor.call(this, node);
  }

  SVGrectGraphicsElement.prototype.path = function(ctx) {
    var height, rx, ry, width, x, y;

    x = this.attribute("x").toPixels("x");
    y = this.attribute("y").toPixels("y");
    width = this.attribute("width").toPixels("x");
    height = this.attribute("height").toPixels("y");
    rx = this.attribute("rx").toPixels("x");
    ry = this.attribute("ry").toPixels("y");
    if (this.attribute("rx").hasValue() && !this.attribute("ry").hasValue()) {
      ry = rx;
    }
    if (this.attribute("ry").hasValue() && !this.attribute("rx").hasValue()) {
      rx = ry;
    }
    rx = Math.min(rx, width / 2.0);
    ry = Math.min(ry, height / 2.0);
    if (ctx != null) {
      ctx.beginPath();
      ctx.moveTo(x + rx, y);
      ctx.lineTo(x + width - rx, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + ry);
      ctx.lineTo(x + width, y + height - ry);
      ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height);
      ctx.lineTo(x + rx, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - ry);
      ctx.lineTo(x, y + ry);
      ctx.quadraticCurveTo(x, y, x + rx, y);
      ctx.closePath();
    }
    return new SVGBoundingBox(x, y, x + width, y + height);
  };

  return SVGrectGraphicsElement;

})(SVGGraphicsElement);

SVGStopElement = (function(_super) {
  __extends(SVGStopElement, _super);

  function SVGStopElement(node) {
    var stopColor;

    SVGStopElement.__super__.constructor.call(this, node);
    this.offset = this.attribute("offset").numValue();
    if (this.offset < 0) {
      this.offset = 0;
    }
    if (this.offset > 1) {
      this.offset = 1;
    }
    stopColor = this.style("stop-color");
    if (this.style("stop-opacity").hasValue()) {
      stopColor = stopColor.addOpacity(this.style("stop-opacity").value);
    }
    this.color = stopColor.value;
    return;
  }

  return SVGStopElement;

})(SVGElement);

SVGdefsContainerElement = (function(_super) {
  __extends(SVGdefsContainerElement, _super);

  function SVGdefsContainerElement(node) {
    SVGdefsContainerElement.__super__.constructor.call(this, node);
  }

  SVGdefsContainerElement.prototype.render = function(ctx) {};

  return SVGdefsContainerElement;

})(SVGElement);

SVGmarkerContainerElement = (function(_super) {
  __extends(SVGmarkerContainerElement, _super);

  function SVGmarkerContainerElement(node) {
    SVGmarkerContainerElement.__super__.constructor.call(this, node);
  }

  SVGmarkerContainerElement.prototype.render = function(ctx, point, angle) {
    var tempSvg;

    ctx.translate(point.x, point.y);
    if (this.attribute("orient").valueOrDefault("auto") === "auto") {
      ctx.rotate(angle);
    }
    if (this.attribute("markerUnits").valueOrDefault("strokeWidth") === "strokeWidth") {
      ctx.scale(ctx.lineWidth, ctx.lineWidth);
    }
    ctx.save();
    tempSvg = new SVGElement();
    tempSvg.attributes["viewBox"] = new SVGProperty("viewBox", this.attribute("viewBox").value);
    tempSvg.attributes["refX"] = new SVGProperty("refX", this.attribute("refX").value);
    tempSvg.attributes["refY"] = new SVGProperty("refY", this.attribute("refY").value);
    tempSvg.attributes["width"] = new SVGProperty("width", this.attribute("markerWidth").value);
    tempSvg.attributes["height"] = new SVGProperty("height", this.attribute("markerHeight").value);
    tempSvg.attributes["fill"] = new SVGProperty("fill", this.attribute("fill").valueOrDefault("black"));
    tempSvg.attributes["stroke"] = new SVGProperty("stroke", this.attribute("stroke").valueOrDefault("none"));
    tempSvg.children = this.children;
    tempSvg.render(ctx);
    ctx.restore();
    if (this.attribute("markerUnits").valueOrDefault("strokeWidth") === "strokeWidth") {
      ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
    }
    if (this.attribute("orient").valueOrDefault("auto") === "auto") {
      ctx.rotate(-angle);
    }
    ctx.translate(-point.x, -point.y);
  };

  return SVGmarkerContainerElement;

})(SVGElement);

SVGpatternContainerElement = (function(_super) {
  __extends(SVGpatternContainerElement, _super);

  function SVGpatternContainerElement(node) {
    SVGpatternContainerElement.__super__.constructor.call(this, node);
  }

  SVGpatternContainerElement.prototype.createPattern = function(ctx, element) {
    var c, cctx, height, patternToBeReturned, tempSvg, width, x, y, _i, _j;

    width = this.attribute("width").toPixels("x", true);
    height = this.attribute("height").toPixels("y", true);
    tempSvg = new SVGElement();
    tempSvg.attributes["viewBox"] = new SVGProperty("viewBox", this.attribute("viewBox").value);
    tempSvg.attributes["width"] = new SVGProperty("width", width + "px");
    tempSvg.attributes["height"] = new SVGProperty("height", height + "px");
    tempSvg.attributes["transform"] = new SVGProperty("transform", this.attribute("patternTransform").value);
    tempSvg.children = this.children;
    c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    cctx = c.getContext("2d");
    if (this.attribute("x").hasValue() && this.attribute("y").hasValue()) {
      cctx.translate(this.attribute("x").toPixels("x", true), this.attribute("y").toPixels("y", true));
    }
    for (x = _i = -1; _i <= 1; x = ++_i) {
      for (y = _j = -1; _j <= 1; y = ++_j) {
        cctx.save();
        cctx.translate(x * c.width, y * c.height);
        tempSvg.render(cctx);
        cctx.restore();
      }
    }
    patternToBeReturned = ctx.createPattern(c, "repeat");
    return patternToBeReturned;
  };

  return SVGpatternContainerElement;

})(SVGElement);

SVGfeGaussianBlurFilterPrimitiveElement = (function(_super) {
  __extends(SVGfeGaussianBlurFilterPrimitiveElement, _super);

  function SVGfeGaussianBlurFilterPrimitiveElement(node) {
    SVGfeGaussianBlurFilterPrimitiveElement.__super__.constructor.call(this, node);
    this.blurRadius = Math.floor(this.attribute("stdDeviation").numValue());
    this.extraFilterDistance = this.blurRadius;
  }

  SVGfeGaussianBlurFilterPrimitiveElement.prototype.apply = function(ctx, x, y, width, height) {
    if (typeof stackBlurCanvasRGBA === "undefined") {
      console.log("ERROR: StackBlur.js must be included for blur to work");
      return;
    }
    ctx.canvas.id = svg.UniqueId();
    ctx.canvas.style.display = "none";
    document.body.appendChild(ctx.canvas);
    stackBlurCanvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
    document.body.removeChild(ctx.canvas);
  };

  return SVGfeGaussianBlurFilterPrimitiveElement;

})(SVGElement);

TransformsList = (function() {
  function TransformsList(v) {
    var data, i, s, transform, type, _i, _ref1;

    this.Type = {};
    this.Type.translate = SVGtranslateTransformType;
    this.Type.rotate = SVGrotateTransformType;
    this.Type.scale = SVGscaleTransformType;
    this.Type.matrix = SVGmatrixTransformType;
    this.Type.skewX = SVGskewXTransformType;
    this.Type.skewY = SVGskewYTransformType;
    this.transforms = [];
    data = svg.trim(svg.compressSpaces(v)).replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
    for (i = _i = 0, _ref1 = data.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      type = svg.trim(data[i].split("(")[0]);
      s = data[i].split("(")[1].replace(")", "");
      transform = new this.Type[type](s);
      transform.type = type;
      this.transforms.push(transform);
    }
  }

  TransformsList.prototype.apply = function(ctx) {
    var i, _i, _ref1;

    for (i = _i = 0, _ref1 = this.transforms.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.transforms[i].apply(ctx);
    }
  };

  TransformsList.prototype.applyToPoint = function(p) {
    var i, _i, _ref1;

    for (i = _i = 0, _ref1 = this.transforms.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.transforms[i].applyToPoint(p);
    }
  };

  return TransformsList;

})();

SVGscaleTransformType = (function() {
  function SVGscaleTransformType(s) {
    this.p = SVGPoint.pointsFromNumberArray(s);
  }

  SVGscaleTransformType.prototype.apply = function(ctx) {
    ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
  };

  SVGscaleTransformType.prototype.applyToPoint = function(p) {
    p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
  };

  return SVGscaleTransformType;

})();

SVGmatrixTransformType = (function() {
  function SVGmatrixTransformType(s) {
    this.m = svg.ToNumberArray(s);
  }

  SVGmatrixTransformType.prototype.apply = function(ctx) {
    ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
  };

  SVGmatrixTransformType.prototype.applyToPoint = function(p) {
    p.applyTransform(this.m);
  };

  return SVGmatrixTransformType;

})();

SVGSkewsTransformType = (function(_super) {
  __extends(SVGSkewsTransformType, _super);

  function SVGSkewsTransformType(s) {
    SVGSkewsTransformType.__super__.constructor.call(this, s);
    this.angle = new SVGProperty("angle", s);
    return;
  }

  return SVGSkewsTransformType;

})(SVGmatrixTransformType);

SVGskewXTransformType = (function(_super) {
  __extends(SVGskewXTransformType, _super);

  function SVGskewXTransformType(s) {
    SVGskewXTransformType.__super__.constructor.call(this, s);
    this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
    return;
  }

  return SVGskewXTransformType;

})(SVGSkewsTransformType);

SVGskewYTransformType = (function(_super) {
  __extends(SVGskewYTransformType, _super);

  function SVGskewYTransformType(s) {
    SVGskewYTransformType.__super__.constructor.call(this, s);
    this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
    return;
  }

  return SVGskewYTransformType;

})(SVGSkewsTransformType);

SVGrotateTransformType = (function() {
  function SVGrotateTransformType(s) {
    var a;

    a = svg.ToNumberArray(s);
    this.angle = new SVGProperty("angle", a[0]);
    this.cx = a[1] || 0;
    this.cy = a[2] || 0;
  }

  SVGrotateTransformType.prototype.apply = function(ctx) {
    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.angle.toRadians());
    ctx.translate(-this.cx, -this.cy);
  };

  SVGrotateTransformType.prototype.applyToPoint = function(p) {
    var a;

    a = this.angle.toRadians();
    p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
    p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
    p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
  };

  return SVGrotateTransformType;

})();

SVGtranslateTransformType = (function() {
  function SVGtranslateTransformType(s) {
    this.p = SVGPoint.pointsFromNumberArray(s);
  }

  SVGtranslateTransformType.prototype.apply = function(ctx) {
    ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
  };

  SVGtranslateTransformType.prototype.applyToPoint = function(p) {
    p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
  };

  return SVGtranslateTransformType;

})();

SVGBoundingBox = (function() {
  SVGBoundingBox.prototype.x1 = Number.NaN;

  SVGBoundingBox.prototype.y1 = Number.NaN;

  SVGBoundingBox.prototype.x2 = Number.NaN;

  SVGBoundingBox.prototype.y2 = Number.NaN;

  function SVGBoundingBox(x1, y1, x2, y2) {
    this.addPoint(x1, y1);
    this.addPoint(x2, y2);
    return;
  }

  SVGBoundingBox.prototype.x = function() {
    return this.x1;
  };

  SVGBoundingBox.prototype.y = function() {
    return this.y1;
  };

  SVGBoundingBox.prototype.width = function() {
    return this.x2 - this.x1;
  };

  SVGBoundingBox.prototype.height = function() {
    return this.y2 - this.y1;
  };

  SVGBoundingBox.prototype.addPoint = function(x, y) {
    if (x != null) {
      if (isNaN(this.x1) || isNaN(this.x2)) {
        this.x1 = x;
        this.x2 = x;
      }
      if (x < this.x1) {
        this.x1 = x;
      }
      if (x > this.x2) {
        this.x2 = x;
      }
    }
    if (y != null) {
      if (isNaN(this.y1) || isNaN(this.y2)) {
        this.y1 = y;
        this.y2 = y;
      }
      if (y < this.y1) {
        this.y1 = y;
      }
      if (y > this.y2) {
        return this.y2 = y;
      }
    }
  };

  SVGBoundingBox.prototype.addX = function(x) {
    return this.addPoint(x, null);
  };

  SVGBoundingBox.prototype.addY = function(y) {
    return this.addPoint(null, y);
  };

  SVGBoundingBox.prototype.addBoundingBox = function(bb) {
    this.addPoint(bb.x1, bb.y1);
    return this.addPoint(bb.x2, bb.y2);
  };

  SVGBoundingBox.prototype.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
    var cp1x, cp1y, cp2x, cp2y;

    cp1x = p0x + 2 / 3 * (p1x - p0x);
    cp1y = p0y + 2 / 3 * (p1y - p0y);
    cp2x = cp1x + 1 / 3 * (p2x - p0x);
    cp2y = cp1y + 1 / 3 * (p2y - p0y);
    this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
  };

  SVGBoundingBox.prototype.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
    var a, b, b2ac, c, f, i, p0, p1, p2, p3, t, t1, t2, _i;

    p0 = [p0x, p0y];
    p1 = [p1x, p1y];
    p2 = [p2x, p2y];
    p3 = [p3x, p3y];
    this.addPoint(p0[0], p0[1]);
    this.addPoint(p3[0], p3[1]);
    for (i = _i = 0; _i <= 1; i = ++_i) {
      f = function(t) {
        return Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i];
      };
      b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
      a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
      c = 3 * p1[i] - 3 * p0[i];
      if (a === 0) {
        if (b === 0) {
          continue;
        }
        t = -c / b;
        if (0 < t && t < 1) {
          if (i === 0) {
            this.addX(f(t));
          }
          if (i === 1) {
            this.addY(f(t));
          }
        }
        continue;
      }
      b2ac = Math.pow(b, 2) - 4 * c * a;
      if (b2ac < 0) {
        continue;
      }
      t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
      if (0 < t1 && t1 < 1) {
        if (i === 0) {
          this.addX(f(t1));
        }
        if (i === 1) {
          this.addY(f(t1));
        }
      }
      t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
      if (0 < t2 && t2 < 1) {
        if (i === 0) {
          this.addX(f(t2));
        }
        if (i === 1) {
          this.addY(f(t2));
        }
      }
    }
  };

  SVGBoundingBox.prototype.isPointInBox = function(x, y) {
    return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
  };

  return SVGBoundingBox;

})();

SVGViewPort = (function() {
  function SVGViewPort() {
    this.viewPorts = [];
  }

  SVGViewPort.prototype.Clear = function() {
    this.viewPorts = [];
  };

  SVGViewPort.prototype.SetCurrent = function(width, height) {
    this.viewPorts.push({
      width: width,
      height: height
    });
  };

  SVGViewPort.prototype.RemoveCurrent = function() {
    this.viewPorts.pop();
  };

  SVGViewPort.prototype.Current = function() {
    return this.viewPorts[this.viewPorts.length - 1];
  };

  SVGViewPort.prototype.width = function() {
    return this.Current().width;
  };

  SVGViewPort.prototype.height = function() {
    return this.Current().height;
  };

  SVGViewPort.prototype.ComputeSize = function(d) {
    if ((d != null) && typeof d === "number") {
      return d;
    }
    if (d === "x") {
      return this.width();
    }
    if (d === "y") {
      return this.height();
    }
    return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
  };

  return SVGViewPort;

})();

SVGPoint = (function() {
  function SVGPoint(x, y) {
    this.x = x;
    this.y = y;
    return;
  }

  SVGPoint.pointsFromNumberArray = function(s) {
    var a;

    if (arguments.length === 1) {
      a = svg.ToNumberArray(s);
      return new SVGPoint(a[0], a[1]);
    }
  };

  SVGPoint.pointsArrayFromNumberArray = function(s) {
    var a, i, pathOfPoints, _i, _ref1;

    a = svg.ToNumberArray(s);
    pathOfPoints = [];
    for (i = _i = 0, _ref1 = a.length; _i < _ref1; i = _i += 2) {
      pathOfPoints.push(new SVGPoint(a[i], a[i + 1]));
    }
    return pathOfPoints;
  };

  SVGPoint.prototype.angleTo = function(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  };

  SVGPoint.prototype.applyTransform = function(v) {
    var xp, yp;

    xp = this.x * v[0] + this.y * v[2] + v[4];
    yp = this.x * v[1] + this.y * v[3] + v[5];
    this.x = xp;
    this.y = yp;
  };

  return SVGPoint;

})();

SVGFont = (function() {
  function SVGFont() {
    this.Parse = __bind(this.Parse, this);
  }

  SVGFont.prototype.Styles = "normal|italic|oblique|inherit";

  SVGFont.prototype.Variants = "normal|small-caps|inherit";

  SVGFont.prototype.Weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";

  SVGFont.prototype.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
    var f;

    f = (inherit != null ? this.Parse(inherit) : this.CreateFont("", "", "", "", "", svg.ctx.font));
    return {
      fontFamily: fontFamily || f.fontFamily,
      fontSize: fontSize || f.fontSize,
      fontStyle: fontStyle || f.fontStyle,
      fontWeight: fontWeight || f.fontWeight,
      fontVariant: fontVariant || f.fontVariant,
      toString: function() {
        return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(" ");
      }
    };
  };

  SVGFont.prototype.Parse = function(s) {
    var d, f, ff, i, set, _i, _len;

    f = {};
    d = svg.trim(svg.compressSpaces(s || "")).split(" ");
    set = {
      fontSize: false,
      fontStyle: false,
      fontWeight: false,
      fontVariant: false
    };
    ff = "";
    for (_i = 0, _len = d.length; _i < _len; _i++) {
      i = d[_i];
      if (!set.fontStyle && this.Styles.indexOf(i) !== -1) {
        if (i !== "inherit") {
          f.fontStyle = i;
        }
        set.fontStyle = true;
      } else if (!set.fontVariant && this.Variants.indexOf(i) !== -1) {
        if (i !== "inherit") {
          f.fontVariant = i;
        }
        set.fontStyle = set.fontVariant = true;
      } else if (!set.fontWeight && this.Weights.indexOf(i) !== -1) {
        if (i !== "inherit") {
          f.fontWeight = i;
        }
        set.fontStyle = set.fontVariant = set.fontWeight = true;
      } else if (!set.fontSize) {
        if (i !== "inherit") {
          f.fontSize = i.split("/")[0];
        }
        set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true;
      } else {
        if (i !== "inherit") {
          ff += i;
        }
      }
    }
    if (ff !== "") {
      f.fontFamily = ff;
    }
    return f;
  };

  return SVGFont;

})();

SVGProperty = (function() {
  function SVGProperty(name, value) {
    this.name = name;
    this.value = value;
  }

  SVGProperty.prototype.getValue = function() {
    return this.value;
  };

  SVGProperty.prototype.hasValue = function() {
    return (this.value != null) && this.value !== "";
  };

  SVGProperty.prototype.numValue = function() {
    var n;

    if (!this.hasValue()) {
      return 0;
    }
    n = parseFloat(this.value);
    if ((this.value + "").match(/%$/)) {
      n = n / 100.0;
    }
    return n;
  };

  SVGProperty.prototype.valueOrDefault = function(def) {
    if (this.hasValue()) {
      return this.value;
    }
    return def;
  };

  SVGProperty.prototype.numValueOrDefault = function(def) {
    if (this.hasValue()) {
      return this.numValue();
    }
    return def;
  };

  SVGProperty.prototype.addOpacity = function(opacity) {
    var color, newValue;

    newValue = this.value;
    if ((opacity != null) && opacity !== "" && typeof this.value === "string") {
      color = new SVGRGBColor(this.value);
      if (color.ok) {
        newValue = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + opacity + ")";
      }
    }
    return new SVGProperty(this.name, newValue);
  };

  SVGProperty.prototype.getDefinition = function() {
    var name;

    name = this.value.match(/#([^\)']+)/);
    if (name) {
      name = name[1];
    }
    if (!name) {
      name = this.value;
    }
    if (name === "") {
      return null;
    }
    return svg.Definitions[name];
  };

  SVGProperty.prototype.isUrlDefinition = function() {
    return this.value.indexOf("url(") === 0;
  };

  SVGProperty.prototype.getFillStyleDefinition = function(e, opacityProp) {
    var def;

    def = this.getDefinition();
    if ((def != null) && def.createGradient) {
      return def.createGradient(svg.ctx, e, opacityProp);
    }
    if ((def != null) && def.createPattern) {
      return def.createPattern(svg.ctx, e);
    }
    return null;
  };

  SVGProperty.prototype.getDPI = function(viewPort) {
    return 96.0;
  };

  SVGProperty.prototype.getEM = function(viewPort) {
    var em, fontSize;

    em = 12;
    fontSize = new SVGProperty("fontSize", svg.Font.Parse(svg.ctx.font).fontSize);
    if (fontSize.hasValue()) {
      em = fontSize.toPixels(viewPort);
    }
    return em;
  };

  SVGProperty.prototype.getUnits = function() {
    var s;

    s = this.value + "";
    return s.replace(/[0-9\.\-]/g, "");
  };

  SVGProperty.prototype.toPixels = function(viewPort, processPercent) {
    var n, s;

    if (!this.hasValue()) {
      return 0;
    }
    s = this.value + "";
    if (s.match(/em$/)) {
      return this.numValue() * this.getEM(viewPort);
    }
    if (s.match(/ex$/)) {
      return this.numValue() * this.getEM(viewPort) / 2.0;
    }
    if (s.match(/px$/)) {
      return this.numValue();
    }
    if (s.match(/pt$/)) {
      return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
    }
    if (s.match(/pc$/)) {
      return this.numValue() * 15;
    }
    if (s.match(/cm$/)) {
      return this.numValue() * this.getDPI(viewPort) / 2.54;
    }
    if (s.match(/mm$/)) {
      return this.numValue() * this.getDPI(viewPort) / 25.4;
    }
    if (s.match(/in$/)) {
      return this.numValue() * this.getDPI(viewPort);
    }
    if (s.match(/%$/)) {
      return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
    }
    n = this.numValue();
    if (processPercent && n < 1.0) {
      return n * svg.ViewPort.ComputeSize(viewPort);
    }
    return n;
  };

  SVGProperty.prototype.toMilliseconds = function() {
    var s;

    if (!this.hasValue()) {
      return 0;
    }
    s = this.value + "";
    if (s.match(/s$/)) {
      return this.numValue() * 1000;
    }
    if (s.match(/ms$/)) {
      return this.numValue();
    }
    return this.numValue();
  };

  SVGProperty.prototype.toRadians = function() {
    var s;

    if (!this.hasValue()) {
      return 0;
    }
    s = this.value + "";
    if (s.match(/deg$/)) {
      return this.numValue() * (Math.PI / 180.0);
    }
    if (s.match(/grad$/)) {
      return this.numValue() * (Math.PI / 200.0);
    }
    if (s.match(/rad$/)) {
      return this.numValue();
    }
    return this.numValue() * (Math.PI / 180.0);
  };

  return SVGProperty;

})();

/*
A class to parse color values
@author Stoyan Stefanov <sstoo@gmail.com>
@link   http://www.phpied.com/rgb-color-parser-in-javascript/
@license Use it if you like it
*/


SVGRGBColor = function(color_string) {
  var bits, channels, color_def, color_defs, key, processor, re, simple_colors, _i, _len;

  this.ok = false;
  if (color_string.charAt(0) === "#") {
    color_string = color_string.substr(1, 6);
  }
  color_string = color_string.replace(RegExp(" ", "g"), "");
  color_string = color_string.toLowerCase();
  simple_colors = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "00ffff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000000",
    blanchedalmond: "ffebcd",
    blue: "0000ff",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "00ffff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dodgerblue: "1e90ff",
    feldspar: "d19275",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "ff00ff",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgrey: "d3d3d3",
    lightgreen: "90ee90",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslateblue: "8470ff",
    lightslategray: "778899",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "00ff00",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "ff00ff",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370d8",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "d87093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    red: "ff0000",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    violetred: "d02090",
    wheat: "f5deb3",
    white: "ffffff",
    whitesmoke: "f5f5f5",
    yellow: "ffff00",
    yellowgreen: "9acd32"
  };
  for (key in simple_colors) {
    if (color_string === key) {
      color_string = simple_colors[key];
    }
  }
  color_defs = [
    {
      re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      process: function(bits) {
        return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
      }
    }, {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      process: function(bits) {
        return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
      }
    }, {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      process: function(bits) {
        return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
      }
    }
  ];
  for (_i = 0, _len = color_defs.length; _i < _len; _i++) {
    color_def = color_defs[_i];
    re = color_def.re;
    processor = color_def.process;
    bits = re.exec(color_string);
    if (bits) {
      channels = processor(bits);
      this.r = channels[0];
      this.g = channels[1];
      this.b = channels[2];
      this.ok = true;
    }
  }
  this.r = (this.r < 0 || isNaN(this.r) ? 0 : (this.r > 255 ? 255 : this.r));
  this.g = (this.g < 0 || isNaN(this.g) ? 0 : (this.g > 255 ? 255 : this.g));
  this.b = (this.b < 0 || isNaN(this.b) ? 0 : (this.b > 255 ? 255 : this.b));
  this.toRGB = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  };
  return this.toHex = function() {
    var b, g, r;

    r = this.r.toString(16);
    g = this.g.toString(16);
    b = this.b.toString(16);
    if (r.length === 1) {
      r = "0" + r;
    }
    if (g.length === 1) {
      g = "0" + g;
    }
    if (b.length === 1) {
      b = "0" + b;
    }
    return "#" + r + g + b;
  };
};
