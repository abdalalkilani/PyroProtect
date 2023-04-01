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
var e = React.createElement;
var PositionForm = /*#__PURE__*/function (_React$Component) {
  _inherits(PositionForm, _React$Component);
  var _super = _createSuper(PositionForm);
  function PositionForm(props) {
    var _this;
    _classCallCheck(this, PositionForm);
    _this = _super.call(this, props);
    _this.state = {
      x: '',
      y: '',
      d: ''
    };
    _this.handleChange1 = _this.handleChange1.bind(_assertThisInitialized(_this));
    _this.handleChange2 = _this.handleChange2.bind(_assertThisInitialized(_this));
    _this.handleChange3 = _this.handleChange3.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(PositionForm, [{
    key: "handleChange1",
    value: function handleChange1(event) {
      this.setState({
        x: event.target.value,
        y: this.state.y,
        d: this.state.d
      });
    }
  }, {
    key: "handleChange2",
    value: function handleChange2(event) {
      this.setState({
        y: event.target.value,
        x: this.state.x,
        d: this.state.d
      });
    }
  }, {
    key: "handleChange3",
    value: function handleChange3(event) {
      this.setState({
        d: event.target.value,
        x: this.state.x,
        y: this.state.y
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          x: this.state.x,
          y: this.state.y,
          device: "device" + this.state.d
        })
      };
      fetch('http://13.41.188.158:8080/api/ChangePosition', requestOptions);
      event.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("label", null, "X:", /*#__PURE__*/React.createElement("input", {
        type: "number",
        value: this.state.x,
        onChange: this.handleChange1
      }), "Y:", /*#__PURE__*/React.createElement("input", {
        type: "number",
        value: this.state.y,
        onChange: this.handleChange2
      }), "ID:", /*#__PURE__*/React.createElement("input", {
        type: "number",
        value: this.state.d,
        onChange: this.handleChange3
      })), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        value: "Submit"
      }));
    }
  }]);
  return PositionForm;
}(React.Component);
var domContainer = document.querySelector('#form');
if (domContainer) {
  var root = ReactDOM.createRoot(domContainer);
  root.render(e(PositionForm));
} else {
  console.error("Element with id 'test' not found in the HTML");
}
