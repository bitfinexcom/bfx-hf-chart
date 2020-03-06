"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (data, vWidth, rightMTS) {
  const maxP = (0, _max3.default)(data);
  const minP = (0, _min3.default)(data);
  const pd = maxP - minP;
  let defaultTargetWidth;
  let defaultTargetHeight;

  let defaultYModifier = y => y;

  let defaultXModifier = x => x;

  const x = (dX, targetWidth = defaultTargetWidth) => {
    return defaultXModifier((vWidth - (rightMTS - dX)) / vWidth * targetWidth);
  };

  const y = (dY, targetHeight = defaultTargetHeight) => {
    return defaultYModifier((dY - minP) / pd * targetHeight);
  };

  const point = p => {
    return {
      x: x(p.mts),
      y: y(p.price)
    };
  };

  const setTargetWidth = targetWidth => {
    defaultTargetWidth = targetWidth;
  };

  const setTargetHeight = targetHeight => {
    defaultTargetHeight = targetHeight;
  };

  const setYModifier = cb => {
    defaultYModifier = cb;
  };

  const setXModifier = cb => {
    defaultXModifier = cb;
  };

  return {
    x,
    y,
    point,
    setTargetWidth,
    setTargetHeight,
    setYModifier,
    setXModifier
  };
};

var _max2 = require("lodash/max");

var _max3 = _interopRequireDefault(_max2);

var _min2 = require("lodash/min");

var _min3 = _interopRequireDefault(_min2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }