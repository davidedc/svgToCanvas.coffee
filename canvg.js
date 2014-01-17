var AnimateBase, AspectRatio, BoundingBox, ElementBase, ElementBaseStyle, Font, GradientBase, MISSING, Mouse, PathElementBase, PathParser, Point, Property, RGBColor, RenderedElementBase, SkewBase, TextElementBase, Transform, ViewPort, a, animate, animateColor, animateTransform, canvg, circle, clipPath, defs, desc, ellipse, feColorMatrix, feGaussianBlur, feMorphology, filter, font, fontface, g, glyph, image, line, linearGradient, marker, mask, matrix, missingglyph, path, pattern, polygon, polyline, radialGradient, rect, rotate, scale, skewX, skewY, stop, svg, svgClass, svgElement, symbol, text, title, translate, tref, tspan, use, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mouse = (function() {
  function Mouse() {
    this.events = [];
    this.eventElements = [];
  }

  Mouse.prototype.hasEvents = function() {
    return this.events.length !== 0;
  };

  Mouse.prototype.onclick = function(x, y) {
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

  Mouse.prototype.onmousemove = function(x, y) {
    return this.events.push({
      type: "onmousemove",
      x: x,
      y: y,
      run: function(e) {
        if (e.onmousemove) {
          return e.onmousemove();
        }
      }
    });
  };

  Mouse.prototype.checkPath = function(element, ctx) {
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

  Mouse.prototype.checkBoundingBox = function(element, bb) {
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

  Mouse.prototype.runEvents = function() {
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

  return Mouse;

})();

ElementBase = (function() {
  function ElementBase(node) {
    var attribute, childNode, classes, i, j, name, style, styles, value, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;

    this.attributes = {};
    this.styles = {};
    this.children = [];
    if ((node != null) && node.nodeType === 1) {
      for (i = _i = 0, _ref = node.childNodes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        childNode = node.childNodes[i];
        if (childNode.nodeType === 1) {
          this.addChild(childNode, true);
        }
        if (this.captureTextNodes && childNode.nodeType === 3) {
          this.addChild(new svg.Element.tspan(childNode), false);
        }
      }
      for (i = _j = 0, _ref1 = node.attributes.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        attribute = node.attributes[i];
        this.attributes[attribute.nodeName] = new Property(attribute.nodeName, attribute.nodeValue);
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
            this.styles[name] = new Property(name, value);
          }
        }
      }
      if (!(this.attribute("id").hasValue() ? svg.Definitions[this.attribute("id").value] != null : void 0)) {
        svg.Definitions[this.attribute("id").value] = this;
      }
    }
    return;
  }

  ElementBase.prototype.attribute = function(name, createIfNotExists) {
    var a;

    a = this.attributes[name];
    if (a != null) {
      return a;
    }
    if (createIfNotExists === true) {
      a = new Property(name, "");
      this.attributes[name] = a;
    }
    return a || svg.EmptyProperty;
  };

  ElementBase.prototype.getHrefAttribute = function() {
    var a;

    for (a in this.attributes) {
      if (a.match(/:href$/)) {
        return this.attributes[a];
      }
    }
    return svg.EmptyProperty;
  };

  ElementBase.prototype.style = function(name, createIfNotExists) {
    var a, p, ps, s;

    console.log("name, createIfNotExists " + name + " " + createIfNotExists);
    console.log("@styles " + this.styles + " class name: " + this.constructor.name);
    if (this.constructor.name === "title" || this.constructor.name === "desc" || this.constructor.name === "MISSING") {
      console.log("for the break");
      console.trace();
      return svg.EmptyProperty;
    }
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
      s = new Property(name, "");
      this.styles[name] = s;
    }
    return s || svg.EmptyProperty;
  };

  ElementBase.prototype.render = function(ctx) {
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

  ElementBase.prototype.setContext = function(ctx) {};

  ElementBase.prototype.clearContext = function(ctx) {};

  ElementBase.prototype.renderChildren = function(ctx) {
    var i, _i, _ref;

    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.children[i].render(ctx);
    }
  };

  ElementBase.prototype.addChild = function(childNode, create) {
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

  return ElementBase;

})();

title = (function(_super) {
  __extends(title, _super);

  function title(node) {}

  return title;

})(ElementBase);

desc = (function(_super) {
  __extends(desc, _super);

  function desc(node) {}

  return desc;

})(ElementBase);

MISSING = (function(_super) {
  __extends(MISSING, _super);

  function MISSING(node) {
    if (console) {
      console.log("ERROR: Element '" + node.nodeName + "' not yet implemented.");
    }
  }

  return MISSING;

})(ElementBase);

feColorMatrix = (function(_super) {
  __extends(feColorMatrix, _super);

  function feColorMatrix(node) {
    feColorMatrix.__super__.constructor.call(this, node);
  }

  feColorMatrix.prototype.imGet = function(img, x, y, width, height, rgba) {
    return img[y * width * 4 + x * 4 + rgba];
  };

  feColorMatrix.prototype.imSet = function(img, x, y, width, height, rgba, val) {
    return img[y * width * 4 + x * 4 + rgba] = val;
  };

  feColorMatrix.prototype.apply = function(ctx, x, y, width, height) {
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

  return feColorMatrix;

})(ElementBase);

feMorphology = (function(_super) {
  __extends(feMorphology, _super);

  function feMorphology(node) {
    feMorphology.__super__.constructor.call(this, node);
  }

  feMorphology.prototype.apply = function(ctx, x, y, width, height) {};

  return feMorphology;

})(ElementBase);

filter = (function(_super) {
  __extends(filter, _super);

  function filter(node) {
    filter.__super__.constructor.call(this, node);
  }

  filter.prototype.apply = function(ctx, element) {
    var bb, c, efd, height, i, px, py, tempCtx, width, x, y, _i, _j, _ref, _ref1;

    bb = element.getBoundingBox();
    x = Math.floor(bb.x1);
    y = Math.floor(bb.y1);
    width = Math.floor(bb.width());
    height = Math.floor(bb.height());
    filter = element.style("filter").value;
    element.style("filter").value = "";
    px = 0;
    py = 0;
    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      efd = this.children[i].extraFilterDistance || 0;
      px = Math.max(px, efd);
      py = Math.max(py, efd);
    }
    c = document.createElement("canvas");
    c.width = width + 2 * px;
    c.height = height + 2 * py;
    tempCtx = c.getContext("2d");
    tempCtx.translate(-x + px, -y + py);
    element.render(tempCtx);
    for (i = _j = 0, _ref1 = this.children.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      this.children[i].apply(tempCtx, 0, 0, width + 2 * px, height + 2 * py);
    }
    ctx.drawImage(c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py);
    return element.style("filter", true).value = filter;
  };

  filter.prototype.render = function(ctx) {};

  return filter;

})(ElementBase);

clipPath = (function(_super) {
  var render;

  __extends(clipPath, _super);

  function clipPath(node) {
    clipPath.__super__.constructor.call(this, node);
  }

  clipPath.prototype.apply = function(ctx) {
    var i, _i, _ref;

    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (this.children[i].path) {
        this.children[i].path(ctx);
        ctx.clip();
      }
    }
  };

  render = function(ctx) {};

  return clipPath;

})(ElementBase);

mask = (function(_super) {
  __extends(mask, _super);

  function mask(node) {
    mask.__super__.constructor.call(this, node);
  }

  mask.prototype.apply = function(ctx, element) {
    var c, cMask, height, maskCtx, tempCtx, width, x, y;

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

  mask.prototype.render = function(ctx) {};

  return mask;

})(ElementBase);

ElementBaseStyle = (function(_super) {
  __extends(ElementBaseStyle, _super);

  function ElementBaseStyle(node) {
    var css, cssClass, cssClasses, cssDef, cssDefs, cssProps, doc, f, font, fontFamily, fonts, i, j, k, name, prop, props, s, srcs, url, urlEnd, urlStart, value, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

    ElementBaseStyle.__super__.constructor.call(this, node);
    css = "";
    for (i = _i = 0, _ref = node.childNodes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      css += node.childNodes[i].nodeValue;
    }
    css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/g, "");
    css = svg.compressSpaces(css);
    cssDefs = css.split("}");
    for (i = _j = 0, _ref1 = cssDefs.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      if (svg.trim(cssDefs[i]) !== "") {
        cssDef = cssDefs[i].split("{");
        cssClasses = cssDef[0].split(",");
        cssProps = cssDef[1].split(";");
        for (j = _k = 0, _ref2 = cssClasses.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
          cssClass = svg.trim(cssClasses[j]);
          if (cssClass !== "") {
            props = {};
            for (k = _l = 0, _ref3 = cssProps.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
              prop = cssProps[k].indexOf(":");
              name = cssProps[k].substr(0, prop);
              value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
              if ((name != null) && (value != null)) {
                props[svg.trim(name)] = new Property(svg.trim(name), svg.trim(value));
              }
            }
            svg.Styles[cssClass] = props;
            if (cssClass === "@font-face") {
              fontFamily = props["font-family"].value.replace(/"/g, "");
              srcs = props["src"].value.split(",");
              for (s = _m = 0, _ref4 = srcs.length; 0 <= _ref4 ? _m < _ref4 : _m > _ref4; s = 0 <= _ref4 ? ++_m : --_m) {
                if (srcs[s].indexOf("format(\"svg\")") > 0) {
                  urlStart = srcs[s].indexOf("url");
                  urlEnd = srcs[s].indexOf(")", urlStart);
                  url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
                  doc = svg.parseXml(svg.ajax(url));
                  fonts = doc.getElementsByTagName("font");
                  for (f = _n = 0, _ref5 = fonts.length; 0 <= _ref5 ? _n < _ref5 : _n > _ref5; f = 0 <= _ref5 ? ++_n : --_n) {
                    font = svg.CreateElement(fonts[f]);
                    svg.Definitions[fontFamily] = font;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return ElementBaseStyle;

})(ElementBase);

fontface = (function(_super) {
  __extends(fontface, _super);

  function fontface(node) {
    fontface.__super__.constructor.call(this, node);
    this.ascent = this.attribute("ascent").value;
    this.descent = this.attribute("descent").value;
    this.unitsPerEm = this.attribute("units-per-em").numValue();
  }

  return fontface;

})(ElementBase);

font = (function(_super) {
  __extends(font, _super);

  function font(node) {
    var child, i, _i, _ref;

    this.isRTL = false;
    this.isArabic = false;
    this.fontFace = null;
    this.missingGlyph = null;
    this.glyphs = [];
    font.__super__.constructor.call(this, node);
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

  return font;

})(ElementBase);

AnimateBase = (function(_super) {
  __extends(AnimateBase, _super);

  AnimateBase.prototype.duration = 0.0;

  AnimateBase.prototype.initialValue = null;

  AnimateBase.prototype.initialUnits = "";

  AnimateBase.prototype.removed = false;

  function AnimateBase(node) {
    AnimateBase.__super__.constructor.call(this, node);
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

  AnimateBase.prototype.getProperty = function() {
    var attributeName, attributeType;

    attributeType = this.attribute("attributeType").value;
    attributeName = this.attribute("attributeName").value;
    if (attributeType === "CSS") {
      return this.parent.style(attributeName, true);
    }
    return this.parent.attribute(attributeName, true);
  };

  AnimateBase.prototype.calcValue = function() {
    return "";
  };

  AnimateBase.prototype.update = function(delta) {
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

  AnimateBase.prototype.progress = function() {
    var lb, p, ret, ub;

    ret = (this.duration - this.begin) / (this.maxDuration - this.begin);
    if (this.values.hasValue()) {
      p = ret.progress * (this.values.value.length - 1);
      lb = Math.floor(p);
      ub = Math.ceil(p);
      ret.from = new Property("from", parseFloat(this.values.value[lb]));
      ret.to = new Property("to", parseFloat(this.values.value[ub]));
      ret.progress = (p - lb) / (ub - lb);
    } else {
      ret.from = this.from;
      ret.to = this.to;
    }
    return ret;
  };

  return AnimateBase;

})(ElementBase);

animateTransform = (function(_super) {
  __extends(animateTransform, _super);

  function animateTransform(node) {
    animateTransform.__super__.constructor.call(this, node);
  }

  animateTransform.prototype.calcValue = function() {
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

  return animateTransform;

})(AnimateBase);

animateColor = (function(_super) {
  __extends(animateColor, _super);

  function animateColor(node) {
    animateColor.__super__.constructor.call(this, node);
  }

  animateColor.prototype.calcValue = function() {
    var b, from, g, p, r, to;

    p = this.progress();
    from = new RGBColor(p.from.value);
    to = new RGBColor(p.to.value);
    if (from.ok && to.ok) {
      r = from.r + (to.r - from.r) * p.progress;
      g = from.g + (to.g - from.g) * p.progress;
      b = from.b + (to.b - from.b) * p.progress;
      return "rgb(" + parseInt(r, 10) + "," + parseInt(g, 10) + "," + parseInt(b, 10) + ")";
    }
    return this.attribute("from").value;
  };

  return animateColor;

})(AnimateBase);

animate = (function(_super) {
  __extends(animate, _super);

  function animate(node) {
    animate.__super__.constructor.call(this, node);
  }

  animate.prototype.calcValue = function() {
    var newValue, p;

    p = this.progress();
    newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
    return newValue + this.initialUnits;
  };

  return animate;

})(AnimateBase);

GradientBase = (function(_super) {
  __extends(GradientBase, _super);

  function GradientBase(node) {
    var child, i, _i, _ref;

    this.stops = [];
    GradientBase.__super__.constructor.call(this, node);
    this.gradientUnits = this.attribute("gradientUnits").valueOrDefault("objectBoundingBox");
    for (i = _i = 0, _ref = this.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      child = this.children[i];
      if (child.type === "stop") {
        this.stops.push(child);
      }
    }
    return;
  }

  GradientBase.prototype.getGradient = function() {};

  GradientBase.prototype.createGradient = function(ctx, element, parentOpacityProp) {
    var addParentOpacity, c, g, group, i, rect, rootView, stopsContainer, tempCtx, tempSvg, _i, _ref;

    stopsContainer = this;
    if (this.getHrefAttribute().hasValue()) {
      stopsContainer = this.getHrefAttribute().getDefinition();
    }
    addParentOpacity = function(color) {
      var p;

      if (parentOpacityProp.hasValue()) {
        p = new Property("color", color);
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
      rect = new svg.Element.rect();
      rect.attributes["x"] = new Property("x", -svg.MAX_VIRTUAL_PIXELS / 3.0);
      rect.attributes["y"] = new Property("y", -svg.MAX_VIRTUAL_PIXELS / 3.0);
      rect.attributes["width"] = new Property("width", svg.MAX_VIRTUAL_PIXELS);
      rect.attributes["height"] = new Property("height", svg.MAX_VIRTUAL_PIXELS);
      group = new svg.Element.g();
      group.attributes["transform"] = new Property("transform", this.attribute("gradientTransform").value);
      group.children = [rect];
      tempSvg = new svg.Element.svg();
      tempSvg.attributes["x"] = new Property("x", 0);
      tempSvg.attributes["y"] = new Property("y", 0);
      tempSvg.attributes["width"] = new Property("width", rootView.width);
      tempSvg.attributes["height"] = new Property("height", rootView.height);
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

  return GradientBase;

})(ElementBase);

radialGradient = (function(_super) {
  __extends(radialGradient, _super);

  function radialGradient(node) {
    radialGradient.__super__.constructor.call(this, node);
  }

  radialGradient.prototype.getGradient = function(ctx, element) {
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

  return radialGradient;

})(GradientBase);

linearGradient = (function(_super) {
  __extends(linearGradient, _super);

  function linearGradient(node) {
    linearGradient.__super__.constructor.call(this, node);
  }

  linearGradient.prototype.getGradient = function(ctx, element) {
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

  return linearGradient;

})(GradientBase);

RenderedElementBase = (function(_super) {
  __extends(RenderedElementBase, _super);

  function RenderedElementBase(node) {
    RenderedElementBase.__super__.constructor.call(this, node);
  }

  RenderedElementBase.prototype.setContext = function(ctx) {
    var clip, fillStyle, fs, newLineWidth, strokeStyle, transform;

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
      ctx.fillStyle = (fillStyle.value === "none" ? "rgba(0,0,0,0)" : fillStyle.value);
    }
    if (this.style("fill-opacity").hasValue()) {
      fillStyle = new Property("fill", ctx.fillStyle);
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
      strokeStyle = new Property("stroke", ctx.strokeStyle);
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
    if (typeof ctx.font !== "undefined") {
      ctx.font = svg.Font.CreateFont(this.style("font-style").value, this.style("font-variant").value, this.style("font-weight").value, (this.style("font-size").hasValue() ? this.style("font-size").toPixels() + "px" : ""), this.style("font-family").value).toString();
    }
    if (this.attribute("transform").hasValue()) {
      transform = new svg.Transform(this.attribute("transform").value);
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

  return RenderedElementBase;

})(ElementBase);

use = (function(_super) {
  __extends(use, _super);

  function use() {
    _ref = use.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  use.prototype.contructor = function(node) {
    return use.__super__.contructor.call(this, node);
  };

  use.prototype.setContext = function(ctx) {
    use.__super__.setContext.call(this, ctx);
    if (this.attribute("x").hasValue()) {
      ctx.translate(this.attribute("x").toPixels("x"), 0);
    }
    if (this.attribute("y").hasValue()) {
      return ctx.translate(0, this.attribute("y").toPixels("y"));
    }
  };

  use.prototype.getDefinition = function() {
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

  use.prototype.path = function(ctx) {
    var element;

    element = this.getDefinition();
    if (element != null) {
      return element.path(ctx);
    }
  };

  use.prototype.getBoundingBox = function() {
    var element;

    element = this.getDefinition();
    if (element != null) {
      return element.getBoundingBox();
    }
  };

  use.prototype.renderChildren = function(ctx) {
    var element, oldParent;

    element = this.getDefinition();
    if (element != null) {
      oldParent = element.parent;
      element.parent = null;
      element.render(ctx);
      return element.parent = oldParent;
    }
  };

  return use;

})(RenderedElementBase);

g = (function(_super) {
  __extends(g, _super);

  function g(node) {
    g.__super__.constructor.call(this, node);
  }

  g.prototype.getBoundingBox = function() {
    var bb, i, _i, _ref1;

    bb = new BoundingBox();
    for (i = _i = 0, _ref1 = this.children.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      bb.addBoundingBox(this.children[i].getBoundingBox());
    }
    return bb;
  };

  return g;

})(RenderedElementBase);

symbol = (function(_super) {
  __extends(symbol, _super);

  function symbol(node) {
    symbol.__super__.constructor.call(this, node);
  }

  symbol.prototype.setContext = function(ctx) {
    var height, minX, minY, viewBox, width;

    symbol.__super__.setContext.call(this, ctx);
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

  return symbol;

})(RenderedElementBase);

image = (function(_super) {
  __extends(image, _super);

  function image(node) {
    var href, isSvg, self;

    image.__super__.constructor.call(this, node);
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

  image.prototype.getBoundingBox = function() {
    var height, width, x, y;

    x = this.attribute("x").toPixels("x");
    y = this.attribute("y").toPixels("y");
    width = this.attribute("width").toPixels("x");
    height = this.attribute("height").toPixels("y");
    return new BoundingBox(x, y, x + width, y + height);
  };

  return image;

})(RenderedElementBase);

TextElementBase = (function(_super) {
  __extends(TextElementBase, _super);

  function TextElementBase(node) {
    TextElementBase.__super__.constructor.call(this, node);
  }

  TextElementBase.prototype.getGlyph = function(font, text, i) {
    var arabicForm, c, glyph;

    c = text[i];
    glyph = null;
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
      glyph = font.glyphs[c];
    }
    if (glyph == null) {
      glyph = font.missingGlyph;
    }
    return glyph;
  };

  TextElementBase.prototype.renderChildren = function(ctx) {
    var customFont, dx, fontSize, fontStyle, glyph, i, lw, scale, text, _i, _ref1;

    customFont = this.parent.style("font-family").getDefinition();
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

  TextElementBase.prototype.getText = function() {};

  TextElementBase.prototype.measureText = function(ctx) {
    var customFont, dx, fontSize, glyph, i, measure, text, textToMeasure, width, _i, _ref1;

    customFont = this.parent.style("font-family").getDefinition();
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

  return TextElementBase;

})(RenderedElementBase);

a = (function(_super) {
  __extends(a, _super);

  function a(node) {
    var i, _i, _ref1;

    a.__super__.constructor.call(this, node);
    this.hasText = true;
    for (i = _i = 0, _ref1 = node.childNodes.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (node.childNodes[i].nodeType !== 3) {
        this.hasText = false;
      }
    }
    this.text = (this.hasText ? node.childNodes[0].nodeValue : "");
  }

  a.prototype.getText = function() {
    return this.text;
  };

  a.prototype.renderChildren = function(ctx) {
    var fontSize;

    if (this.hasText) {
      a.__super__.renderChildren.call(this, ctx);
      fontSize = new Property("fontSize", svg.Font.Parse(svg.ctx.font).fontSize);
      return svg.Mouse.checkBoundingBox(this, new BoundingBox(this.x, this.y - fontSize.toPixels("y"), this.x + this.measureText(ctx), this.y));
    } else {
      g = new svg.Element.g();
      g.children = this.children;
      g.parent = this;
      return g.render(ctx);
    }
  };

  a.prototype.onclick = function() {
    return window.open(this.getHrefAttribute().value);
  };

  a.prototype.onmousemove = function() {
    return svg.ctx.canvas.style.cursor = "pointer";
  };

  return a;

})(TextElementBase);

tref = (function(_super) {
  __extends(tref, _super);

  function tref(node) {
    tref.__super__.constructor.call(this, node);
  }

  tref.prototype.getText = function() {
    var element;

    element = this.getHrefAttribute().getDefinition();
    if (element != null) {
      return element.children[0].getText();
    }
  };

  return tref;

})(TextElementBase);

tspan = (function(_super) {
  __extends(tspan, _super);

  function tspan(node) {
    this.captureTextNodes = true;
    tspan.__super__.constructor.call(this, node);
    this.text = node.nodeValue || node.text || "";
  }

  tspan.prototype.getText = function() {
    return this.text;
  };

  return tspan;

})(TextElementBase);

text = (function(_super) {
  __extends(text, _super);

  function text(node) {
    this.captureTextNodes = true;
    text.__super__.constructor.call(this, node);
  }

  text.prototype.setContext = function(ctx) {
    text.__super__.setContext.call(this, ctx);
    if (this.style("dominant-baseline").hasValue()) {
      ctx.textBaseline = this.style("dominant-baseline").value;
    }
    if (this.style("alignment-baseline").hasValue()) {
      ctx.textBaseline = this.style("alignment-baseline").value;
    }
  };

  text.prototype.getBoundingBox = function() {
    return new BoundingBox(this.attribute("x").toPixels("x"), this.attribute("y").toPixels("y"), 0, 0);
  };

  text.prototype.renderChildren = function(ctx) {
    var i, _i, _ref1;

    this.textAnchor = this.style("text-anchor").valueOrDefault("start");
    this.x = this.attribute("x").toPixels("x");
    this.y = this.attribute("y").toPixels("y");
    for (i = _i = 0, _ref1 = this.children.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.renderChild(ctx, this, i);
    }
  };

  text.prototype.renderChild = function(ctx, parent, i) {
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

  return text;

})(RenderedElementBase);

svgElement = (function(_super) {
  __extends(svgElement, _super);

  function svgElement(node) {
    svgElement.__super__.constructor.call(this, node);
  }

  svgElement.prototype.clearContext = function(ctx) {
    svgElement.__super__.clearContext.call(this, ctx);
    return svg.ViewPort.RemoveCurrent();
  };

  svgElement.prototype.setContext = function(ctx) {
    var height, minX, minY, viewBox, width, x, y;

    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 4;
    svgElement.__super__.setContext.call(this, ctx);
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

  return svgElement;

})(RenderedElementBase);

PathElementBase = (function(_super) {
  __extends(PathElementBase, _super);

  function PathElementBase(node) {
    PathElementBase.__super__.constructor.call(this, node);
  }

  PathElementBase.prototype.path = function(ctx) {
    if (ctx != null) {
      ctx.beginPath();
    }
    return new BoundingBox();
  };

  PathElementBase.prototype.renderChildren = function(ctx) {
    var i, marker, markers, _i, _ref1;

    this.path(ctx);
    svg.Mouse.checkPath(this, ctx);
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

  PathElementBase.prototype.getBoundingBox = function() {
    return this.path();
  };

  PathElementBase.prototype.getMarkers = function() {
    return null;
  };

  return PathElementBase;

})(RenderedElementBase);

PathParser = (function() {
  function PathParser(d) {
    this.tokens = d.split(" ");
  }

  PathParser.prototype.reset = function() {
    this.i = -1;
    this.command = "";
    this.previousCommand = "";
    this.start = new Point(0, 0);
    this.control = new Point(0, 0);
    this.current = new Point(0, 0);
    this.points = [];
    return this.angles = [];
  };

  PathParser.prototype.isEnd = function() {
    return this.i >= this.tokens.length - 1;
  };

  PathParser.prototype.isCommandOrEnd = function() {
    if (this.isEnd()) {
      return true;
    }
    return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
  };

  PathParser.prototype.isRelativeCommand = function() {
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

  PathParser.prototype.getToken = function() {
    this.i++;
    return this.tokens[this.i];
  };

  PathParser.prototype.getScalar = function() {
    return parseFloat(this.getToken());
  };

  PathParser.prototype.nextCommand = function() {
    this.previousCommand = this.command;
    this.command = this.getToken();
  };

  PathParser.prototype.getPoint = function() {
    var p;

    p = new Point(this.getScalar(), this.getScalar());
    return this.makeAbsolute(p);
  };

  PathParser.prototype.getAsControlPoint = function() {
    var p;

    p = this.getPoint();
    this.control = p;
    return p;
  };

  PathParser.prototype.getAsCurrentPoint = function() {
    var p;

    p = this.getPoint();
    this.current = p;
    return p;
  };

  PathParser.prototype.getReflectedControlPoint = function() {
    var p;

    if (this.previousCommand.toLowerCase() !== "c" && this.previousCommand.toLowerCase() !== "s" && this.previousCommand.toLowerCase() !== "q" && this.previousCommand.toLowerCase() !== "t") {
      return this.current;
    }
    p = new Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
    return p;
  };

  PathParser.prototype.makeAbsolute = function(p) {
    if (this.isRelativeCommand()) {
      p.x += this.current.x;
      p.y += this.current.y;
    }
    return p;
  };

  PathParser.prototype.addMarker = function(p, from, priorTo) {
    if ((priorTo != null) && this.angles.length > 0 && (this.angles[this.angles.length - 1] == null)) {
      this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(priorTo);
    }
    return this.addMarkerAngle(p, (from == null ? null : from.angleTo(p)));
  };

  PathParser.prototype.addMarkerAngle = function(p, a) {
    this.points.push(p);
    this.angles.push(a);
  };

  PathParser.prototype.getMarkerPoints = function() {
    return this.points;
  };

  PathParser.prototype.getMarkerAngles = function() {
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

  return PathParser;

})();

path = (function(_super) {
  __extends(path, _super);

  function path(node) {
    var d;

    console.log('creating a path');
    path.__super__.constructor.call(this, node);
    console.log('created a PathElementBase');
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

  path.prototype.path = function(ctx) {
    var a1, ad, ah, bb, c, centp, cntrl, cp, cpp, curr, currp, dir, halfWay, l, largeArcFlag, m, newP, p, p1, pp, r, rx, ry, s, sweepFlag, sx, sy, u, v, xAxisRotation;

    pp = new PathParser(this.d);
    this.pp = pp;
    pp.reset();
    bb = new BoundingBox();
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
            newP = new Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
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
            newP = new Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
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
            currp = new Point(Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0, -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0);
            l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
            if (l > 1) {
              rx *= Math.sqrt(l);
              ry *= Math.sqrt(l);
            }
            s = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
            if (isNaN(s)) {
              s = 0;
            }
            cpp = new Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
            centp = new Point((curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
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
            halfWay = new Point(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah));
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

  path.prototype.getMarkers = function() {
    var angles, i, markers, points, _i, _ref1;

    points = this.pp.getMarkerPoints();
    angles = this.pp.getMarkerAngles();
    markers = [];
    for (i = _i = 0, _ref1 = points.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      markers.push([points[i], angles[i]]);
    }
    return markers;
  };

  return path;

})(PathElementBase);

glyph = (function(_super) {
  __extends(glyph, _super);

  function glyph(node) {
    glyph.__super__.constructor.call(this, node);
    this.horizAdvX = this.attribute("horiz-adv-x").numValue();
    this.unicode = this.attribute("unicode").value;
    this.arabicForm = this.attribute("arabic-form").value;
    return;
  }

  return glyph;

})(path);

missingglyph = (function(_super) {
  __extends(missingglyph, _super);

  function missingglyph(node) {
    missingglyph.__super__.constructor.call(this, node);
    this.horizAdvX = 0;
    return;
  }

  return missingglyph;

})(path);

polyline = (function(_super) {
  __extends(polyline, _super);

  function polyline(node) {
    polyline.__super__.constructor.call(this, node);
    this.points = Point.pointsArrayFromNumberArray(this.attribute("points").value);
  }

  polyline.prototype.path = function(ctx) {
    var bb, i, _i, _ref1;

    bb = new BoundingBox(this.points[0].x, this.points[0].y);
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

  polyline.prototype.getMarkers = function() {
    var i, markers, _i, _ref1;

    markers = [];
    for (i = _i = 0, _ref1 = this.points.length - 1; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      markers.push([this.points[i], this.points[i].angleTo(this.points[i + 1])]);
    }
    markers.push([this.points[this.points.length - 1], markers[markers.length - 1][1]]);
    return markers;
  };

  return polyline;

})(PathElementBase);

polygon = (function(_super) {
  __extends(polygon, _super);

  function polygon(node) {
    polygon.__super__.constructor.call(this, node);
  }

  polygon.prototype.path = function(ctx) {
    var bb;

    bb = polygon.__super__.path.call(this, ctx);
    if (ctx != null) {
      ctx.lineTo(this.points[0].x, this.points[0].y);
      ctx.closePath();
    }
    return bb;
  };

  return polygon;

})(polyline);

line = (function(_super) {
  __extends(line, _super);

  function line(node) {
    line.__super__.constructor.call(this, node);
  }

  line.prototype.getPoints = function() {
    return [new Point(this.attribute("x1").toPixels("x"), this.attribute("y1").toPixels("y")), new Point(this.attribute("x2").toPixels("x"), this.attribute("y2").toPixels("y"))];
  };

  line.prototype.path = function(ctx) {
    var points;

    points = this.getPoints();
    if (ctx != null) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
    }
    return new BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
  };

  line.prototype.getMarkers = function() {
    var points;

    points = this.getPoints();
    a = points[0].angleTo(points[1]);
    return [[points[0], a], [points[1], a]];
  };

  return line;

})(PathElementBase);

ellipse = (function(_super) {
  __extends(ellipse, _super);

  function ellipse(node) {
    ellipse.__super__.constructor.call(this, node);
  }

  ellipse.prototype.path = function(ctx) {
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
    return new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
  };

  return ellipse;

})(PathElementBase);

circle = (function(_super) {
  __extends(circle, _super);

  function circle(node) {
    circle.__super__.constructor.call(this, node);
  }

  circle.prototype.path = function(ctx) {
    var cx, cy, r;

    cx = this.attribute("cx").toPixels("x");
    cy = this.attribute("cy").toPixels("y");
    r = this.attribute("r").toPixels();
    if (ctx != null) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
      ctx.closePath();
    }
    return new BoundingBox(cx - r, cy - r, cx + r, cy + r);
  };

  return circle;

})(PathElementBase);

rect = (function(_super) {
  __extends(rect, _super);

  function rect(node) {
    rect.__super__.constructor.call(this, node);
  }

  rect.prototype.path = function(ctx) {
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
    return new BoundingBox(x, y, x + width, y + height);
  };

  return rect;

})(PathElementBase);

stop = (function(_super) {
  __extends(stop, _super);

  function stop(node) {
    var stopColor;

    stop.__super__.constructor.call(this, node);
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

  return stop;

})(ElementBase);

defs = (function(_super) {
  __extends(defs, _super);

  function defs(node) {
    defs.__super__.constructor.call(this, node);
  }

  defs.prototype.render = function(ctx) {};

  return defs;

})(ElementBase);

marker = (function(_super) {
  __extends(marker, _super);

  function marker(node) {
    marker.__super__.constructor.call(this, node);
  }

  marker.prototype.render = function(ctx, point, angle) {
    var tempSvg;

    ctx.translate(point.x, point.y);
    if (this.attribute("orient").valueOrDefault("auto") === "auto") {
      ctx.rotate(angle);
    }
    if (this.attribute("markerUnits").valueOrDefault("strokeWidth") === "strokeWidth") {
      ctx.scale(ctx.lineWidth, ctx.lineWidth);
    }
    ctx.save();
    tempSvg = new svg.Element.svg();
    tempSvg.attributes["viewBox"] = new Property("viewBox", this.attribute("viewBox").value);
    tempSvg.attributes["refX"] = new Property("refX", this.attribute("refX").value);
    tempSvg.attributes["refY"] = new Property("refY", this.attribute("refY").value);
    tempSvg.attributes["width"] = new Property("width", this.attribute("markerWidth").value);
    tempSvg.attributes["height"] = new Property("height", this.attribute("markerHeight").value);
    tempSvg.attributes["fill"] = new Property("fill", this.attribute("fill").valueOrDefault("black"));
    tempSvg.attributes["stroke"] = new Property("stroke", this.attribute("stroke").valueOrDefault("none"));
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

  return marker;

})(ElementBase);

pattern = (function(_super) {
  __extends(pattern, _super);

  function pattern(node) {
    pattern.__super__.constructor.call(this, node);
  }

  pattern.prototype.createPattern = function(ctx, element) {
    var c, cctx, height, tempSvg, width, x, y, _i, _j;

    width = this.attribute("width").toPixels("x", true);
    height = this.attribute("height").toPixels("y", true);
    tempSvg = new svg.Element.svg();
    tempSvg.attributes["viewBox"] = new Property("viewBox", this.attribute("viewBox").value);
    tempSvg.attributes["width"] = new Property("width", width + "px");
    tempSvg.attributes["height"] = new Property("height", height + "px");
    tempSvg.attributes["transform"] = new Property("transform", this.attribute("patternTransform").value);
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
    pattern = ctx.createPattern(c, "repeat");
    return pattern;
  };

  return pattern;

})(ElementBase);

feGaussianBlur = (function(_super) {
  __extends(feGaussianBlur, _super);

  function feGaussianBlur(node) {
    feGaussianBlur.__super__.constructor.call(this, node);
    this.blurRadius = Math.floor(this.attribute("stdDeviation").numValue());
    this.extraFilterDistance = this.blurRadius;
  }

  feGaussianBlur.prototype.apply = function(ctx, x, y, width, height) {
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

  return feGaussianBlur;

})(ElementBase);

AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
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
  refX = new Property("refX", refX);
  refY = new Property("refY", refY);
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

Transform = (function() {
  function Transform(v) {
    var data, i, s, transform, type, _i, _ref1;

    this.Type = {};
    this.Type.translate = translate;
    this.Type.rotate = rotate;
    this.Type.scale = scale;
    this.Type.matrix = matrix;
    this.Type.skewX = skewX;
    this.Type.skewY = skewY;
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

  Transform.prototype.apply = function(ctx) {
    var i, _i, _ref1;

    for (i = _i = 0, _ref1 = this.transforms.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.transforms[i].apply(ctx);
    }
  };

  Transform.prototype.applyToPoint = function(p) {
    var i, _i, _ref1;

    for (i = _i = 0, _ref1 = this.transforms.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      this.transforms[i].applyToPoint(p);
    }
  };

  return Transform;

})();

scale = (function() {
  function scale(s) {
    this.p = Point.pointsFromNumberArray(s);
  }

  scale.prototype.apply = function(ctx) {
    ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
  };

  scale.prototype.applyToPoint = function(p) {
    p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
  };

  return scale;

})();

matrix = (function() {
  function matrix(s) {
    this.m = svg.ToNumberArray(s);
  }

  matrix.prototype.apply = function(ctx) {
    ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
  };

  matrix.prototype.applyToPoint = function(p) {
    p.applyTransform(this.m);
  };

  return matrix;

})();

SkewBase = (function(_super) {
  __extends(SkewBase, _super);

  function SkewBase(s) {
    SkewBase.__super__.constructor.call(this, s);
    this.angle = new Property("angle", s);
    return;
  }

  return SkewBase;

})(matrix);

skewX = (function(_super) {
  __extends(skewX, _super);

  function skewX(s) {
    skewX.__super__.constructor.call(this, s);
    this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
    return;
  }

  return skewX;

})(SkewBase);

skewY = (function(_super) {
  __extends(skewY, _super);

  function skewY(s) {
    skewY.__super__.constructor.call(this, s);
    this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
    return;
  }

  return skewY;

})(SkewBase);

rotate = (function() {
  function rotate(s) {
    a = svg.ToNumberArray(s);
    this.angle = new Property("angle", a[0]);
    this.cx = a[1] || 0;
    this.cy = a[2] || 0;
  }

  rotate.prototype.apply = function(ctx) {
    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.angle.toRadians());
    ctx.translate(-this.cx, -this.cy);
  };

  rotate.prototype.applyToPoint = function(p) {
    a = this.angle.toRadians();
    p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
    p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
    p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
  };

  return rotate;

})();

translate = (function() {
  function translate(s) {
    this.p = Point.pointsFromNumberArray(s);
  }

  translate.prototype.apply = function(ctx) {
    ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
  };

  translate.prototype.applyToPoint = function(p) {
    p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
  };

  return translate;

})();

BoundingBox = (function() {
  BoundingBox.prototype.x1 = Number.NaN;

  BoundingBox.prototype.y1 = Number.NaN;

  BoundingBox.prototype.x2 = Number.NaN;

  BoundingBox.prototype.y2 = Number.NaN;

  function BoundingBox(x1, y1, x2, y2) {
    this.addPoint(x1, y1);
    this.addPoint(x2, y2);
    return;
  }

  BoundingBox.prototype.x = function() {
    return this.x1;
  };

  BoundingBox.prototype.y = function() {
    return this.y1;
  };

  BoundingBox.prototype.width = function() {
    return this.x2 - this.x1;
  };

  BoundingBox.prototype.height = function() {
    return this.y2 - this.y1;
  };

  BoundingBox.prototype.addPoint = function(x, y) {
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

  BoundingBox.prototype.addX = function(x) {
    return this.addPoint(x, null);
  };

  BoundingBox.prototype.addY = function(y) {
    return this.addPoint(null, y);
  };

  BoundingBox.prototype.addBoundingBox = function(bb) {
    this.addPoint(bb.x1, bb.y1);
    return this.addPoint(bb.x2, bb.y2);
  };

  BoundingBox.prototype.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
    var cp1x, cp1y, cp2x, cp2y;

    cp1x = p0x + 2 / 3 * (p1x - p0x);
    cp1y = p0y + 2 / 3 * (p1y - p0y);
    cp2x = cp1x + 1 / 3 * (p2x - p0x);
    cp2y = cp1y + 1 / 3 * (p2y - p0y);
    this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
  };

  BoundingBox.prototype.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
    var b, b2ac, c, f, i, p0, p1, p2, p3, t, t1, t2, _i;

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

  BoundingBox.prototype.isPointInBox = function(x, y) {
    return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
  };

  return BoundingBox;

})();

ViewPort = (function() {
  function ViewPort() {
    this.viewPorts = [];
  }

  ViewPort.prototype.Clear = function() {
    this.viewPorts = [];
  };

  ViewPort.prototype.SetCurrent = function(width, height) {
    this.viewPorts.push({
      width: width,
      height: height
    });
  };

  ViewPort.prototype.RemoveCurrent = function() {
    this.viewPorts.pop();
  };

  ViewPort.prototype.Current = function() {
    return this.viewPorts[this.viewPorts.length - 1];
  };

  ViewPort.prototype.width = function() {
    return this.Current().width;
  };

  ViewPort.prototype.height = function() {
    return this.Current().height;
  };

  ViewPort.prototype.ComputeSize = function(d) {
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

  return ViewPort;

})();

Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
    return;
  }

  Point.pointsFromNumberArray = function(s) {
    if (arguments.length === 1) {
      a = svg.ToNumberArray(s);
      return new Point(a[0], a[1]);
    }
  };

  Point.pointsArrayFromNumberArray = function(s) {
    var i, _i, _ref1;

    a = svg.ToNumberArray(s);
    path = [];
    for (i = _i = 0, _ref1 = a.length; _i < _ref1; i = _i += 2) {
      path.push(new Point(a[i], a[i + 1]));
    }
    return path;
  };

  Point.prototype.angleTo = function(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  };

  Point.prototype.applyTransform = function(v) {
    var xp, yp;

    xp = this.x * v[0] + this.y * v[2] + v[4];
    yp = this.x * v[1] + this.y * v[3] + v[5];
    this.x = xp;
    this.y = yp;
  };

  return Point;

})();

Font = (function() {
  function Font() {
    this.Parse = __bind(this.Parse, this);
  }

  Font.prototype.Styles = "normal|italic|oblique|inherit";

  Font.prototype.Variants = "normal|small-caps|inherit";

  Font.prototype.Weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";

  Font.prototype.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
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

  Font.prototype.Parse = function(s) {
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

  return Font;

})();

Property = (function() {
  function Property(name, value) {
    this.name = name;
    this.value = value;
  }

  Property.prototype.getValue = function() {
    return this.value;
  };

  Property.prototype.hasValue = function() {
    return (this.value != null) && this.value !== "";
  };

  Property.prototype.numValue = function() {
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

  Property.prototype.valueOrDefault = function(def) {
    if (this.hasValue()) {
      return this.value;
    }
    return def;
  };

  Property.prototype.numValueOrDefault = function(def) {
    if (this.hasValue()) {
      return this.numValue();
    }
    return def;
  };

  Property.prototype.addOpacity = function(opacity) {
    var color, newValue;

    newValue = this.value;
    if ((opacity != null) && opacity !== "" && typeof this.value === "string") {
      color = new RGBColor(this.value);
      if (color.ok) {
        newValue = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + opacity + ")";
      }
    }
    return new Property(this.name, newValue);
  };

  Property.prototype.getDefinition = function() {
    var name;

    name = this.value.match(/#([^\)']+)/);
    if (name) {
      name = name[1];
    }
    if (!name) {
      name = this.value;
    }
    return svg.Definitions[name];
  };

  Property.prototype.isUrlDefinition = function() {
    return this.value.indexOf("url(") === 0;
  };

  Property.prototype.getFillStyleDefinition = function(e, opacityProp) {
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

  Property.prototype.getDPI = function(viewPort) {
    return 96.0;
  };

  Property.prototype.getEM = function(viewPort) {
    var em, fontSize;

    em = 12;
    fontSize = new Property("fontSize", svg.Font.Parse(svg.ctx.font).fontSize);
    if (fontSize.hasValue()) {
      em = fontSize.toPixels(viewPort);
    }
    return em;
  };

  Property.prototype.getUnits = function() {
    var s;

    s = this.value + "";
    return s.replace(/[0-9\.\-]/g, "");
  };

  Property.prototype.toPixels = function(viewPort, processPercent) {
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

  Property.prototype.toMilliseconds = function() {
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

  Property.prototype.toRadians = function() {
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

  return Property;

})();

/*
A class to parse color values
@author Stoyan Stefanov <sstoo@gmail.com>
@link   http://www.phpied.com/rgb-color-parser-in-javascript/
@license Use it if you like it
*/


RGBColor = function(color_string) {
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
      example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
      process: function(bits) {
        return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
      }
    }, {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      example: ["#00ff00", "336699"],
      process: function(bits) {
        return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
      }
    }, {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      example: ["#fb0", "f0f"],
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
  this.toHex = function() {
    var b, r;

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
  return this.getHelpXML = function() {
    var example, example_div, examples, i, j, list_color, list_item, list_item_value, sc, xml, _j, _k, _l, _len1, _len2, _len3;

    examples = new Array();
    for (_j = 0, _len1 = color_defs.length; _j < _len1; _j++) {
      color_def = color_defs[_j];
      example = color_def.example;
      for (_k = 0, _len2 = example.length; _k < _len2; _k++) {
        j = example[_k];
        examples[examples.length] = j;
      }
    }
    for (sc in simple_colors) {
      examples[examples.length] = sc;
    }
    xml = document.createElement("ul");
    xml.setAttribute("id", "rgbcolor-examples");
    for (_l = 0, _len3 = examples.length; _l < _len3; _l++) {
      i = examples[_l];
      try {
        list_item = document.createElement("li");
        list_color = new RGBColor(i);
        example_div = document.createElement("div");
        example_div.style.cssText = "margin: 3px; " + "border: 1px solid black; " + "background:" + list_color.toHex() + "; " + "color:" + list_color.toHex();
        example_div.appendChild(document.createTextNode("test"));
        list_item_value = document.createTextNode(" " + i + " -> " + list_color.toRGB() + " -> " + list_color.toHex());
        list_item.appendChild(example_div);
        list_item.appendChild(list_item_value);
        xml.appendChild(list_item);
      } catch (_error) {}
    }
    return xml;
  };
};

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
  if (typeof target === "string") {
    target = document.getElementById(target);
  }
  if (target.svg != null) {
    target.svg.stop();
  }
  svg = new svgClass;
  if (!(target.childNodes.length === 1 && target.childNodes[0].nodeName === "OBJECT")) {
    target.svg = svg;
  }
  svg.opts = opts;
  ctx = target.getContext("2d");
  if (typeof s.documentElement !== "undefined") {
    return svg.loadXmlDoc(ctx, s);
  } else if (s.substr(0, 1) === "<") {
    return svg.loadXml(ctx, s);
  } else {
    return svg.load(ctx, s);
  }
};

svgClass = (function() {
  var constructor;

  function svgClass() {}

  svgClass.uniqueId = 0;

  constructor = function() {
    this.FRAMERATE = 30;
    return this.MAX_VIRTUAL_PIXELS = 30000;
  };

  svgClass.prototype.UniqueId = function() {
    this.constructor.uniqueId++;
    return "canvg" + this.constructor.uniqueId;
  };

  svgClass.prototype.init = function(ctx) {
    this.Definitions = {};
    this.Styles = {};
    this.Animations = [];
    this.Images = [];
    this.ctx = ctx;
    this.ViewPort = new ViewPort;
    this.Transform = Transform;
    this.Font = new Font;
    this.AspectRatio = AspectRatio;
    this.Element = {};
    this.EmptyProperty = new Property("EMPTY", "");
    this.Element.svg = svgElement;
    this.Element.rect = rect;
    this.Element.circle = circle;
    this.Element.ellipse = ellipse;
    this.Element.line = line;
    this.Element.polyline = polyline;
    this.Element.polygon = polygon;
    this.Element.path = path;
    this.Element.pattern = pattern;
    this.Element.marker = marker;
    this.Element.defs = defs;
    this.Element.GradientBase = GradientBase;
    this.Element.linearGradient = linearGradient;
    this.Element.radialGradient = radialGradient;
    this.Element.stop = stop;
    this.Element.AnimateBase = AnimateBase;
    this.Element.animate = animate;
    this.Element.animateColor = animateColor;
    this.Element.animateTransform = animateTransform;
    this.Element.font = font;
    this.Element.fontface = fontface;
    this.Element.missingglyph = missingglyph;
    this.Element.glyph = glyph;
    this.Element.text = text;
    this.Element.TextElementBase = TextElementBase;
    this.Element.tspan = tspan;
    this.Element.tref = tref;
    this.Element.a = a;
    this.Element.image = image;
    this.Element.g = g;
    this.Element.symbol = symbol;
    this.Element.style = ElementBaseStyle;
    this.Element.use = use;
    this.Element.mask = mask;
    this.Element.clipPath = clipPath;
    this.Element.filter = filter;
    this.Element.feMorphology = feMorphology;
    this.Element.feColorMatrix = feColorMatrix;
    this.Element.feGaussianBlur = feGaussianBlur;
    this.Element.MISSING = MISSING;
    this.Element.title = title;
    this.Element.desc = desc;
    this.Mouse = new Mouse;
  };

  svgClass.prototype.ImagesLoaded = function() {
    var svgImage, _i, _len, _ref1;

    _ref1 = this.Images;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      svgImage = _ref1[_i];
      if (!svgImage.loaded) {
        return false;
      }
    }
    return true;
  };

  svgClass.prototype.trim = function(s) {
    return s.replace(/^\s+|\s+$/g, "");
  };

  svgClass.prototype.compressSpaces = function(s) {
    return s.replace(/[\s\r\t\n]+/g, " ");
  };

  svgClass.prototype.ajax = function(url) {
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

  svgClass.prototype.parseXml = function(xml) {
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

  svgClass.prototype.ToNumberArray = function(s) {
    var i, _i, _ref1;

    a = this.trim(this.compressSpaces((s || "").replace(/,/g, " "))).split(" ");
    for (i = _i = 0, _ref1 = a.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      a[i] = parseFloat(a[i]);
    }
    return a;
  };

  svgClass.prototype.CreateElement = function(node) {
    var className, e;

    className = node.nodeName.replace(/^[^:]+:/, "");
    className = className.replace(/\-/g, "");
    e = null;
    if (className === "title" || className === "desc" || className === "MISSING") {
      return null;
    }
    if (typeof this.Element[className] !== "undefined") {
      console.log('attempting to create a ' + className);
      e = new this.Element[className](node);
    } else {
      e = new this.Element.MISSING(node);
    }
    e.type = node.nodeName;
    return e;
  };

  svgClass.prototype.load = function(ctx, url) {
    return this.loadXml(ctx, this.ajax(url));
  };

  svgClass.prototype.loadXml = function(ctx, xml) {
    return this.loadXmlDoc(ctx, this.parseXml(xml));
  };

  svgClass.prototype.stop = function() {
    if (this.intervalID) {
      return clearInterval(this.intervalID);
    }
  };

  svgClass.prototype.mapXY = function(p, ctx) {
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

  svgClass.prototype.draw = function() {
    var cHeight, cWidth, ctx, e, isFirstRender, viewBox, xRatio, yRatio;

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
    if (isFirstRender) {
      isFirstRender = false;
      if (typeof this.opts["renderCallback"] === "function") {
        return this.opts["renderCallback"]();
      }
    }
  };

  svgClass.prototype.loadXmlDoc = function(ctx, dom) {
    var e, isFirstRender, waitingForImages;

    this.init(ctx);
    if (this.opts["ignoreMouse"] !== true) {
      ctx.canvas.onclick = function(e) {
        var p;

        p = this.mapXY(new Point((e != null ? e.clientX : event.clientX), (e != null ? e.clientY : event.clientY)), ctx);
        return this.Mouse.onclick(p.x, p.y);
      };
      ctx.canvas.onmousemove = function(e) {
        var p;

        p = this.mapXY(new Point((e != null ? e.clientX : event.clientX), (e != null ? e.clientY : event.clientY)), ctx);
        return this.Mouse.onmousemove(p.x, p.y);
      };
    }
    e = this.CreateElement(dom.documentElement);
    console.log("*** svgCreateElement from dom: " + dom.documentElement);
    e.root = true;
    isFirstRender = true;
    console.log('assigning @ctxFromLoadXMLDoc');
    this.ctxFromLoadXMLDoc = ctx;
    this.eFromLoadXMLDoc = e;
    waitingForImages = true;
    if (this.ImagesLoaded()) {
      waitingForImages = false;
      this.draw();
    }
    return this.intervalID = setInterval(function() {
      var i, needUpdate, _i, _ref1;

      needUpdate = false;
      if (waitingForImages && this.ImagesLoaded()) {
        waitingForImages = false;
        needUpdate = true;
      }
      if (this.opts["ignoreMouse"] !== true) {
        needUpdate = needUpdate | this.Mouse.hasEvents();
      }
      if (this.opts["ignoreAnimation"] !== true) {
        for (i = _i = 0, _ref1 = this.Animations.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          needUpdate = needUpdate | this.Animations[i].update(1000 / this.FRAMERATE);
        }
      }
      if (typeof this.opts["forceRedraw"] === "function" ? this.opts["forceRedraw"]() === true : void 0) {
        needUpdate = true;
      }
      if (needUpdate) {
        this.draw();
        return this.Mouse.runEvents();
      }
    }, 1000 / this.FRAMERATE);
  };

  return svgClass;

})();

if (CanvasRenderingContext2D) {
  CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
    return canvg(this.canvas, s, {
      ignoreMouse: true,
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
