"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = exports.propTypes = undefined;

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const propTypes = exports.propTypes = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  showMarketLabel: _propTypes2.default.bool,
  extraHeaderComponentsLeft: _propTypes2.default.any,
  extraHeaderComponentsRight: _propTypes2.default.any
};
const defaultProps = exports.defaultProps = {
  showMarketLabel: true
};