# canvg.js - Coffeescript SVG parser and renderer on Canvas
# MIT Licensed 
# Davide Della Casa (davidedc@gmail.com)
# [put here link to github]

# original Javascript code by:
# Gabe Lerner (gabelerner@gmail.com)
#   http://code.google.com/p/canvg/
# and subsequently:
#   https://github.com/gabelerner/canvg

# canvg(target, s)
# empty parameters: replace all 'svg' elements on page with 'canvas' elements
# target: canvas element or the id of a canvas element
# s: svg string, url to svg file, or xml document
# opts: optional hash of options
#     ignoreMouse: true => ignore mouse events
#     ignoreAnimation: true => ignore animations
#     ignoreDimensions: true => does not try to resize canvas
#     ignoreClear: true => does not clear canvas
#     offsetX: int => draws at a x offset
#     offsetY: int => draws at a y offset
#     scaleWidth: int => scales horizontally to width
#     scaleHeight: int => scales vertically to height
#     renderCallback: function => will call the function after the first render is completed
#     forceRedraw: function => will call the function on every frame, if it returns true, will redraw

svg = undefined

canvg = (target, s, opts) ->
  # no parametrs, means that all the svg tags
  # are turned into canvases
  if not target? and not s? and not opts?
    svgTags = document.querySelectorAll("svg")
    for eachTag in svgTags
      svgTag = eachTag
      c = document.createElement("canvas")
      c.width = svgTag.clientWidth
      c.height = svgTag.clientHeight
      svgTag.parentNode.insertBefore c, svgTag
      svgTag.parentNode.removeChild svgTag
      div = document.createElement("div")
      div.appendChild svgTag
      canvg c, div.innerHTML
    return
  opts = opts or {}
  console.log 'initialed opts to: ' + opts 
  target = document.getElementById(target)  if typeof target == "string"
  
  # store class on canvas
  target.svg.stop()  if target.svg?
  
  console.log 'about to create svg and opts is: ' + opts         
  svg = new svSVGgContainerElement opts
  console.log 'just created svg and opts is: ' + svg.opts         
  target.svg = svg
  ctx = target.getContext("2d")

  unless typeof (s.documentElement) == "undefined"
    console.log 'about to call loadXmlDoc and opts is: ' + svg.opts 
    # load from xml doc
    svg.loadXmlDoc ctx, s, target
  else if s.substr(0, 1) == "<"
    console.log 'about to call loadXml and opts is: ' + svg.opts     
    # load from xml string
    svg.loadXml ctx, s, target
  else
    console.log 'about to call load and opts is: ' + svg.opts         
    # load from url
    svg.load ctx, s, target

class svSVGgContainerElement
  @uniqueId: 0
  isFirstRender: true

  constructor: (@opts)->
    @FRAMERATE = 30
    @MAX_VIRTUAL_PIXELS = 30000
    console.log 'constructing svg and opts is: ' + @opts

  UniqueId: ->
    @constructor.uniqueId++
    "canvg" + @constructor.uniqueId

  # globals
  init: (ctx) ->

    @Definitions = {}
    @Styles = {}
    @Animations = []
    @Images = []
    @ctx = ctx
    @ViewPort = new SVGViewPort


    # fonts
    @Font = new SVGFont


    # elements
    @Element = {}
    @EmptyProperty = new SVGProperty("EMPTY", "")


    # Elements. Each element has its
    # own class. The reason they are kept
    # in this structure is that we create the
    # objects dynamically by doing a
    #   new @Element[elementname]
    # later on.

    @Element.svg = SVGElement
    @Element.rect = SVGrectGraphicsElement
    @Element.circle = SVGcircleGraphicsElement
    @Element.ellipse = SVGellipseGraphicsElement
    @Element.line = SVGlineGraphicsElement
    @Element.polyline = SVGpolylineGraphicsElement
    @Element.polygon = SVGpolygonGraphicsElement
    @Element.path = SVGpathGraphicsElement
    @Element.pattern = SVGpatternContainerElement
    @Element.marker = SVGmarkerContainerElement
    @Element.defs = SVGdefsContainerElement
    @Element.linearGradient = SVGlinearGradientGradientElement
    @Element.radialGradient = SVGradialGradientGradientElement
    @Element.stop = SVGStopElement
    @Element.animate = SVGanimateAnimationElement
    @Element.animateColor = SVGanimateColorAnimationElement
    @Element.animateTransform = SVGanimateTransformAnimationElement
    @Element.font = SVGfontElement
    @Element.fontface = SVGfontfaceElement
    @Element.missingglyph = SVGmissingglyphContainerElement
    @Element.glyph = SVGglyphContainerElement
    @Element.text = SVGtextTextContentElement
    @Element.tspan = SVGtspanTextContentElement
    @Element.tref = SVGtrefTextContentElement
    @Element.a = SVGaContainerElement
    @Element.image = SVGimageGraphicsElement
    @Element.g = SVGgContainerElement
    @Element.symbol = SVGsymbolStructuralElement
    @Element.style = SVGElementStyle
    @Element.use = SVGuseGraphicsElement
    @Element.mask = SVGmaskContainerElement
    @Element.clipPath = SVGclipPathElement
    @Element.filter = SVGfilterElement
    @Element.feMorphology = SVGfeMorphologyFilterPrimitiveElement
    @Element.feComposite = SVGfeCompositeFilterPrimitiveElement
    @Element.feColorMatrix = SVGfeColorMatrixFilterPrimitiveElement
    @Element.feGaussianBlur = SVGfeGaussianBlurFilterPrimitiveElement
    @Element.title = SVGtitleDescriptiveElement
    @Element.desc = SVGdescDescriptiveElement
    @SVGMouse = new SVGMouse
    return

  AspectRatio: (ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) ->
    # aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
    aspectRatio = svg.compressSpaces(aspectRatio)
    aspectRatio = aspectRatio.replace(/^defer\s/, "") # ignore defer
    align = aspectRatio.split(" ")[0] or "xMidYMid"
    meetOrSlice = aspectRatio.split(" ")[1] or "meet"
    
    # calculate scale
    scaleX = width / desiredWidth
    scaleY = height / desiredHeight
    scaleMin = Math.min(scaleX, scaleY)
    scaleMax = Math.max(scaleX, scaleY)

    if meetOrSlice == "meet"
      desiredWidth *= scaleMin
      desiredHeight *= scaleMin
    if meetOrSlice == "slice"
      desiredWidth *= scaleMax
      desiredHeight *= scaleMax
    refX = new SVGProperty("refX", refX)
    refY = new SVGProperty("refY", refY)

    # translate
    if refX.hasValue() and refY.hasValue()
      ctx.translate -scaleMin * refX.toPixels("x"), -scaleMin * refY.toPixels("y")
    else      
      # align
      ctx.translate width / 2.0 - desiredWidth / 2.0, 0  if align.match(/^xMid/) and ((meetOrSlice == "meet" and scaleMin is scaleY) or (meetOrSlice == "slice" and scaleMax is scaleY))
      ctx.translate 0, height / 2.0 - desiredHeight / 2.0  if align.match(/YMid$/) and ((meetOrSlice == "meet" and scaleMin is scaleX) or (meetOrSlice == "slice" and scaleMax is scaleX))
      ctx.translate width - desiredWidth, 0  if align.match(/^xMax/) and ((meetOrSlice == "meet" and scaleMin is scaleY) or (meetOrSlice == "slice" and scaleMax is scaleY))
      ctx.translate 0, height - desiredHeight  if align.match(/YMax$/) and ((meetOrSlice == "meet" and scaleMin is scaleX) or (meetOrSlice == "slice" and scaleMax is scaleX))
    
    # scale
    if align == "none"
      ctx.scale scaleX, scaleY
    else if meetOrSlice == "meet"
      ctx.scale scaleMin, scaleMin
    else ctx.scale scaleMax, scaleMax  if meetOrSlice == "slice"
    
    # translate
    ctx.translate (if not minX? then 0 else -minX), (if not minY? then 0 else -minY)
    return

  # images loaded
  ImagesLoaded: ->
    for svgImage in @Images
      return false  unless svgImage.loaded
    true


  # trim
  trim: (s) ->
    s.replace /^\s+|\s+$/g, ""


  # compress spaces
  compressSpaces: (s) ->
    s.replace /[\s\r\t\n]+/g, " "


  # ajax
  ajax: (url) ->
    AJAX = undefined
    if window.XMLHttpRequest
      AJAX = new XMLHttpRequest()
    else
      AJAX = new ActiveXObject("Microsoft.XMLHTTP")
    if AJAX
      AJAX.open "GET", url, false
      AJAX.send null
      return AJAX.responseText
    null


  # parse xml
  parseXml: (xml) ->
    if window.DOMParser
      parser = new DOMParser()
      parser.parseFromString xml, "text/xml"
    else
      xml = xml.replace(/<!DOCTYPE svg[^>]*>/, "")
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
      xmlDoc.async = "false"
      xmlDoc.loadXML xml
      xmlDoc


  # points and paths
  ToNumberArray: (s) ->
    a = @trim(@compressSpaces((s or "").replace(/,/g, " "))).split(" ")
    result = (parseFloat(item) for item in a)


  # element factory
  CreateElement: (node) ->
    className = node.nodeName.replace(/^[^:]+:/, "") # remove namespace
    # remove dashes so for example the font-face element
    # becomes fontface
    className = className.replace(/\-/g, "")
    e = null
    unless typeof (@Element[className]) == "undefined"
      #console.log 'attempting to create a ' + className
      e = new @Element[className](node)
    else
      e = new SVGmissingElement(node)
    e.type = node.nodeName
    return e


  # load from url
  load: (ctx, url, target) ->
    @loadXml ctx, @ajax(url), target


  # load from xml
  loadXml: (ctx, xml, target) ->
    @loadXmlDoc ctx, @parseXml(xml), target

  stop: ->
    console.log ">>>>>> stopping interval"
    clearInterval @intervalID  if @intervalID

  mapXY: (p, ctx) ->
    e = ctx.canvas
    while e
      p.x -= e.offsetLeft
      p.y -= e.offsetTop
      e = e.offsetParent
    p.x += window.scrollX  if window.scrollX
    p.y += window.scrollY  if window.scrollY
    p

  draw: (dom)->
    debugger
    console.log "start of draw() function"
    ctx = @ctxFromLoadXMLDoc
    e = @eFromLoadXMLDoc

    @ViewPort.Clear()
    @ViewPort.SetCurrent ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight  if ctx.canvas.parentNode
    unless @opts["ignoreDimensions"] is true
      
      # set canvas size
      console.log "setting the canvas size\n"
      if e.style("width").hasValue()
        ctx.canvas.width = e.style("width").toPixels("x")
        ctx.canvas.style.width = ctx.canvas.width + "px"
        console.log "ctx.canvas.width" + ctx.canvas.width + "px"
      if e.style("height").hasValue()
        ctx.canvas.height = e.style("height").toPixels("y")
        ctx.canvas.style.height = ctx.canvas.height + "px"
        console.log "ctx.canvas.height" + ctx.canvas.height + "px"
    cWidth = ctx.canvas.clientWidth or ctx.canvas.width
    cHeight = ctx.canvas.clientHeight or ctx.canvas.height
    if @opts["ignoreDimensions"] is true and e.style("width").hasValue() and e.style("height").hasValue()
      cWidth = e.style("width").toPixels("x")
      cHeight = e.style("height").toPixels("y")
    @ViewPort.SetCurrent cWidth, cHeight
    e.attribute("x", true).value = @opts["offsetX"]  if @opts["offsetX"]?
    e.attribute("y", true).value = @opts["offsetY"]  if @opts["offsetY"]?


    # from commit 08ee5692a08281c1e3626ed2281cf1742e16000d
    if svg.opts['scaleWidth'] != null or svg.opts['scaleHeight'] != null
      xRatio = null
      yRatio = null
      viewBox = svg.ToNumberArray(e.attribute('viewBox').value)
      if svg.opts['scaleWidth']?
        if e.attribute('width').hasValue()
          xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth']
        else if !isNaN(viewBox[2])
          xRatio = viewBox[2] / svg.opts['scaleWidth']
      if svg.opts['scaleHeight']?
        if e.attribute('height').hasValue()
          yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight']
        else if !isNaN(viewBox[3])
          yRatio = viewBox[3] / svg.opts['scaleHeight']
      if xRatio == null
        xRatio = yRatio
      if yRatio == null
        yRatio = xRatio

      e.attribute("width", true).value = @opts["scaleWidth"]
      e.attribute("height", true).value = @opts["scaleHeight"]
      # from commit 0f568d4506657a93753a3f674467597e5b45ffbc here
      e.attribute('transform', true).value += ' scale('+(1.0/xRatio)+','+(1.0/yRatio)+')'
    
    console.log "xRatio: " + xRatio
    console.log "yRatio: " + yRatio
    # clear and render
    unless @opts["ignoreClear"]
      ctx.clearRect 0, 0, cWidth, cHeight
      console.log "clearing: " + cWidth + " " + cHeight
    e.render ctx
    if @isFirstRender
      @isFirstRender = false
      if typeof (@opts["renderCallback"]) == "function"
        @opts["renderCallback"](dom)



  loadXmlDoc: (ctx, dom, target) ->
    @init ctx

    # bind mouse
    console.log "opts: " + @opts
    console.log "opts ignoreSVGMouse: " + @opts["ignoreSVGMouse"]
    unless @opts["ignoreSVGMouse"] is true
      ctx.canvas.onclick = (e) =>
        p = @mapXY(new SVGPoint((if e? then e.clientX else event.clientX), (if e? then e.clientY else event.clientY)), ctx)
        @SVGMouse.onclick p.x, p.y

      ctx.canvas.onmousemove = (e) =>
        p = @mapXY(new SVGPoint((if e? then e.clientX else event.clientX), (if e? then e.clientY else event.clientY)), ctx)
        @SVGMouse.onmousemove p.x, p.y

    e = @CreateElement(dom.documentElement)
    console.log "*** svgCreateElement from dom: " + dom.documentElement
    #alert  "svgCreateElement from dom"
    e.root = true
    
    console.log 'assigning @ctxFromLoadXMLDoc'
    @ctxFromLoadXMLDoc = ctx
    @eFromLoadXMLDoc = e

    #svgWidth = parseInt(e.attributes.width.value.replace("px",""))
    #svgHeight = parseInt(e.attributes.height.value.replace("px",""))
    #@AspectRatio ctx, 1, svgWidth, target.width, svgHeight, target.height

    
    waitingForImages = true
    if @ImagesLoaded()
      waitingForImages = false
      @draw(dom)

    console.log ">>>>>> starting interval with fps: " + @FRAMERATE
    @intervalID = setInterval(=>
      needUpdate = false
      if waitingForImages and @ImagesLoaded()
        waitingForImages = false
        needUpdate = true
      
      # need update from mouse events?
      needUpdate = needUpdate | @SVGMouse.hasEvents()  unless @opts["ignoreSVGMouse"] is true
      
      # need update from animations?
      unless @opts["ignoreAnimation"] is true
        for animation in @Animations
          needUpdate = needUpdate | animation.update(1000 / @FRAMERATE)
      
      # need update from redraw?
      needUpdate = true  if @opts["forceRedraw"]() is true  if typeof (@opts["forceRedraw"]) == "function"
      
      # render if needed
      if needUpdate
        @draw()
        @SVGMouse.runEvents() # run and clear our events
    , 1000 / @FRAMERATE)

# Adds a "drawSvg" method to the Canvas
# context prototype.
if CanvasRenderingContext2D
  CanvasRenderingContext2D::drawSvg = (s, dx, dy, dw, dh) ->
    canvg @canvas, s,
      ignoreSVGMouse: true
      ignoreAnimation: true
      ignoreDimensions: true
      ignoreClear: true
      offsetX: dx
      offsetY: dy
      scaleWidth: dw
      scaleHeight: dh

class SVGMouse

  constructor: ->
    @events = []
    @eventElements = []

  hasEvents: ->
    @events.length isnt 0

  onclick: (x, y) ->
    @events.push
      type: "onclick"
      x: x
      y: y
      run: (e) ->
        e.onclick()  if e.onclick


  onmousemove: (x, y) ->
    @events.push
      type: "onmouseove"
      x: x
      y: y
      run: (e) ->
        e.onmousemove()  if e.onmousemove


  checkPath: (element, ctx) ->
    for i in [0...@events.length]
      e = @events[i]
      @eventElements[i] = element  if ctx.isPointInPath and ctx.isPointInPath(e.x, e.y)

  checkBoundingBox: (element, bb) ->

    for i in [0...@events.length]
      e = @events[i]
      @eventElements[i] = element  if bb.isPointInBox(e.x, e.y)

  runEvents: ->
    svg.ctx.canvas.style.cursor = ""

    for i in [0...@events.length]
      e = @events[i]
      element = @eventElements[i]
      while element
        e.run element
        element = element.parent
    
    # done running, clear
    @events = []
    @eventElements = []

class SVGElement

  constructor: (node) ->
    @attributes = {}
    @styles = {}
    @children = []

    # nodeType is a DOM nomenclature:
    # 1 ELEMENT_NODE
    # 2 ATTRIBUTE_NODE
    # 3 TEXT_NODE
    # (see http://www.javascriptkit.com/domref/nodetype.shtml
    #  for the other 9 types)
    if node? and node.nodeType is 1 #ELEMENT_NODE
      # add children
      #alert 'adding child ' + node.nodeType
      for childNode in node.childNodes
        if childNode.nodeType is 1 #ELEMENT_NODE
          @addChild childNode, true
        if @captureTextNodes and childNode.nodeType == 3
          text = childNode.nodeValue or childNode.text or ''
          if svg.trim(svg.compressSpaces(text)) != ''
            @addChild (new SVGtspanTextContentElement(childNode)), false
            # TEXT_NODE

      
      # add attributes
      for attribute in node.attributes
        @attributes[attribute.nodeName] = new SVGProperty(attribute.nodeName, attribute.nodeValue)
      
      # add tag styles
      styles = svg.Styles[node.nodeName]
      if styles?
        for name of styles
          @styles[name] = styles[name]
      
      # add class styles
      if @attribute("class").hasValue()
        classes = svg.compressSpaces(@attribute("class").value).split(" ")
        for j in [0...classes.length]
          styles = svg.Styles["." + classes[j]]
          if styles?
            for name of styles
              @styles[name] = styles[name]
          styles = svg.Styles[node.nodeName + "." + classes[j]]
          if styles?
            for name of styles
              @styles[name] = styles[name]
      
      # add id styles
      if @attribute("id").hasValue()
        styles = svg.Styles["#" + @attribute("id").value]
        if styles?
          for name of styles
            @styles[name] = styles[name]
      
      # add inline styles
      if @attribute("style").hasValue()
        styles = @attribute("style").value.split(";")
        for i in [0...styles.length]
          unless svg.trim(styles[i]) == ""
            style = styles[i].split(":")
            name = svg.trim(style[0])
            value = svg.trim(style[1])
            @styles[name] = new SVGProperty(name, value)

      
      # add id
      svg.Definitions[@attribute("id").value] = this  unless svg.Definitions[@attribute("id").value]?  if @attribute("id").hasValue()
    return  

  # get or create attribute
  attribute: (name, createIfNotExists) ->
    a = @attributes[name]
    return a  if a?
    if createIfNotExists is true
      a = new SVGProperty(name, "")
      @attributes[name] = a
    a or svg.EmptyProperty

  getHrefAttribute: ->
    for a of @attributes
      return @attributes[a]  if a.match(/:href$/)
    svg.EmptyProperty

  
  # get or create style, crawls up node tree
  style: (name, createIfNotExists) ->
    #console.log "name, createIfNotExists " + name + " " + createIfNotExists
    #console.log "@styles " + @styles + " class name: " + this.constructor.name
    if @styles == undefined then console.trace()
    s = @styles[name]
    return s  if s?
    a = @attribute(name)
    if a? and a.hasValue()
      @styles[name] = a # move up to me to cache
      return a
    p = @parent
    if p?
      ps = p.style(name)
      return ps  if ps? and ps.hasValue()
    if createIfNotExists is true
      s = new SVGProperty(name, "")
      @styles[name] = s
    s or svg.EmptyProperty

  
  # base render
  render: (ctx) ->
    
    # don't render display=none
    if @style("display").value == "none"
      return  
    
    # don't render visibility=hidden
    if @style("visibility").value == "hidden"
      return
    ctx.save()
    if @attribute("mask").hasValue() # mask
      mask = @attribute("mask").getDefinition()
      if mask?
        mask.apply ctx, this  
    else if @style("filter").hasValue() # filter
      filter = @style("filter").getDefinition()
      if filter?
        filter.apply ctx, this  
    else
      @setContext ctx
      @renderChildren ctx
      @clearContext ctx
    ctx.restore()

  
  # base set context
  setContext: (ctx) ->

  
  # OVERRIDE ME!
  
  # base clear context
  clearContext: (ctx) ->

  
  # OVERRIDE ME!
  
  # base render children
  renderChildren: (ctx) ->
    for child in @children
      child.render ctx
    return

  addChild: (childNode, create) ->
    #console.log "addchild childNode: " + childNode
    #console.log "typeof: " + typeof(childNode)
    child = childNode
    child = svg.CreateElement(childNode)  if create
    if child is null then return
    child.parent = this
    @children.push child


class SVGtitleDescriptiveElement extends SVGElement
  constructor: (node) ->
    super node

class SVGdescDescriptiveElement extends SVGElement
  constructor: (node) ->
    super node

class SVGmissingElement extends SVGElement
  constructor: (node) ->
    super node
    console.log "ERROR: Element '" + node.nodeName + "' not yet implemented."  if console



