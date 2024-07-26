"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _react = require("react");
var _react2 = _interopRequireDefault(_react);
var _reactOnclickoutside = require("react-onclickoutside");
var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);
var _reactCustomScrollbars = require("react-custom-scrollbars");
require("./Dropdown.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Dropdown extends _react2.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      open: false
    });
    this.onToggle = this.onToggle.bind(this);
  }
  handleClickOutside() {
    this.setState(() => ({
      open: false
    }));
  }
  onToggle() {
    this.setState(({
      open
    }) => ({
      open: !open
    }));
  }
  render() {
    const {
      label,
      children
    } = this.props;
    const {
      open
    } = this.state;
    return /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__dropdown-wrapper"
    }, /*#__PURE__*/_react2.default.createElement("p", {
      onClick: this.onToggle
    }, label), open && /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__dropdown-menu"
    }, /*#__PURE__*/_react2.default.createElement(_reactCustomScrollbars.Scrollbars, {
      renderThumbVertical: ({
        style,
        ...props
      }) => /*#__PURE__*/_react2.default.createElement("div", _extends({
        style: {
          ...style,
          backgroundColor: '#333'
        }
      }, props))
    }, children)));
  }
}
exports.default = (0, _reactOnclickoutside2.default)(Dropdown);