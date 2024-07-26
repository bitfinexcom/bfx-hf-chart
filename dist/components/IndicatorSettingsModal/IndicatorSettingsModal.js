"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _react = require("react");
var _react2 = _interopRequireDefault(_react);
var _isFinite2 = require("lodash/isFinite");
var _isFinite3 = _interopRequireDefault(_isFinite2);
var _isString2 = require("lodash/isString");
var _isString3 = _interopRequireDefault(_isString2);
require("./IndicatorSettingsModal.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class IndicatorSettingsModal extends _react2.default.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      values: []
    });
    const {
      settings = {}
    } = this.props;
    const {
      argsDef,
      args = []
    } = settings;
    this.state.values = args.map((arg, i) => (0, _isFinite3.default)(arg) || (0, _isString3.default)(arg) ? arg : argsDef[i].default);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onValueChange(index, value) {
    this.setState(({
      values
    }) => {
      const nextValues = [...values];
      nextValues[index] = (0, _isFinite3.default)(+value) ? +value : value;
      return {
        values: nextValues
      };
    });
  }
  onSave() {
    const {
      onSave
    } = this.props;
    const {
      values
    } = this.state;
    onSave(values);
  }
  render() {
    const {
      values
    } = this.state;
    const {
      onClose,
      onDelete,
      settings = {}
    } = this.props;
    const {
      name,
      argsDef,
      args = []
    } = settings;
    return /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__indicatorsettingsmodal-outer"
    }, /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__indicatorsettingsmodal-wrapper"
    }, /*#__PURE__*/_react2.default.createElement("p", {
      className: "bfxc__indicatorsettingsmodal-title"
    }, name, " Settings"), /*#__PURE__*/_react2.default.createElement("ul", {
      className: "bfxc__indicatorsettingsmodal-settings"
    }, args.map((arg, i) => /*#__PURE__*/_react2.default.createElement("li", {
      key: i
    }, /*#__PURE__*/_react2.default.createElement("p", null, argsDef[i].label), /*#__PURE__*/_react2.default.createElement("input", {
      type: "text",
      value: values[i],
      onChange: e => this.onValueChange(i, e.target.value)
    })))), /*#__PURE__*/_react2.default.createElement("ul", {
      className: "bfxc__indicatorsettingsmodal-actions"
    }, /*#__PURE__*/_react2.default.createElement("li", null, /*#__PURE__*/_react2.default.createElement("button", {
      onClick: onClose
    }, "Close")), /*#__PURE__*/_react2.default.createElement("li", null, /*#__PURE__*/_react2.default.createElement("button", {
      onClick: onDelete,
      className: "red"
    }, "Delete")), /*#__PURE__*/_react2.default.createElement("li", null, /*#__PURE__*/_react2.default.createElement("button", {
      onClick: this.onSave,
      className: "green"
    }, "Save")))));
  }
}
exports.default = IndicatorSettingsModal;