class SVGfeColorMatrixFilterPrimitiveElement extends SVGElement
  constructor: (node) ->
    super node
    @matrix = svg.ToNumberArray(@attribute('values').value)
    switch @attribute('type').valueOrDefault('matrix')
      # http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      when 'saturate'
        s = @matrix[0]
        @matrix = [0.213 + 0.787 * s, 0.715 - (0.715 * s), 0.072 - (0.072 * s), 0, 0, 0.213 - (0.213 * s), 0.715 + 0.285 * s, 0.072 - (0.072 * s), 0, 0, 0.213 - (0.213 * s), 0.715 - (0.715 * s), 0.072 + 0.928 * s, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
      when 'hueRotate'
        a = @matrix[0] * Math.PI / 180.0
        c = (m1, m2, m3) ->
          m1 + Math.cos(a) * m2 + Math.sin(a) * m3
        @matrix = [c(0.213, 0.787, -0.213), c(0.715, -0.715, -0.715), c(0.072, -0.072, 0.928), 0, 0, c(0.213, -0.213, 0.143), c(0.715, 0.285, 0.140), c(0.072, -0.072, -0.283), 0, 0, c(0.213, -0.213, -0.787), c(0.715, -0.715, 0.715), c(0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
      when 'luminanceToAlpha'
        @matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];


  imGet: (img, x, y, width, height, rgba) ->
    img[y * width * 4 + x * 4 + rgba]
  imSet: (img, x, y, width, height, rgba, val) ->
    img[y * width * 4 + x * 4 + rgba] = val

  apply: (ctx, x, y, width, height) ->    
    # assuming x==0 && y==0 for now
    srcData = ctx.getImageData(0, 0, width, height)

    m = (i, v) =>
      mi = @matrix[i]
      return mi * (if mi < 0 then v - 255 else v)

    for y in [0...height]
      for x in [0...width]
        r = @imGet(srcData.data, x, y, width, height, 0)
        g = @imGet(srcData.data, x, y, width, height, 1)
        b = @imGet(srcData.data, x, y, width, height, 2)
        a = @imGet(srcData.data, x, y, width, height, 3)

        @imSet srcData.data, x, y, width, height, 0, m(0, r) + m(1, g) + m(2, b) + m(3, a) + m(4, 1)
        @imSet srcData.data, x, y, width, height, 1, m(5, r) + m(6, g) + m(7, b) + m(8, a) + m(9, 1)
        @imSet srcData.data, x, y, width, height, 2, m(10, r) + m(11, g) + m(12, b) + m(13, a) + m(14, 1)
        @imSet srcData.data, x, y, width, height, 3, m(15, r) + m(16, g) + m(17, b) + m(18, a) + m(19, 1)

    ctx.clearRect 0, 0, width, height
    ctx.putImageData srcData, 0, 0
    return



class SVGfeMorphologyFilterPrimitiveElement extends SVGElement
  constructor: (node) ->
    super node
  
  apply: (ctx, x, y, width, height) ->
  # TODO: implement


class SVGfeCompositeFilterPrimitiveElement extends SVGElement
  constructor: (node) ->
    super node
  
  apply: (ctx, x, y, width, height) ->
  # TODO: implement


class SVGfilterElement extends SVGElement
  constructor: (node) ->
    super node
  
  apply: (ctx, element) ->
    
    # render as temp svg  
    bb = element.getBoundingBox()
    x = Math.floor(bb.x1)
    y = Math.floor(bb.y1)
    width = Math.floor(bb.width())
    height = Math.floor(bb.height())
    
    # temporarily remove filter to avoid recursion
    filter = element.style("filter").value
    element.style("filter").value = ""
    px = 0
    py = 0

    for child in @children
      efd = child.extraFilterDistance or 0
      px = Math.max(px, efd)
      py = Math.max(py, efd)
    c = document.createElement("canvas")
    c.width = width + 2 * px
    c.height = height + 2 * py
    tempCtx = c.getContext("2d")
    tempCtx.translate -x + px, -y + py
    element.render tempCtx
    
    # apply filters

    for child in @children
      child.apply tempCtx, 0, 0, width + 2 * px, height + 2 * py
    
    # render on me
    ctx.drawImage c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py
    
    # reassign filter
    element.style("filter", true).value = filter

  render: (ctx) ->
  # NO RENDER



class SVGclipPathElement extends SVGElement
  constructor: (node) ->
    #alert 'constructing clippath'
    super node

  apply: (ctx) ->
    #alert 'clipping'
    for child in @children
      if typeof child.path != 'undefined'
        transform = null
        if child.attribute('transform').hasValue()
          transform = new TransformsList(child.attribute('transform').value)
          transform.apply ctx
        child.path ctx
        ctx.clip()
        if transform
          transform.unapply ctx

    return



  render: (ctx) ->
  # NO RENDER

class SVGmaskContainerElement extends SVGElement
  constructor: (node) ->
    super node

  apply: (ctx, element) ->
    # render as temp svg  
    x = @attribute("x").toPixels("x")
    y = @attribute("y").toPixels("y")
    width = @attribute("width").toPixels("x")
    height = @attribute("height").toPixels("y")

    if width == 0 and height == 0
      bb = new SVGBoundingBox()
      i = 0
      while i < @children.length
        bb.addBoundingBox @children[i].getBoundingBox()
        i++
      x = Math.floor(bb.x1)
      y = Math.floor(bb.y1)
      width = Math.floor(bb.width())
      height = Math.floor(bb.height())
    
    # temporarily remove mask to avoid recursion
    mask = element.attribute("mask").value
    element.attribute("mask").value = ""

    cMask = document.createElement("canvas")
    cMask.width = x + width
    cMask.height = y + height
    maskCtx = cMask.getContext("2d")
    @renderChildren maskCtx

    c = document.createElement("canvas")
    c.width = x + width
    c.height = y + height
    tempCtx = c.getContext("2d")
    element.render tempCtx
    tempCtx.globalCompositeOperation = "destination-in"
    tempCtx.fillStyle = maskCtx.createPattern(cMask, "no-repeat")
    tempCtx.fillRect 0, 0, x + width, y + height

    ctx.fillStyle = tempCtx.createPattern(c, "no-repeat")
    ctx.fillRect 0, 0, x + width, y + height
    
    # reassign mask
    element.attribute("mask").value = mask
    return

  render: (ctx) ->
  # NO RENDER

class SVGElementStyle extends SVGElement

  constructor: (node) ->
    #alert 'building an SVGElementStyle'
    super node
    # text, or spaces then CDATA
    css = ""

    for childNode in node.childNodes
      css += childNode.nodeValue
    css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/g, "") # remove comments
    css = svg.compressSpaces(css) # replace whitespace
    cssDefs = css.split("}")

    for eachCssDef in cssDefs
      unless svg.trim(eachCssDef) == ""
        cssDef = eachCssDef.split("{")
        cssClasses = cssDef[0].split(",")
        cssProps = cssDef[1].split(";")

        for cssClass in cssClasses
          cssClass = svg.trim(cssClass)
          unless cssClass == ""
            props = {}

            for cssProp in cssProps
              prop = cssProp.indexOf(":")
              name = cssProp.substr(0, prop)
              value = cssProp.substr(prop + 1, cssProp.length - prop)
              props[svg.trim(name)] = new SVGProperty(svg.trim(name), svg.trim(value))  if name? and value?
            svg.Styles[cssClass] = props
            if cssClass == "@font-face"
              fontFamily = props["font-family"].value.replace(/"/g, "")
              srcs = props["src"].value.split(",")

              for src in srcs
                if src.indexOf("format(\"svg\")") > 0
                  urlStart = src.indexOf("url")
                  urlEnd = src.indexOf(")", urlStart)
                  url = src.substr(urlStart + 5, urlEnd - urlStart - 6)
                  doc = svg.parseXml(svg.ajax(url))
                  fonts = doc.getElementsByTagName("font")

                  for font in fonts
                    fontDef = svg.CreateElement(font)
                    svg.Definitions[fontFamily] = fontDef


# note that the fontface Element is actually
# called font-face
# see http://www.w3.org/TR/SVG/fonts.html#FontFaceElement
class SVGfontfaceElement extends SVGElement
  constructor: (node) ->
    #alert 'creating a font'
    super node
    @ascent = @attribute("ascent").value
    @descent = @attribute("descent").value
    @unitsPerEm = @attribute("units-per-em").numValue()

class SVGfontElement extends SVGElement

  constructor: (node) ->
    #alert 'constructing a font'
    super node
    @isRTL = false
    @isArabic = false
    @fontFace = null
    @missingGlyph = null
    @glyphs = []
    @horizAdvX = @attribute("horiz-adv-x").numValue()

    for i in [0...@children.length]
      child = @children[i]
      if child.type == "font-face"
        @fontFace = child
        svg.Definitions[child.style("font-family").value] = this  if child.style("font-family").hasValue()
      else if child.type == "missing-glyph"
        @missingGlyph = child
      else if child.type == "glyph"
        unless child.arabicForm == ""
          @isRTL = true
          @isArabic = true
          @glyphs[child.unicode] = []  if typeof (@glyphs[child.unicode]) == "undefined"
          @glyphs[child.unicode][child.arabicForm] = child
        else
          @glyphs[child.unicode] = child
    return



# note that "Animation" is not an SVG element
# it's just a superclass for all the proper
# animation-related SVG elements:
# ‘animateColor’, ‘animateMotion’,
# ‘animateTransform’, ‘animate’ and ‘set’
# (of which ‘animateColor’, ‘animateTransform’
# ‘animate’ are currently implemented)
class SVGAnimationElement extends SVGElement

  duration: 0.0
  initialValue: null
  initialUnits: ""
  removed: false

  constructor: (node) ->
    super node
    svg.Animations.push this
    @begin = @attribute("begin").toMilliseconds()
    @maxDuration = @begin + @attribute("dur").toMilliseconds()
    @from = @attribute("from")
    @to = @attribute("to")
    @values = @attribute("values")
    @values.value = @values.value.split(";")  if @values.hasValue()
  
  getProperty: ->
    attributeType = @attribute("attributeType").value
    attributeName = @attribute("attributeName").value
    return @parent.style(attributeName, true)  if attributeType == "CSS"
    @parent.attribute attributeName, true

  calcValue: ->
    
    # OVERRIDE ME!
    ""

  update: (delta) ->
    
    # set initial value
    unless @initialValue?
      @initialValue = @getProperty().value
      @initialUnits = @getProperty().getUnits()
    
    # if we're past the end time
    if @duration > @maxDuration
      
      # loop for indefinitely repeating animations
      if @attribute("repeatCount").value == "indefinite" or @attribute("repeatDur").value == "indefinite"
        @duration = 0.0
      else if @attribute("fill").valueOrDefault("remove") == "remove" and not @removed
        @removed = true
        @getProperty().value = @initialValue
        return true
      else
        return false # no updates made
    @duration = @duration + delta
    
    # if we're past the begin time
    updated = false
    if @begin < @duration
      newValue = @calcValue() # tween
      if @attribute("type").hasValue()
        
        # for transform, etc.
        type = @attribute("type").value
        newValue = type + "(" + newValue + ")"
      @getProperty().value = newValue
      updated = true
    updated

  
  # fraction of duration we've covered
  progress: ->
    ret = {}
    ret.progress = (@duration - @begin) / (@maxDuration - @begin)
    if @values.hasValue()
      p = ret.progress * (@values.value.length - 1)
      lb = Math.floor(p)
      ub = Math.ceil(p)
      ret.from = new SVGProperty("from", parseFloat(@values.value[lb]))
      ret.to = new SVGProperty("to", parseFloat(@values.value[ub]))
      ret.progress = (p - lb) / (ub - lb)
    else
      ret.from = @from
      ret.to = @to
    ret


class SVGanimateTransformAnimationElement extends SVGAnimationElement
  constructor: (node) ->
    super node

  calcValue: ->
    p = @progress()
    
    # tween value linearly
    from = svg.ToNumberArray(p.from.value)
    to = svg.ToNumberArray(p.to.value)
    newValue = ""

    for i in [0...from.length]
      newValue += from[i] + (to[i] - from[i]) * p.progress + " "
    newValue


class SVGanimateColorAnimationElement extends SVGAnimationElement

  constructor: (node) ->
    super node
  
  calcValue: ->
    p = @progress()
    from = new SVGRGBColor(p.from.value)
    to = new SVGRGBColor(p.to.value)
    if from.ok and to.ok
      
      # tween color linearly
      r = from.r + (to.r - from.r) * p.progress
      g = from.g + (to.g - from.g) * p.progress
      b = from.b + (to.b - from.b) * p.progress
      return "rgb(" + parseInt(r, 10) + "," + parseInt(g, 10) + "," + parseInt(b, 10) + ")"
    @attribute("from").value

class SVGanimateAnimationElement extends SVGAnimationElement
  constructor: (node) ->
    super node
  
  calcValue: ->
    p = @progress()
    
    # tween value linearly
    # console.log 'p: ' + p
    newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress
    newValue + @initialUnits

class SVGGradientElement extends SVGElement
  constructor: (node) ->
    @stops = []
    super node
    for i in [0...@children.length]
      child = @children[i]
      @stops.push child  if child.type == "stop"
    return

  getGradient: ->
  # OVERRIDE ME!

  gradientUnits: ->
    return @attribute("gradientUnits").valueOrDefault("objectBoundingBox")

  createGradient: (ctx, element, parentOpacityProp) ->
    stopsContainer = this
    stopsContainer = @getHrefAttribute().getDefinition()  if @getHrefAttribute().hasValue()
    addParentOpacity = (color) ->
      if parentOpacityProp.hasValue()
        p = new SVGProperty("color", color)
        return p.addOpacity(parentOpacityProp.value).value
      color

    g = @getGradient(ctx, element)
    return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color)  unless g?
    for i in [0...stopsContainer.stops.length]
      g.addColorStop stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color)

    if @attribute("gradientTransform").hasValue()      
      # render as transformed pattern on temporary canvas
      rootView = svg.ViewPort.viewPorts[0]
      rect = new SVGrectGraphicsElement()
      rect.attributes["x"] = new SVGProperty("x", -svg.MAX_VIRTUAL_PIXELS / 3.0)
      rect.attributes["y"] = new SVGProperty("y", -svg.MAX_VIRTUAL_PIXELS / 3.0)
      rect.attributes["width"] = new SVGProperty("width", svg.MAX_VIRTUAL_PIXELS)
      rect.attributes["height"] = new SVGProperty("height", svg.MAX_VIRTUAL_PIXELS)
      group = new SVGgContainerElement()
      group.attributes["transform"] = new SVGProperty("transform", @attribute("gradientTransform").value)
      group.children = [rect]
      tempSvg = new SVGElement()
      tempSvg.attributes["x"] = new SVGProperty("x", 0)
      tempSvg.attributes["y"] = new SVGProperty("y", 0)
      tempSvg.attributes["width"] = new SVGProperty("width", rootView.width)
      tempSvg.attributes["height"] = new SVGProperty("height", rootView.height)
      tempSvg.children = [group]
      c = document.createElement("canvas")
      c.width = rootView.width
      c.height = rootView.height
      tempCtx = c.getContext("2d")
      tempCtx.fillStyle = g
      tempSvg.render tempCtx
      return tempCtx.createPattern(c, "no-repeat")
    return g


class SVGradialGradientGradientElement extends SVGGradientElement

  constructor: (node) ->
    super node
  
  getGradient: (ctx, element) ->
    bb = element.getBoundingBox()
    @attribute("cx", true).value = "50%"  unless @attribute("cx").hasValue()
    @attribute("cy", true).value = "50%"  unless @attribute("cy").hasValue()
    @attribute("r", true).value = "50%"  unless @attribute("r").hasValue()
    cx = ((if @gradientUnits() == "objectBoundingBox" then bb.x() + bb.width() * @attribute("cx").numValue() else @attribute("cx").toPixels("x")))
    cy = ((if @gradientUnits() == "objectBoundingBox" then bb.y() + bb.height() * @attribute("cy").numValue() else @attribute("cy").toPixels("y")))
    fx = cx
    fy = cy
    fx = ((if @gradientUnits() == "objectBoundingBox" then bb.x() + bb.width() * @attribute("fx").numValue() else @attribute("fx").toPixels("x")))  if @attribute("fx").hasValue()
    fy = ((if @gradientUnits() == "objectBoundingBox" then bb.y() + bb.height() * @attribute("fy").numValue() else @attribute("fy").toPixels("y")))  if @attribute("fy").hasValue()
    r = ((if @gradientUnits() == "objectBoundingBox" then (bb.width() + bb.height()) / 2.0 * @attribute("r").numValue() else @attribute("r").toPixels()))
    ctx.createRadialGradient fx, fy, 0, cx, cy, r


