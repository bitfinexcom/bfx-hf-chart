"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bfxHfIndicators = require("bfx-hf-indicators");

var _bfxHfIndicators2 = _interopRequireDefault(_bfxHfIndicators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = indicators => {
  try {
    return JSON.parse(indicators).map(([iClassID, iArgs, iColors]) => [Object.values(_bfxHfIndicators2.default).find(i => i.id === iClassID), iArgs, iColors]);
  } catch (e) {
    console.error(`invalid indicators JSON: ${e.stack}`);
    return [];
  }
};