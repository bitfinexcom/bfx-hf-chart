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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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