class SVGlinearGradientGradientElement extends SVGGradientElement
  constructor: (node) ->
    super node

  getGradient: (ctx, element) ->
    bb = if @gradientUnits() == 'objectBoundingBox' then element.getBoundingBox() else null
    if not @attribute("x1").hasValue() and not @attribute("y1").hasValue() and not @attribute("x2").hasValue() and not @attribute("y2").hasValue()
      @attribute("x1", true).value = 0
      @attribute("y1", true).value = 0
      @attribute("x2", true).value = 1
      @attribute("y2", true).value = 0
    x1 = ((if @gradientUnits() == "objectBoundingBox" then bb.x() + bb.width() * @attribute("x1").numValue() else @attribute("x1").toPixels("x")))
    y1 = ((if @gradientUnits() == "objectBoundingBox" then bb.y() + bb.height() * @attribute("y1").numValue() else @attribute("y1").toPixels("y")))
    x2 = ((if @gradientUnits() == "objectBoundingBox" then bb.x() + bb.width() * @attribute("x2").numValue() else @attribute("x2").toPixels("x")))
    y2 = ((if @gradientUnits() == "objectBoundingBox" then bb.y() + bb.height() * @attribute("y2").numValue() else @attribute("y2").toPixels("y")))
    return null  if x1 is x2 and y1 is y2
    ctx.createLinearGradient x1, y1, x2, y2


class SVGRenderedElement extends SVGElement
  constructor: (node) ->
    super node
  
  setContext: (ctx) ->
    
    # fill
    if @style("fill").isUrlDefinition()
      fs = @style("fill").getFillStyleDefinition(this, @style("fill-opacity"))
      ctx.fillStyle = fs  if fs?
    else if @style("fill").hasValue()
      fillStyle = @style("fill")
      if fillStyle.value == "currentColor"
        fillStyle.value = @style("color").value
      
      if false
        #sabotage!
        randomSabotage = Math.random()
        
        #if randomSabotage > 1-1/3
        #  fillStyle.value = "red"
        #else if randomSabotage > 1-2/3
        #  fillStyle.value = "black"
        #else if randomSabotage > 1-3/3
        #  fillStyle.value = "yellow"

        #if randomSabotage > 1-1/3
        #  fillStyle.value = "#01dd85" # Caribbean Green
        #else if randomSabotage > 1-2/3
        #  fillStyle.value = "red"
        #else if randomSabotage > 1-3/3
        #  fillStyle.value = "#b271c3" # Amethyst


        if randomSabotage > 1-1/8
          fillStyle.value = "#01dd85" # Caribbean Green
        else if randomSabotage > 1-2/8
          fillStyle.value = "red"
        else if randomSabotage > 1-3/8
          fillStyle.value = "#b271c3" # Amethyst
        else if randomSabotage > 1-4/8
          fillStyle.value = "37a2da" # curious blue
        else if randomSabotage > 1-5/8
          fillStyle.value = "b40d91" # red violet
        else if randomSabotage > 1-6/8
          fillStyle.value = "EB038B" # Hollywood Cerise
        else if randomSabotage > 1-7/8
          fillStyle.value = "f0e905" # Turbo (i.e. a yellow)
        else if randomSabotage > 1-8/8
          fillStyle.value = "black"




        #if randomSabotage > 1-1/2
        #  fillStyle.value = "black"
        #else if randomSabotage > 1-2/2
        #  fillStyle.value = "white"

        #if randomSabotage > 1-1/2
        #  fillStyle.value = "black"
        #else if randomSabotage > 1-2/2
        #  fillStyle.value = "red"

      ctx.fillStyle = ((if fillStyle.value == "none" then "rgba(0,0,0,0)" else fillStyle.value))
    if @style("fill-opacity").hasValue()
      fillStyle = new SVGProperty("fill", ctx.fillStyle)
      fillStyle = fillStyle.addOpacity(@style("fill-opacity").value)
      ctx.fillStyle = fillStyle.value
    
    # stroke
    if @style("stroke").isUrlDefinition()
      fs = @style("stroke").getFillStyleDefinition(this, @style("stroke-opacity"))
      ctx.strokeStyle = fs  if fs?
    else if @style("stroke").hasValue()
      strokeStyle = @style("stroke")
      strokeStyle.value = @style("color").value  if strokeStyle.value == "currentColor"

      #if randomSabotage > 1-1/2
      #  strokeStyle.value = "black"
      #else if randomSabotage > 1-2/2
      #  strokeStyle.value = "red"
      
      ctx.strokeStyle = ((if strokeStyle.value == "none" then "rgba(0,0,0,0)" else strokeStyle.value))

    if @style("stroke-opacity").hasValue()
      strokeStyle = new SVGProperty("stroke", ctx.strokeStyle)
      strokeStyle = strokeStyle.addOpacity(@style("stroke-opacity").value)
      ctx.strokeStyle = strokeStyle.value
    if @style("stroke-width").hasValue()
      newLineWidth = @style("stroke-width").toPixels()
      ctx.lineWidth = (if newLineWidth is 0 then 0.001 else newLineWidth) # browsers don't respect 0
    if @style("stroke-linecap").hasValue()
      ctx.lineCap = @style("stroke-linecap").value
    if @style("stroke-linejoin").hasValue()
      ctx.lineJoin = @style("stroke-linejoin").value  
    if @style("stroke-miterlimit").hasValue()
      ctx.miterLimit = @style("stroke-miterlimit").value  
    if @style('stroke-dasharray').hasValue() and @style('stroke-dasharray').value != 'none'
      gaps = svg.ToNumberArray(@style('stroke-dasharray').value)
      if typeof ctx.setLineDash != 'undefined'
        ctx.setLineDash gaps
      else if typeof ctx.webkitLineDash != 'undefined'
        ctx.webkitLineDash = gaps
      else if typeof ctx.mozDash != 'undefined'
        ctx.mozDash = gaps
      offset = @style('stroke-dashoffset').numValueOrDefault(1)
      if typeof ctx.lineDashOffset != 'undefined'
        ctx.lineDashOffset = offset
      else if typeof ctx.webkitLineDashOffset != 'undefined'
        ctx.webkitLineDashOffset = offset
      else if typeof ctx.mozDashOffset != 'undefined'
        ctx.mozDashOffset = offset

    
    # font
    daFont = new SVGFont
    #alert 'typeof(ctx.font): ' + typeof(ctx.font)
    if typeof(ctx.font) != "undefined"
      #alert 'creating a font'
      ctx.font = daFont.CreateFont(@style("font-style").value, @style("font-variant").value, @style("font-weight").value, (if @style("font-size").hasValue() then @style("font-size").toPixels() + "px" else ""), @style("font-family").value).toString()
    
    # transform
    if @attribute("transform").hasValue()
      transform = new TransformsList(@attribute("transform").value)
      transform.apply ctx
    
    # clip
    if @style("clip-path").hasValue()
      clip = @style("clip-path").getDefinition()
      clip.apply ctx  if clip?
    
    # opacity
    ctx.globalAlpha = @style("opacity").numValue()  if @style("opacity").hasValue()
    return

# 'use' is both a graphics and and a structural element,
# see http://www.w3.org/TR/SVG/struct.html#UseElement, picking one.
class SVGuseGraphicsElement extends SVGRenderedElement

  element = null

  contructor: (node) ->
    super node
  
  setContext: (ctx) ->
    super ctx
    ctx.translate @attribute("x").toPixels("x"), 0  if @attribute("x").hasValue()
    ctx.translate 0, @attribute("y").toPixels("y")  if @attribute("y").hasValue()
    @element = @getHrefAttribute().getDefinition()

  path: (ctx) ->
    @element = @getHrefAttribute().getDefinition()
    @element.path ctx  if @element?

  getBoundingBox: ->
    @element = @getHrefAttribute().getDefinition()
    @element.getBoundingBox()  if @element?

  renderChildren: (ctx) ->
    @element = @getHrefAttribute().getDefinition()
    if @element?
      tempSvg = @element
      if @element.type == 'symbol'
        # render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
        tempSvg = new SVGElement()
        tempSvg.type = 'svg'
        tempSvg.attributes['viewBox'] = new SVGProperty('viewBox', @element.attribute('viewBox').value)
        tempSvg.attributes['preserveAspectRatio'] = new SVGProperty('preserveAspectRatio', @element.attribute('preserveAspectRatio').value)
        tempSvg.attributes['overflow'] = new SVGProperty('overflow', @element.attribute('overflow').value)
        tempSvg.children = @element.children
      if tempSvg.type == 'svg'
        # if symbol or svg, inherit width/height from me
        if @attribute('width').hasValue()
          tempSvg.attributes['width'] = new SVGProperty('width', @attribute('width').value)
        if @attribute('height').hasValue()
          tempSvg.attributes['height'] = new SVGProperty('height', @attribute('height').value)
      oldParent = tempSvg.parent
      tempSvg.parent = null
      tempSvg.render ctx
      tempSvg.parent = oldParent
    return


class SVGgContainerElement extends SVGRenderedElement
  constructor: (node) ->
    super node

  getBoundingBox: ->
    bb = new SVGBoundingBox()

    for i in [0...@children.length]
      bb.addBoundingBox @children[i].getBoundingBox()
    bb


class SVGsymbolStructuralElement extends SVGRenderedElement
  constructor: (node) ->
    super node
  
  setContext: (ctx) ->
    super ctx

  # NO RENDER
  render: ->
    
class SVGimageGraphicsElement extends SVGRenderedElement
  constructor: (node) ->
    super node
    href = @getHrefAttribute().value
    isSvg = href.match(/\.svg$/)
    svg.Images.push this
    @loaded = false
    unless isSvg
      @img = document.createElement("img")
      if svg.opts['useCORS'] == true
        @img.crossOrigin = 'Anonymous'
      self = this
      @img.onload = ->
        self.loaded = true

      @img.onerror = ->
        console.log "ERROR: image \"" + href + "\" not found"  if console
        self.loaded = true

      @img.src = href
    else
      @img = svg.ajax(href)
      @loaded = true
    @renderChildren = (ctx) ->
      x = @attribute("x").toPixels("x")
      y = @attribute("y").toPixels("y")
      width = @attribute("width").toPixels("x")
      height = @attribute("height").toPixels("y")
      return  if width is 0 or height is 0
      ctx.save()
      if isSvg
        ctx.drawSvg @img, x, y, width, height
      else
        ctx.translate x, y
        svg.AspectRatio ctx, @attribute("preserveAspectRatio").value, width, @img.width, height, @img.height, 0, 0
        ctx.drawImage @img, 0, 0
      ctx.restore()

  getBoundingBox: ->
    x = @attribute("x").toPixels("x")
    y = @attribute("y").toPixels("y")
    width = @attribute("width").toPixels("x")
    height = @attribute("height").toPixels("y")
    new SVGBoundingBox(x, y, x + width, y + height)


