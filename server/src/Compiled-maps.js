"use strict";

var _init = _interopRequireDefault(require("./src/init.js"));
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.7749,
      lng: -122.4194
    },
    zoom: 8
  });
  var customOverlay = new google.maps.OverlayView();
  customOverlay.onAdd = function () {
    var div = document.createElement('div');
    _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(_init["default"], null), div);
    this.getPanes().floatPane.appendChild(div);
  };
  customOverlay.setMap(map);
}
;
