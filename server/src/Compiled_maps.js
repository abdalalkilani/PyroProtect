"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Map_ from './Map_';
function templateConcat(n, str) {
  res = str;
  for (i = 0; i < n - 1; i++) {
    res += " " + str;
  }
  return res;
}
var map;
var zoomLevel = 15;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: 51.5088,
      lng: -0.1749
    },
    mapTypeId: "satellite"
  });
  var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(51.5009, -0.1826), new google.maps.LatLng(51.5100, -0.1589));
  var CustomOverlay = /*#__PURE__*/function (_google$maps$OverlayV) {
    _inherits(CustomOverlay, _google$maps$OverlayV);
    var _super = _createSuper(CustomOverlay);
    function CustomOverlay(bounds) {
      var _this;
      _classCallCheck(this, CustomOverlay);
      _this = _super.call(this);
      _this.bounds = bounds;
      _this.div = null;
      return _this;
    }
    _createClass(CustomOverlay, [{
      key: "onAdd",
      value: function onAdd() {
        this.div = document.createElement('div');
        this.div.style.border = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";
        this.div.style.width = "100%";
        this.div.style.height = "100%";
        this.div.style.display = 'grid';
        this.div.style.gridTemplateColumns = templateConcat(10, '40px');
        this.div.style.gridTemplateRows = templateConcat(10, '40px');
        ReactDOM.render( /*#__PURE__*/React.createElement(Map_, null), this.div);
        this.getPanes().overlayLayer.appendChild(this.div);
      }
    }, {
      key: "onRemove",
      value: function onRemove() {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }, {
      key: "draw",
      value: function draw() {
        var overlayProjection = this.getProjection();
        if (!overlayProjection) {
          return;
        }
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
        if (this.div) {
          this.div.style.left = sw.x + "px";
          this.div.style.top = ne.y + "px"; // Change to use ne.y instead of sw.y
          var factor = Math.pow(2, zoomLevel - 15);
          this.div.style.gridTemplateColumns = templateConcat(20, 40 * factor + 'px');
          this.div.style.gridTemplateRows = templateConcat(20, 40 * factor + 'px');
          //this.div.style.width = ne.x - sw.x + "px";
          //this.div.style.height = sw.y - ne.y + "px"; // Change to use sw.y - ne.y instead of ne.y - sw.y
        }

        google.maps.event.addListener(map, "zoom_changed", function () {
          // Get the current zoom level
          zoomLevel = map.getZoom();
          console.log(zoomLevel);
        });
      }
    }]);
    return CustomOverlay;
  }(google.maps.OverlayView);
  var customOverlay = new CustomOverlay(bounds);
  customOverlay.setMap(map);
}

// function initMap() {
//   const map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: 51.4988, lng: 0.1749 },
//     zoom: 8
//   });

//   const customOverlay = new google.maps.OverlayView();
//   customOverlay.onAdd = function () {
//     const div = document.createElement('div');
//     div.id = 'grid';
//     div.style.display = "flex";
//     div.style.alignItems = "center";
//     div.style.justifyContent = "center";
//     div.style.position = "absolute";
//     div.style.width = "100%";
//     div.style.height = "100%";

//     ReactDOM.render(<Map_ />, div);
//     this.getPanes().floatPane.appendChild(div);
//   };

//   customOverlay.setMap(map);
// };