class SVGTextContentElement extends SVGRenderedElement
  constructor:(node) ->
    super node

  getGlyph: (font, text, i) ->
    c = text[i]
    glyph = null
    console.log "font: " + font + " glyphs: " + font.glyphs
    if font.isArabic
      arabicForm = "isolated"
      arabicForm = "terminal"  if (i is 0 or text[i - 1] == " ") and i < text.length - 2 and text[i + 1] != " "
      arabicForm = "medial"  if i > 0 and text[i - 1] != " " and i < text.length - 2 and text[i + 1] != " "
      arabicForm = "initial"  if i > 0 and text[i - 1] != " " and (i is text.length - 1 or text[i + 1] == " ")
      unless typeof (font.glyphs[c]) == "undefined"
        glyph = font.glyphs[c][arabicForm]
        glyph = font.glyphs[c]  if not glyph? and font.glyphs[c].type == "glyph"
    else
      console.trace()
      glyph = font.glyphs[c]
    glyph = font.missingGlyph  unless glyph?
    glyph

  renderChildren: (ctx) ->
    customFontStyle = @parent.style("font-family")
    customFont = customFontStyle.getDefinition()
    if customFont?
      fontSize = @parent.style("font-size").numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize)
      fontStyle = @parent.style("font-style").valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle)
      text = @getText()
      text = text.split("").reverse().join("")  if customFont.isRTL
      dx = svg.ToNumberArray(@parent.attribute("dx").value)

      for i in [0...text.length]
        glyph = @getGlyph(customFont, text, i)
        scale = fontSize / customFont.fontFace.unitsPerEm
        ctx.translate @x, @y
        ctx.scale scale, -scale
        lw = ctx.lineWidth
        ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize
        ctx.transform 1, 0, .4, 1, 0, 0  if fontStyle == "italic"
        glyph.render ctx
        ctx.transform 1, 0, -.4, 1, 0, 0  if fontStyle == "italic"
        ctx.lineWidth = lw
        ctx.scale 1 / scale, -1 / scale
        ctx.translate -@x, -@y
        @x += fontSize * (glyph.horizAdvX or customFont.horizAdvX) / customFont.fontFace.unitsPerEm
        @x += dx[i]  if typeof (dx[i]) != "undefined" and not isNaN(dx[i])
      return
    ctx.strokeText svg.compressSpaces(@getText()), @x, @y  unless ctx.strokeStyle == ""
    ctx.fillText svg.compressSpaces(@getText()), @x, @y  unless ctx.fillStyle == ""

  getText: ->


  measureTextRecursive: (ctx) ->
    width = @measureText(ctx)
    i = 0
    while i < @children.length
      width += @children[i].measureTextRecursive(ctx)
      i++
    width

  # OVERRIDE ME
  measureText: (ctx) ->
    customFontStyle = @parent.style("font-family")
    customFont = customFontStyle.getDefinition()
    if customFont?
      fontSize = @parent.style("font-size").numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize)
      measure = 0
      text = @getText()
      text = text.split("").reverse().join("")  if customFont.isRTL
      dx = svg.ToNumberArray(@parent.attribute("dx").value)

      for i in [0...text.length]
        glyph = @getGlyph(customFont, text, i)
        measure += (glyph.horizAdvX or customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm
        measure += dx[i]  if typeof (dx[i]) != "undefined" and not isNaN(dx[i])
      return measure
    textToMeasure = svg.compressSpaces(@getText())
    return textToMeasure.length * 10  unless ctx.measureText
    ctx.save()
    @setContext ctx
    width = ctx.measureText(textToMeasure).width
    ctx.restore()
    return width

# in theory, 'a' is a container element though
class SVGaContainerElement extends SVGTextContentElement
  constructor: (node) ->
    super node
    @hasText = true

    # nodeType is a DOM nomenclature:
    # 1 ELEMENT_NODE
    # 2 ATTRIBUTE_NODE
    # 3 TEXT_NODE
    # (see http://www.javascriptkit.com/domref/nodetype.shtml
    #  for the other 9 types)
    for i in [0...node.childNodes.length]
      @hasText = false  unless node.childNodes[i].nodeType is 3
    
    # this might contain text
    @text = (if @hasText then node.childNodes[0].nodeValue else "")

  getText: ->
    @text

  renderChildren: (ctx) ->
    if @hasText
      
      # render as text element
      super ctx
      fontSize = new SVGProperty("fontSize", svg.Font.Parse(svg.ctx.font).fontSize)
      svg.SVGMouse.checkBoundingBox this, new SVGBoundingBox(@x, @y - fontSize.toPixels("y"), @x + @measureText(ctx), @y)
    else
      
      # render as temporary group
      g = new SVGgContainerElement()
      g.children = @children
      g.parent = this
      g.render ctx

  onclick: ->
    window.open @getHrefAttribute().value

  onmousemove: ->
    svg.ctx.canvas.style.cursor = "pointer"


class SVGtrefTextContentElement extends SVGTextContentElement
  constructor: (node) ->
    super node
  
  getText: ->
    element = @getHrefAttribute().getDefinition()
    element.children[0].getText()  if element?


class SVGtspanTextContentElement extends SVGTextContentElement
  constructor: (node) ->
    @captureTextNodes = true
    super node
    @text = node.nodeValue or node.text or ""
  
  getText: ->
    @text


class SVGtextTextContentElement extends SVGRenderedElement
  constructor: (node) ->
    @captureTextNodes = true
    super node

    if node != null
      # add children
      @children = []
      i = 0
      while i < node.childNodes.length
        childNode = node.childNodes[i]
        if childNode.nodeType == 1
          # capture tspan and tref nodes
          @addChild childNode, true
        else if childNode.nodeType == 3
          # capture text
          @addChild (new SVGtspanTextContentElement(childNode)), false
        i++
  
  setContext: (ctx) ->
    #alert 'text.setContext'
    super ctx

    textBaseline = @style('dominant-baseline').toTextBaseline()
    if textBaseline == null
      textBaseline = @style('alignment-baseline').toTextBaseline()
    if textBaseline != null
      ctx.textBaseline = textBaseline
    return

  getBoundingBox: ->
    x = @attribute('x').toPixels('x')
    y = @attribute('y').toPixels('y')
    fontSize = @parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize)
    new SVGBoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * @children[0].getText().length, y)

  renderChildren: (ctx) ->
    @x = @attribute('x').toPixels('x')
    @y = @attribute('y').toPixels('y')
    #@x += @getAnchorDelta ctx, @, 0
    if @attribute('dx').hasValue()
      @x += @attribute('dx').toPixels('x')
    if @attribute('dy').hasValue()
      @y += @attribute('dy').toPixels('y')
    @x += @getAnchorDelta(ctx, this, 0)
    for i in [0...@children.length]
      @renderChild ctx, this, i
    return

  getAnchorDelta: (ctx, parent, startI) ->
    @textAnchor = @style('text-anchor').valueOrDefault('start')
    if @textAnchor != 'start'
      width = 0
      i = startI
      while i < parent.children.length
        child = parent.children[i]
        if i > startI and child.attribute('x').hasValue()
          break
        # new group
        width += child.measureTextRecursive(ctx)
        i++
      return -1 * (if @textAnchor == 'end' then width else width / 2.0)
    0

  renderChild: (ctx, parent, i) ->
    child = parent.children[i]
    if child.attribute('x').hasValue()
      child.x = child.attribute('x').toPixels('x') + @getAnchorDelta(ctx, parent, i)
    else
      if @attribute('dx').hasValue()
        @x += @attribute('dx').toPixels('x')
      if child.attribute('dx').hasValue()
        @x += child.attribute('dx').toPixels('x')
      child.x = @x
    @x = child.x + child.measureText(ctx)
    if child.attribute('y').hasValue()
      child.y = child.attribute('y').toPixels('y')
    else
      if @attribute('dy').hasValue()
        @y += @attribute('dy').toPixels('y')
      if child.attribute('dy').hasValue()
        @y += child.attribute('dy').toPixels('y')
      child.y = @y
    @y = child.y
    child.render ctx
    i = 0
    while i < child.children.length
      @renderChild ctx, child, i
      i++
    return

  ###
  renderChild: (ctx, parent, i) ->
    child = parent.children[i]
    if child.attribute("x").hasValue()
      child.x = child.attribute("x").toPixels("x")
    else
      @x += @attribute("dx").toPixels("x")  if @attribute("dx").hasValue()
      @x += child.attribute("dx").toPixels("x")  if child.attribute("dx").hasValue()
      child.x = @x
    childLength = (if typeof (child.measureText == "undefined") then 0 else child.measureText(ctx))
    if @textAnchor != "start" and (i is 0 or child.attribute("x").hasValue()) # new group?
      # loop through rest of children
      groupLength = childLength

      for j in [i+1...@children.length]
        childInGroup = @children[j]
        break  if childInGroup.attribute("x").hasValue() # new group
        groupLength += childInGroup.measureText(ctx)
      child.x -= ((if @textAnchor == "end" then groupLength else groupLength / 2.0))
    @x = child.x + childLength
    if child.attribute("y").hasValue()
      child.y = child.attribute("y").toPixels("y")
    else
      @y += @attribute("dy").toPixels("y")  if @attribute("dy").hasValue()
      @y += child.attribute("dy").toPixels("y")  if child.attribute("dy").hasValue()
      child.y = @y
    @y = child.y
    child.render ctx

    for i in [0...child.children.length]
      @renderChild ctx, child, i
    return
  ###


class SVGElement extends SVGRenderedElement
  constructor: (node) ->
    super node
  
  clearContext: (ctx) ->
    super ctx
    svg.ViewPort.RemoveCurrent()

  setContext: (ctx) ->    
    # initial values and defaults
    ctx.strokeStyle = "rgba(0,0,0,0)"
    ctx.lineCap = "butt"
    ctx.lineJoin = "miter"
    ctx.miterLimit = 4

    if typeof(ctx.font) != 'undefined' and typeof(window.getComputedStyle) != 'undefined'
      ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font')

    super ctx
    
    # create new view port
    @attribute("x", true).value = 0  unless @attribute("x").hasValue()
    @attribute("y", true).value = 0  unless @attribute("y").hasValue()
    ctx.translate @attribute("x").toPixels("x"), @attribute("y").toPixels("y")
    width = svg.ViewPort.width()
    height = svg.ViewPort.height()
    @attribute("width", true).value = "100%"  unless @attribute("width").hasValue()
    @attribute("height", true).value = "100%"  unless @attribute("height").hasValue()
    if typeof (@root) == "undefined"
      width = @attribute("width").toPixels("x")
      height = @attribute("height").toPixels("y")
      x = 0
      y = 0
      if @attribute("refX").hasValue() and @attribute("refY").hasValue()
        x = -@attribute("refX").toPixels("x")
        y = -@attribute("refY").toPixels("y")
      if @attribute('overflow').valueOrDefault('hidden') != 'visible'
        ctx.beginPath()
        ctx.moveTo x, y
        ctx.lineTo width, y
        ctx.lineTo width, height
        ctx.lineTo x, height
        ctx.closePath()
        ctx.clip()
    svg.ViewPort.SetCurrent width, height
    
    # viewbox
    if @attribute("viewBox").hasValue()
      viewBox = svg.ToNumberArray(@attribute("viewBox").value)
      minX = viewBox[0]
      minY = viewBox[1]
      width = viewBox[2]
      height = viewBox[3]
      svg.AspectRatio ctx, @attribute("preserveAspectRatio").value, svg.ViewPort.width(), width, svg.ViewPort.height(), height, minX, minY, @attribute("refX").value, @attribute("refY").value
      ###
      svg.AspectRatio ctx,
        @attribute("preserveAspectRatio").value,
        width,
        svg.ViewPort.width(),
        height,
        svg.ViewPort.height(), minX, minY, @attribute("refX").value, @attribute("refY").value
      ###
      svg.ViewPort.RemoveCurrent()
      svg.ViewPort.SetCurrent viewBox[2], viewBox[3]


class SVGGraphicsElement extends SVGRenderedElement
  constructor: (node) ->
    super node

  path: (ctx) ->
    ctx.beginPath()  if ctx?
    new SVGBoundingBox()

  renderChildren: (ctx) ->
    @path ctx
    svg.SVGMouse.checkPath this, ctx
    unless ctx.fillStyle == ""
      # TODO value 'inherit' is not handled
      if @attribute('fill-rule').hasValue()
        if @attribute('fill-rule').value != 'inherit'
          ctx.fill @attribute('fill-rule').value
        else
          ctx.fill()
      else
        ctx.fill()
    unless ctx.strokeStyle == ""
      ctx.stroke()
    markers = @getMarkers()
    if markers?
      if @style("marker-start").isUrlDefinition()
        marker = @style("marker-start").getDefinition()
        marker.render ctx, markers[0][0], markers[0][1]
      if @style("marker-mid").isUrlDefinition()
        marker = @style("marker-mid").getDefinition()
        for i in [1...markers.length - 1]
          marker.render ctx, markers[i][0], markers[i][1]
      if @style("marker-end").isUrlDefinition()
        marker = @style("marker-end").getDefinition()
        marker.render ctx, markers[markers.length - 1][0], markers[markers.length - 1][1]
    return

  getBoundingBox: ->
    @path()

  getMarkers: ->
    null

class SVGPathParser
  constructor: (d) ->
    @tokens = d.split(" ")

  reset: ->
    @i = -1
    @command = ""
    @previousCommand = ""
    @start = new SVGPoint(0, 0)
    @control = new SVGPoint(0, 0)
    @current = new SVGPoint(0, 0)
    @points = []
    @angles = []

  isEnd: ->
    @i >= @tokens.length - 1

  isCommandOrEnd: ->
    return true  if @isEnd()
    @tokens[@i + 1].match(/^[A-Za-z]$/)?

  isRelativeCommand: ->
    switch @command
      when "m", "l", "h", "v", "c", "s", "q", "t", "a", "z"
        return true
    false

  getToken: ->
    @i++
    @tokens[@i]

  getScalar: ->
    parseFloat @getToken()

  nextCommand: ->
    @previousCommand = @command
    @command = @getToken()
    return

  getPoint: ->
    p = new SVGPoint(@getScalar(), @getScalar())
    @makeAbsolute p

  getAsControlPoint: ->
    p = @getPoint()
    @control = p
    p

  getAsCurrentPoint: ->
    p = @getPoint()
    @current = p
    p

  getReflectedControlPoint: ->
    return @current  if @previousCommand.toLowerCase() != "c" and @previousCommand.toLowerCase() != "s" and @previousCommand.toLowerCase() != "q" and @previousCommand.toLowerCase() != "t"
    
    # reflect point
    p = new SVGPoint(2 * @current.x - @control.x, 2 * @current.y - @control.y)
    p

  makeAbsolute: (p) ->
    if @isRelativeCommand()
      p.x += @current.x
      p.y += @current.y
    p

  addMarker: (p, from, priorTo) ->
    # if the last angle isn't filled in because we didn't have this point yet ...
    @angles[@angles.length - 1] = @points[@points.length - 1].angleTo(priorTo)  if priorTo? and @angles.length > 0 and not @angles[@angles.length - 1]?
    @addMarkerAngle p, (if not from? then null else from.angleTo(p))

  addMarkerAngle: (p, a) ->
    @points.push p
    @angles.push a
    return

  getMarkerPoints: ->
    @points

  getMarkerAngles: ->
    for i in [0...@angles.length]
      unless @angles[i]?
        for j in [i+1...@angles.length]
          if @angles[j]?
            @angles[i] = @angles[j]
            break
    @angles

class SVGpathGraphicsElement extends SVGGraphicsElement
  constructor: (node) ->
    #console.log 'creating a SVGpathGraphicsElement'
    super node
    #console.log 'created a SVGGraphicsElement'
    d = @attribute("d").value
    
    # TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
    d = d.replace(/,/g, " ") # get rid of all commas
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2") # separate commands from commands
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2") # separate commands from commands
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/g, "$1 $2") # separate commands from points
    d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/g, "$1 $2") # separate commands from points
    d = d.replace(/([0-9])([+\-])/g, "$1 $2") # separate digits when no comma
    d = d.replace(/(\.[0-9]*)(\.)/g, "$1 $2") # separate digits when no comma
    d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/g, "$1 $3 $4 ") # shorthand elliptical arc path syntax
    d = svg.compressSpaces(d) # compress multiple spaces
    d = svg.trim(d)
    @d = d
    #console.log 'finished creating a path'

  path: (ctx) ->
    pp = new SVGPathParser(@d)
    @pp = pp
    pp.reset()
    bb = new SVGBoundingBox()
    ctx.beginPath()  if ctx?
    until pp.isEnd()
      pp.nextCommand()
      switch pp.command
        when "M", "m"
          p = pp.getAsCurrentPoint()
          pp.addMarker p
          bb.addPoint p.x, p.y
          ctx.moveTo p.x, p.y  if ctx?
          pp.start = pp.current
          until pp.isCommandOrEnd()
            p = pp.getAsCurrentPoint()
            pp.addMarker p, pp.start
            bb.addPoint p.x, p.y
            ctx.lineTo p.x, p.y  if ctx?
        when "L", "l"
          until pp.isCommandOrEnd()
            c = pp.current
            p = pp.getAsCurrentPoint()
            pp.addMarker p, c
            bb.addPoint p.x, p.y
            ctx.lineTo p.x, p.y  if ctx?
        when "H", "h"
          until pp.isCommandOrEnd()
            newP = new SVGPoint(((if pp.isRelativeCommand() then pp.current.x else 0)) + pp.getScalar(), pp.current.y)
            pp.addMarker newP, pp.current
            pp.current = newP
            bb.addPoint pp.current.x, pp.current.y
            ctx.lineTo pp.current.x, pp.current.y  if ctx?
        when "V", "v"
          until pp.isCommandOrEnd()
            newP = new SVGPoint(pp.current.x, ((if pp.isRelativeCommand() then pp.current.y else 0)) + pp.getScalar())
            pp.addMarker newP, pp.current
            pp.current = newP
            bb.addPoint pp.current.x, pp.current.y
            ctx.lineTo pp.current.x, pp.current.y  if ctx?
        when "C", "c"
          until pp.isCommandOrEnd()
            curr = pp.current
            p1 = pp.getPoint()
            cntrl = pp.getAsControlPoint()
            cp = pp.getAsCurrentPoint()
            pp.addMarker cp, cntrl, p1
            bb.addBezierCurve curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y
            ctx.bezierCurveTo p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y  if ctx?
        when "S", "s"
          until pp.isCommandOrEnd()
            curr = pp.current
            p1 = pp.getReflectedControlPoint()
            cntrl = pp.getAsControlPoint()
            cp = pp.getAsCurrentPoint()
            pp.addMarker cp, cntrl, p1
            bb.addBezierCurve curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y
            ctx.bezierCurveTo p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y  if ctx?
        when "Q", "q"
          until pp.isCommandOrEnd()
            curr = pp.current
            cntrl = pp.getAsControlPoint()
            cp = pp.getAsCurrentPoint()
            pp.addMarker cp, cntrl, cntrl
            bb.addQuadraticCurve curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y
            ctx.quadraticCurveTo cntrl.x, cntrl.y, cp.x, cp.y  if ctx?
        when "T", "t"
          until pp.isCommandOrEnd()
            curr = pp.current
            cntrl = pp.getReflectedControlPoint()
            pp.control = cntrl
            cp = pp.getAsCurrentPoint()
            pp.addMarker cp, cntrl, cntrl
            bb.addQuadraticCurve curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y
            ctx.quadraticCurveTo cntrl.x, cntrl.y, cp.x, cp.y  if ctx?
        when "A", "a"
          until pp.isCommandOrEnd()
            curr = pp.current
            rx = pp.getScalar()
            ry = pp.getScalar()
            xAxisRotation = pp.getScalar() * (Math.PI / 180.0)
            largeArcFlag = pp.getScalar()
            sweepFlag = pp.getScalar()
            cp = pp.getAsCurrentPoint()
            
            # Conversion from endpoint to center parameterization
            # http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            # x1', y1'
            currp = new SVGPoint(Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0, -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0)
            
            # adjust radii
            l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2)
            if l > 1
              rx *= Math.sqrt(l)
              ry *= Math.sqrt(l)
            
            # cx', cy'
            s = ((if largeArcFlag is sweepFlag then -1 else 1)) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)))
            s = 0  if isNaN(s)
            cpp = new SVGPoint(s * rx * currp.y / ry, s * -ry * currp.x / rx)
            
            # cx, cy
            centp = new SVGPoint((curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y)
            
            # vector magnitude
            m = (v) ->
              Math.sqrt Math.pow(v[0], 2) + Math.pow(v[1], 2)

            
            # ratio between two vectors
            r = (u, v) ->
              (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v))

            
            # angle between two vectors
            a = (u, v) ->
              ((if u[0] * v[1] < u[1] * v[0] then -1 else 1)) * Math.acos(r(u, v))

            
            # initial angle
            a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry])
            
            # angle delta
            u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]
            v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry]
            ad = a(u, v)
            ad = Math.PI  if r(u, v) <= -1
            ad = 0  if r(u, v) >= 1
            
            # for markers
            dir = (if 1 - sweepFlag then 1.0 else -1.0)
            ah = a1 + dir * (ad / 2.0)
            halfWay = new SVGPoint(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah))
            pp.addMarkerAngle halfWay, ah - dir * Math.PI / 2
            pp.addMarkerAngle cp, ah - dir * Math.PI
            bb.addPoint cp.x, cp.y # TODO: this is too naive, make it better
            if ctx?
              r = (if rx > ry then rx else ry)
              sx = (if rx > ry then 1 else rx / ry)
              sy = (if rx > ry then ry / rx else 1)
              ctx.translate centp.x, centp.y
              ctx.rotate xAxisRotation
              ctx.scale sx, sy
              ctx.arc 0, 0, r, a1, a1 + ad, 1 - sweepFlag
              ctx.scale 1 / sx, 1 / sy
              ctx.rotate -xAxisRotation
              ctx.translate -centp.x, -centp.y
        when "Z", "z"
          ctx.closePath()  if ctx?
          pp.current = pp.start
    bb

  getMarkers: ->
    points = @pp.getMarkerPoints()
    angles = @pp.getMarkerAngles()
    markers = []
    for i in [0...points.length]
      markers.push [points[i], angles[i]]
    markers

# note that a SVGglyphContainerElement would actually be a container
# element
class SVGglyphContainerElement extends SVGpathGraphicsElement
  constructor: (node) ->
    super node
    @horizAdvX = @attribute("horiz-adv-x").numValue()
    @unicode = @attribute("unicode").value
    @arabicForm = @attribute("arabic-form").value
    return

###
From http://www.w3.org/TR/SVG/fonts.html#MissingGlyphElement:
The ‘missing-glyph’ element defines the graphics to use
if there is an attempt to draw a glyph from a given font
and the given glyph has not been defined. The attributes
on the ‘missing-glyph’ element have the same meaning as
the corresponding attributes on the ‘glyph’ element.
###

# Note that is would be missing-glyph, but we remove
# the dashes in the parsing process.
class SVGmissingglyphContainerElement extends SVGpathGraphicsElement
  constructor: (node) ->
    super node
    @horizAdvX = 0
    return


class SVGpolylineGraphicsElement extends SVGGraphicsElement
  constructor: (node) ->
    super node
    @points = SVGPoint.pointsArrayFromNumberArray(@attribute("points").value)
  
  path: (ctx) ->
    bb = new SVGBoundingBox(@points[0].x, @points[0].y)
    if ctx?
      ctx.beginPath()
      ctx.moveTo @points[0].x, @points[0].y
    for i in [1...@points.length]
      bb.addPoint @points[i].x, @points[i].y
      ctx.lineTo @points[i].x, @points[i].y  if ctx?
    bb

  getMarkers: ->
    markers = []

    for i in [0...@points.length - 1]
      markers.push [@points[i], @points[i].angleTo(@points[i + 1])]
    markers.push [@points[@points.length - 1], markers[markers.length - 1][1]]
    markers

class SVGpolygonGraphicsElement extends SVGpolylineGraphicsElement
  constructor: (node) ->
    super node
  
  path: (ctx) ->
    bb = super(ctx)
    if ctx?
      ctx.lineTo @points[0].x, @points[0].y
      ctx.closePath()
    bb

class SVGlineGraphicsElement extends SVGGraphicsElement
  constructor: (node) ->
    super node
  
  getPoints: ->
    [new SVGPoint(@attribute("x1").toPixels("x"), @attribute("y1").toPixels("y")), new SVGPoint(@attribute("x2").toPixels("x"), @attribute("y2").toPixels("y"))]

  path: (ctx) ->
    points = @getPoints()
    if ctx?
      ctx.beginPath()
      ctx.moveTo points[0].x, points[0].y
      ctx.lineTo points[1].x, points[1].y
    new SVGBoundingBox(points[0].x, points[0].y, points[1].x, points[1].y)

  getMarkers: ->
    points = @getPoints()
    a = points[0].angleTo(points[1])
    [[points[0], a], [points[1], a]]


class SVGellipseGraphicsElement extends SVGGraphicsElement
  constructor: (node) ->
    super node
  
  path: (ctx) ->
    KAPPA = 4 * ((Math.sqrt(2) - 1) / 3)
    rx = @attribute("rx").toPixels("x")
    ry = @attribute("ry").toPixels("y")
    cx = @attribute("cx").toPixels("x")
    cy = @attribute("cy").toPixels("y")
    if ctx?
      ctx.beginPath()
      ctx.moveTo cx, cy - ry
      ctx.bezierCurveTo cx + (KAPPA * rx), cy - ry, cx + rx, cy - (KAPPA * ry), cx + rx, cy
      ctx.bezierCurveTo cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry
      ctx.bezierCurveTo cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy
      ctx.bezierCurveTo cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry
      ctx.closePath()
    new SVGBoundingBox(cx - rx, cy - ry, cx + rx, cy + ry)

class SVGcircleGraphicsElement extends SVGGraphicsElement

  constructor: (node) ->
    super node

  path: (ctx) ->
    cx = @attribute("cx").toPixels("x")
    cy = @attribute("cy").toPixels("y")
    r = @attribute("r").toPixels()
    if ctx?
      ctx.beginPath()
      ctx.arc cx, cy, r, 0, Math.PI * 2, true
      ctx.closePath()
    new SVGBoundingBox(cx - r, cy - r, cx + r, cy + r)


class SVGrectGraphicsElement extends SVGGraphicsElement
  constructor: (node) ->
    super node
  
  path: (ctx) ->
    x = @attribute("x").toPixels("x")
    y = @attribute("y").toPixels("y")
    width = @attribute("width").toPixels("x")
    height = @attribute("height").toPixels("y")
    rx = @attribute("rx").toPixels("x")
    ry = @attribute("ry").toPixels("y")
    ry = rx  if @attribute("rx").hasValue() and not @attribute("ry").hasValue()
    rx = ry  if @attribute("ry").hasValue() and not @attribute("rx").hasValue()
    rx = Math.min(rx, width / 2.0)
    ry = Math.min(ry, height / 2.0)
    if ctx?
      ctx.beginPath()
      ctx.moveTo x + rx, y
      ctx.lineTo x + width - rx, y
      ctx.quadraticCurveTo x + width, y, x + width, y + ry
      ctx.lineTo x + width, y + height - ry
      ctx.quadraticCurveTo x + width, y + height, x + width - rx, y + height
      ctx.lineTo x + rx, y + height
      ctx.quadraticCurveTo x, y + height, x, y + height - ry
      ctx.lineTo x, y + ry
      ctx.quadraticCurveTo x, y, x + rx, y
      ctx.closePath()
    new SVGBoundingBox(x, y, x + width, y + height)


class SVGStopElement extends SVGElement
  constructor: (node) ->
    super node
    @offset = @attribute("offset").numValue()
    @offset = 0  if @offset < 0
    @offset = 1  if @offset > 1
    stopColor = @style("stop-color")
    stopColor = stopColor.addOpacity(@style("stop-opacity").value)  if @style("stop-opacity").hasValue()
    @color = stopColor.value
    return

class SVGdefsContainerElement extends SVGElement
  constructor: (node) ->
    super node
  render: (ctx) ->
    return

class SVGmarkerContainerElement extends SVGElement
  constructor: (node) ->
    super node

  render: (ctx, point, angle) ->
    ctx.translate point.x, point.y
    ctx.rotate angle  if @attribute("orient").valueOrDefault("auto") == "auto"
    ctx.scale ctx.lineWidth, ctx.lineWidth  if @attribute("markerUnits").valueOrDefault("strokeWidth") == "strokeWidth"
    ctx.save()
    
    # render me using a temporary svg element
    tempSvg = new SVGElement()
    tempSvg.attributes["viewBox"] = new SVGProperty("viewBox", @attribute("viewBox").value)
    tempSvg.attributes["refX"] = new SVGProperty("refX", @attribute("refX").value)
    tempSvg.attributes["refY"] = new SVGProperty("refY", @attribute("refY").value)
    tempSvg.attributes["width"] = new SVGProperty("width", @attribute("markerWidth").value)
    tempSvg.attributes["height"] = new SVGProperty("height", @attribute("markerHeight").value)
    tempSvg.attributes["fill"] = new SVGProperty("fill", @attribute("fill").valueOrDefault("black"))
    tempSvg.attributes["stroke"] = new SVGProperty("stroke", @attribute("stroke").valueOrDefault("none"))
    tempSvg.children = @children
    tempSvg.render ctx
    ctx.restore()
    ctx.scale 1 / ctx.lineWidth, 1 / ctx.lineWidth  if @attribute("markerUnits").valueOrDefault("strokeWidth") == "strokeWidth"
    ctx.rotate -angle  if @attribute("orient").valueOrDefault("auto") == "auto"
    ctx.translate -point.x, -point.y
    return

class SVGpatternContainerElement extends SVGElement
  constructor: (node) ->
    super node

  # NO RENDER, the pattern container just defines the pattern
  # it will be rendered "later" via a fill referencing it
  render: ->

  createPattern: (ctx, element) ->
    debugger
    width = @attribute("width").toPixels("x", true)
    height = @attribute("height").toPixels("y", true)

    # render me using a temporary svg element
    tempSvg = new SVGElement()
    tempSvg.attributes["viewBox"] = new SVGProperty("viewBox", @attribute("viewBox").value)
    tempSvg.attributes["width"] = new SVGProperty("width", width + "px")
    tempSvg.attributes["height"] = new SVGProperty("height", height + "px")
    tempSvg.attributes["transform"] = new SVGProperty("transform", @attribute("patternTransform").value)
    tempSvg.children = @children
    c = document.createElement("canvas")
    c.width = width
    c.height = height
    cctx = c.getContext("2d")
    if @attribute("x").hasValue() and @attribute("y").hasValue()
      cctx.translate(@attribute("x").toPixels("x", true), @attribute("y").toPixels("y", true))

    # render 3x3 grid so when we transform there's no white space on edges
    for x in [-1..1]
      for y in [-1..1]
        cctx.save()
        cctx.translate x * c.width, y * c.height
        tempSvg.render cctx
        cctx.restore()
    patternToBeReturned = ctx.createPattern(c, "repeat")
    patternToBeReturned



class SVGfeGaussianBlurFilterPrimitiveElement extends SVGElement
  constructor: (node) ->
    super node
    @blurRadius = Math.floor(@attribute("stdDeviation").numValue())
    @extraFilterDistance = @blurRadius
  
  apply: (ctx, x, y, width, height) ->
    if typeof (stackBlurCanvasRGBA) == "undefined"
      console.log "ERROR: StackBlur.js must be included for blur to work"
      return
    
    # StackBlur requires canvas be on document
    ctx.canvas.id = svg.UniqueId()
    ctx.canvas.style.display = "none"
    document.body.appendChild ctx.canvas
    stackBlurCanvasRGBA ctx.canvas.id, x, y, width, height, @blurRadius
    document.body.removeChild ctx.canvas
    return



class TransformsList
  constructor: (v) ->
    @Type = {}
    
    @Type.translate = SVGtranslateTransformType
    @Type.rotate = SVGrotateTransformType
    @Type.scale = SVGscaleTransformType
    @Type.matrix = SVGmatrixTransformType
    @Type.skewX = SVGskewXTransformType
    @Type.skewY = SVGskewYTransformType

    @transforms = []

    data = svg.trim(svg.compressSpaces(v)).replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/)

    for i in [0...data.length]
      type = svg.trim(data[i].split("(")[0])
      s = data[i].split("(")[1].replace(")", "")
      transform = new @Type[type](s)
      transform.type = type
      @transforms.push transform

  apply: (ctx) ->
    for i in [0...@transforms.length]
      @transforms[i].apply ctx
    return

  unapply: (ctx) ->
    i = @transforms.length - 1
    while i >= 0
      @transforms[i].unapply ctx
      i--
    return

  applyToPoint: (p) ->
    for i in [0...@transforms.length]
      @transforms[i].applyToPoint p
    return


class SVGscaleTransformType
  constructor: (s) ->
    @p = SVGPoint.pointsFromNumberArray(s)

  apply: (ctx) ->
    ctx.scale @p.x or 1.0, @p.y or @p.x or 1.0
    return

  unapply: (ctx) ->
    ctx.scale 1.0 / @p.x or 1.0, 1.0 / @p.y or 1.0 / @p.x or 1.0
    return

  applyToPoint: (p) ->
    p.applyTransform [@p.x or 0.0, 0, 0, @p.y or 0.0, 0, 0]
    return

class SVGmatrixTransformType
  constructor: (s) ->
    @m = svg.ToNumberArray(s)
  apply: (ctx) ->
    ctx.transform @m[0], @m[1], @m[2], @m[3], @m[4], @m[5]
    return

  applyToPoint: (p) ->
    p.applyTransform @m
    return

class SVGSkewsTransformType extends SVGmatrixTransformType
  constructor: (s) ->
    super s
    @angle = new SVGProperty("angle", s)
    return

class SVGskewXTransformType extends SVGSkewsTransformType
  constructor: (s) ->
    super s
    @m = [1, 0, Math.tan(@angle.toRadians()), 1, 0, 0]
    return

class SVGskewYTransformType extends SVGSkewsTransformType
  constructor: (s) ->
    super s
    @m = [1, Math.tan(@angle.toRadians()), 0, 1, 0, 0]
    return

class SVGrotateTransformType
  constructor: (s) ->
    a = svg.ToNumberArray(s)
    @angle = new SVGProperty("angle", a[0])
    @cx = a[1] or 0
    @cy = a[2] or 0
  
  apply: (ctx) ->
    ctx.translate @cx, @cy
    ctx.rotate @angle.toRadians()
    ctx.translate -@cx, -@cy
    return

  unapply: (ctx) ->
    ctx.translate @cx, @cy
    ctx.rotate(-1 * @angle.toRadians())
    ctx.translate -@cx, -@cy
    return

  applyToPoint: (p) ->
    a = @angle.toRadians()
    p.applyTransform [1, 0, 0, 1, @p.x or 0.0, @p.y or 0.0]
    p.applyTransform [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]
    p.applyTransform [1, 0, 0, 1, -@p.x or 0.0, -@p.y or 0.0]
    return


class SVGtranslateTransformType
  constructor: (s) ->
    @p = SVGPoint.pointsFromNumberArray(s)
  apply: (ctx) ->
    ctx.translate @p.x or 0.0, @p.y or 0.0
    return
  unapply: (ctx) ->
    ctx.translate -1.0 * @p.x or 0.0, -1.0 * @p.y or 0.0
    return
  applyToPoint: (p) ->
    p.applyTransform [1, 0, 0, 1, @p.x or 0.0, @p.y or 0.0]
    return


# bounding box
class SVGBoundingBox

  x1: Number.NaN
  y1: Number.NaN
  x2: Number.NaN
  y2: Number.NaN

  constructor: (x1, y1, x2, y2) -> # pass in initial points if you want
    @addPoint x1, y1
    @addPoint x2, y2

  x: ->
    @x1

  y: ->
    @y1

  width: ->
    @x2 - @x1

  height: ->
    @y2 - @y1

  addPoint: (x, y) ->
    if x?
      if isNaN(@x1) or isNaN(@x2)
        @x1 = x
        @x2 = x
      @x1 = x  if x < @x1
      @x2 = x  if x > @x2
    if y?
      if isNaN(@y1) or isNaN(@y2)
        @y1 = y
        @y2 = y
      @y1 = y  if y < @y1
      @y2 = y  if y > @y2

  addX: (x) ->
    @addPoint x, null

  addY: (y) ->
    @addPoint null, y

  addBoundingBox: (bb) ->
    @addPoint bb.x1, bb.y1
    @addPoint bb.x2, bb.y2

  addQuadraticCurve: (p0x, p0y, p1x, p1y, p2x, p2y) ->
    cp1x = p0x + 2 / 3 * (p1x - p0x) # CP1 = QP0 + 2/3 *(QP1-QP0)
    cp1y = p0y + 2 / 3 * (p1y - p0y) # CP1 = QP0 + 2/3 *(QP1-QP0)
    cp2x = cp1x + 1 / 3 * (p2x - p0x) # CP2 = CP1 + 1/3 *(QP2-QP0)
    cp2y = cp1y + 1 / 3 * (p2y - p0y) # CP2 = CP1 + 1/3 *(QP2-QP0)
    @addBezierCurve p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y
    return

  addBezierCurve: (p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) ->
    
    # from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
    p0 = [p0x, p0y]
    p1 = [p1x, p1y]
    p2 = [p2x, p2y]
    p3 = [p3x, p3y]
    @addPoint p0[0], p0[1]
    @addPoint p3[0], p3[1]
    for i in [0..1]
      f = (t) ->
        Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i]

      b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i]
      a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i]
      c = 3 * p1[i] - 3 * p0[i]
      if a == 0
        continue  if b == 0
        t = -c / b
        if 0 < t and t < 1
          @addX f(t)  if i == 0
          @addY f(t)  if i == 1
        continue
      b2ac = Math.pow(b, 2) - 4 * c * a
      continue  if b2ac < 0
      t1 = (-b + Math.sqrt(b2ac)) / (2 * a)
      if 0 < t1 and t1 < 1
        @addX f(t1)  if i == 0
        @addY f(t1)  if i == 1
      t2 = (-b - Math.sqrt(b2ac)) / (2 * a)
      if 0 < t2 and t2 < 1
        @addX f(t2)  if i == 0
        @addY f(t2)  if i == 1
    return

  isPointInBox: (x, y) ->
    @x1 <= x and x <= @x2 and @y1 <= y and y <= @y2


class SVGViewPort
  constructor: ->
    @viewPorts= []

  Clear: ->
    @viewPorts = []
    return

  SetCurrent: (width, height) ->
    @viewPorts.push
      width: width
      height: height
    return

  RemoveCurrent: ->
    @viewPorts.pop()
    return

  Current: ->
    @viewPorts[@viewPorts.length - 1]

  width: ->
    @Current().width

  height: ->
    @Current().height

  ComputeSize: (d) ->
    return d  if d? and typeof (d) == "number"
    return @width()  if d == "x"
    return @height()  if d == "y"
    Math.sqrt(Math.pow(@width(), 2) + Math.pow(@height(), 2)) / Math.sqrt(2)

class SVGPoint

  constructor: (x, y) ->
    @x = x
    @y = y
    return

  @pointsFromNumberArray: (s) -> 
    if arguments.length == 1
      a = svg.ToNumberArray(s)
      return new SVGPoint(a[0], a[1])  


  @pointsArrayFromNumberArray: (s) ->
    a = svg.ToNumberArray(s)
    pathOfPoints = []

    for i in [0...a.length] by 2
      pathOfPoints.push new SVGPoint(a[i], a[i + 1])
    pathOfPoints

  angleTo: (p) ->
    Math.atan2 p.y - @y, p.x - @x

  applyTransform: (v) ->
    xp = @x * v[0] + @y * v[2] + v[4]
    yp = @x * v[1] + @y * v[3] + v[5]
    @x = xp
    @y = yp
    return

class SVGFont

  Styles: "normal|italic|oblique|inherit"
  Variants: "normal|small-caps|inherit"
  Weights: "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit"

  CreateFont: (fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) ->
    f = (if inherit? then @Parse(inherit) else @CreateFont("", "", "", "", "", svg.ctx.font))
    fontFamily: fontFamily or f.fontFamily
    fontSize: fontSize or f.fontSize
    fontStyle: fontStyle or f.fontStyle
    fontWeight: fontWeight or f.fontWeight
    fontVariant: fontVariant or f.fontVariant
    toString: ->
      [@fontStyle, @fontVariant, @fontWeight, @fontSize, @fontFamily].join " "

  Parse: (s) =>
    f = {}
    d = svg.trim(svg.compressSpaces(s or "")).split(" ")
    set =
      fontSize: false
      fontStyle: false
      fontWeight: false
      fontVariant: false

    ff = ""
    for i in d
      if not set.fontStyle and @Styles.indexOf(i) isnt -1
        f.fontStyle = i  unless i == "inherit"
        set.fontStyle = true
      else if not set.fontVariant and @Variants.indexOf(i) isnt -1
        f.fontVariant = i  unless i == "inherit"
        set.fontStyle = set.fontVariant = true
      else if not set.fontWeight and @Weights.indexOf(i) isnt -1
        f.fontWeight = i  unless i == "inherit"
        set.fontStyle = set.fontVariant = set.fontWeight = true
      else unless set.fontSize
        f.fontSize = i.split("/")[0]  unless i == "inherit"
        set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true
      else
        ff += i  unless i == "inherit"
    f.fontFamily = ff  unless ff == ""
    f


class SVGProperty

  textBaselineMapping: null

  constructor: (@name, @value) ->
    @textBaselineMapping =
      'baseline': 'alphabetic'
      'before-edge': 'top'
      'text-before-edge': 'top'
      'middle': 'middle'
      'central': 'middle'
      'after-edge': 'bottom'
      'text-after-edge': 'bottom'
      'ideographic': 'ideographic'
      'alphabetic': 'alphabetic'
      'hanging': 'hanging'
  'mathematical': 'alphabetic'

  getValue: ->
    @value

  hasValue: ->
    @value? and @value != ""


  # return the numerical value of the property
  numValue: ->
    return 0  unless @hasValue()
    n = parseFloat(@value)
    n = n / 100.0  if (@value + "").match(/%$/)
    n

  valueOrDefault: (def) ->
    return @value  if @hasValue()
    def

  numValueOrDefault: (def) ->
    return @numValue()  if @hasValue()
    def


  # color extensions
  # augment the current color value with the opacity
  addOpacity: (opacity) ->
    newValue = @value
    if opacity? and opacity != "" and typeof (@value) == "string" # can only add opacity to colors, not patterns
      color = new SVGRGBColor(@value)
      newValue = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + opacity + ")"  if color.ok
    new SVGProperty(@name, newValue)


  # definition extensions
  # get the definition from the definitions table
  getDefinition: ->
    name = @value.match(/#([^\)'"]+)/)
    name = name[1]  if name
    name = @value  unless name
    if name == "" then return null
    svg.Definitions[name]

  isUrlDefinition: ->
    @value.indexOf("url(") is 0

  getFillStyleDefinition: (e, opacityProp) ->
    def = @getDefinition()
    
    # gradient
    if def? and def.createGradient?
      return def.createGradient(svg.ctx, e, opacityProp)
    
    # pattern
    if def? and def.createPattern?
      if def.getHrefAttribute().hasValue()
        pt = def.attribute('patternTransform')
        def = def.getHrefAttribute().getDefinition()
        if pt.hasValue()
          def.attribute('patternTransform', true).value = pt.value
      return def.createPattern(svg.ctx, e)


    null


  # length extensions
  getDPI: (viewPort) ->
    96.0 # TODO: compute?

  getEM: (viewPort) ->
    em = 12
    fontSize = new SVGProperty("fontSize", svg.Font.Parse(svg.ctx.font).fontSize)
    em = fontSize.toPixels(viewPort)  if fontSize.hasValue()
    em

  getUnits: ->
    s = @value + ""
    s.replace /[0-9\.\-]/g, ""


  # get the length as pixels
  toPixels: (viewPort, processPercent) ->
    return 0  unless @hasValue()
    s = @value + ""
    return @numValue() * @getEM(viewPort)  if s.match(/em$/)
    return @numValue() * @getEM(viewPort) / 2.0  if s.match(/ex$/)
    return @numValue()  if s.match(/px$/)
    return @numValue() * @getDPI(viewPort) * (1.0 / 72.0)  if s.match(/pt$/)
    return @numValue() * 15  if s.match(/pc$/)
    return @numValue() * @getDPI(viewPort) / 2.54  if s.match(/cm$/)
    return @numValue() * @getDPI(viewPort) / 25.4  if s.match(/mm$/)
    return @numValue() * @getDPI(viewPort)  if s.match(/in$/)
    return @numValue() * svg.ViewPort.ComputeSize(viewPort)  if s.match(/%$/)
    n = @numValue()
    return n * svg.ViewPort.ComputeSize(viewPort)  if processPercent and n < 1.0
    n


  # time extensions
  # get the time as milliseconds
  toMilliseconds: ->
    return 0  unless @hasValue()
    s = @value + ""
    return @numValue() * 1000  if s.match(/s$/)
    return @numValue()  if s.match(/ms$/)
    @numValue()


  # angle extensions
  # get the angle as radians
  toRadians: ->
    return 0  unless @hasValue()
    s = @value + ""
    return @numValue() * (Math.PI / 180.0)  if s.match(/deg$/)
    return @numValue() * (Math.PI / 200.0)  if s.match(/grad$/)
    return @numValue()  if s.match(/rad$/)
    @numValue() * (Math.PI / 180.0)


  toTextBaseline: ->
    if !@hasValue()
      return null
    @textBaselineMapping[@value]

###
A class to parse color values
@author Stoyan Stefanov <sstoo@gmail.com>
@link   http://www.phpied.com/rgb-color-parser-in-javascript/
@license Use it if you like it
###
SVGRGBColor = (color_string) ->
  @ok = false
  
  # strip any leading #
  # remove # if any
  color_string = color_string.substr(1, 6)  if color_string.charAt(0) == "#"
  color_string = color_string.replace(RegExp(" ", "g"), "")
  color_string = color_string.toLowerCase()
  
  # before getting into regexps, try simple matches
  # and overwrite the input
  simple_colors =
    aliceblue: "f0f8ff"
    antiquewhite: "faebd7"
    aqua: "00ffff"
    aquamarine: "7fffd4"
    azure: "f0ffff"
    beige: "f5f5dc"
    bisque: "ffe4c4"
    black: "000000"
    blanchedalmond: "ffebcd"
    blue: "0000ff"
    blueviolet: "8a2be2"
    brown: "a52a2a"
    burlywood: "deb887"
    cadetblue: "5f9ea0"
    chartreuse: "7fff00"
    chocolate: "d2691e"
    coral: "ff7f50"
    cornflowerblue: "6495ed"
    cornsilk: "fff8dc"
    crimson: "dc143c"
    cyan: "00ffff"
    darkblue: "00008b"
    darkcyan: "008b8b"
    darkgoldenrod: "b8860b"
    darkgray: "a9a9a9"
    darkgreen: "006400"
    darkkhaki: "bdb76b"
    darkmagenta: "8b008b"
    darkolivegreen: "556b2f"
    darkorange: "ff8c00"
    darkorchid: "9932cc"
    darkred: "8b0000"
    darksalmon: "e9967a"
    darkseagreen: "8fbc8f"
    darkslateblue: "483d8b"
    darkslategray: "2f4f4f"
    darkturquoise: "00ced1"
    darkviolet: "9400d3"
    deeppink: "ff1493"
    deepskyblue: "00bfff"
    dimgray: "696969"
    dodgerblue: "1e90ff"
    feldspar: "d19275"
    firebrick: "b22222"
    floralwhite: "fffaf0"
    forestgreen: "228b22"
    fuchsia: "ff00ff"
    gainsboro: "dcdcdc"
    ghostwhite: "f8f8ff"
    gold: "ffd700"
    goldenrod: "daa520"
    gray: "808080"
    green: "008000"
    greenyellow: "adff2f"
    honeydew: "f0fff0"
    hotpink: "ff69b4"
    indianred: "cd5c5c"
    indigo: "4b0082"
    ivory: "fffff0"
    khaki: "f0e68c"
    lavender: "e6e6fa"
    lavenderblush: "fff0f5"
    lawngreen: "7cfc00"
    lemonchiffon: "fffacd"
    lightblue: "add8e6"
    lightcoral: "f08080"
    lightcyan: "e0ffff"
    lightgoldenrodyellow: "fafad2"
    lightgrey: "d3d3d3"
    lightgreen: "90ee90"
    lightpink: "ffb6c1"
    lightsalmon: "ffa07a"
    lightseagreen: "20b2aa"
    lightskyblue: "87cefa"
    lightslateblue: "8470ff"
    lightslategray: "778899"
    lightsteelblue: "b0c4de"
    lightyellow: "ffffe0"
    lime: "00ff00"
    limegreen: "32cd32"
    linen: "faf0e6"
    magenta: "ff00ff"
    maroon: "800000"
    mediumaquamarine: "66cdaa"
    mediumblue: "0000cd"
    mediumorchid: "ba55d3"
    mediumpurple: "9370d8"
    mediumseagreen: "3cb371"
    mediumslateblue: "7b68ee"
    mediumspringgreen: "00fa9a"
    mediumturquoise: "48d1cc"
    mediumvioletred: "c71585"
    midnightblue: "191970"
    mintcream: "f5fffa"
    mistyrose: "ffe4e1"
    moccasin: "ffe4b5"
    navajowhite: "ffdead"
    navy: "000080"
    oldlace: "fdf5e6"
    olive: "808000"
    olivedrab: "6b8e23"
    orange: "ffa500"
    orangered: "ff4500"
    orchid: "da70d6"
    palegoldenrod: "eee8aa"
    palegreen: "98fb98"
    paleturquoise: "afeeee"
    palevioletred: "d87093"
    papayawhip: "ffefd5"
    peachpuff: "ffdab9"
    peru: "cd853f"
    pink: "ffc0cb"
    plum: "dda0dd"
    powderblue: "b0e0e6"
    purple: "800080"
    red: "ff0000"
    rosybrown: "bc8f8f"
    royalblue: "4169e1"
    saddlebrown: "8b4513"
    salmon: "fa8072"
    sandybrown: "f4a460"
    seagreen: "2e8b57"
    seashell: "fff5ee"
    sienna: "a0522d"
    silver: "c0c0c0"
    skyblue: "87ceeb"
    slateblue: "6a5acd"
    slategray: "708090"
    snow: "fffafa"
    springgreen: "00ff7f"
    steelblue: "4682b4"
    tan: "d2b48c"
    teal: "008080"
    thistle: "d8bfd8"
    tomato: "ff6347"
    turquoise: "40e0d0"
    violet: "ee82ee"
    violetred: "d02090"
    wheat: "f5deb3"
    white: "ffffff"
    whitesmoke: "f5f5f5"
    yellow: "ffff00"
    yellowgreen: "9acd32"

  for key of simple_colors
    color_string = simple_colors[key]  if color_string is key
  
  # end of simple type-in colors
  
  # array of color definition objects
  color_defs = [
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/
    #example: ["rgb(123, 234, 45)", "rgb(255,234,245)"]
    process: (bits) ->
      [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])]
  ,
    re: /^(\w{2})(\w{2})(\w{2})$/
    #example: ["#00ff00", "336699"]
    process: (bits) ->
      [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)]
  ,
    re: /^(\w{1})(\w{1})(\w{1})$/
    #example: ["#fb0", "f0f"]
    process: (bits) ->
      [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)]
  ]
  
  # search through the definitions to find a match
  for color_def in color_defs
    re = color_def.re
    processor = color_def.process
    bits = re.exec(color_string)
    if bits
      channels = processor(bits)
      @r = channels[0]
      @g = channels[1]
      @b = channels[2]
      @ok = true
  
  # validate/cleanup values
  @r = (if (@r < 0 or isNaN(@r)) then 0 else ((if (@r > 255) then 255 else @r)))
  @g = (if (@g < 0 or isNaN(@g)) then 0 else ((if (@g > 255) then 255 else @g)))
  @b = (if (@b < 0 or isNaN(@b)) then 0 else ((if (@b > 255) then 255 else @b)))

  #sabotage!
  #if Math.random() > 0.5
  #  @r = 255
  #  @g = 255
  #  @b = 255
  #else
  #  @r = 0
  #  @g = 0
  #  @b = 0

  # some getters
  # not used
  @toRGB = ->
    "rgb(" + @r + ", " + @g + ", " + @b + ")"

  # not used
  @toHex = ->
    r = @r.toString(16)
    g = @g.toString(16)
    b = @b.toString(16)
    r = "0" + r  if r.length is 1
    g = "0" + g  if g.length is 1
    b = "0" + b  if b.length is 1
    "#" + r + g + b

  return @


