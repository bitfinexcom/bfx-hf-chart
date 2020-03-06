"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (canvas, color, transformer, {
  yData,
  xData,
  ySize,
  xSize,
  yOffset = 0,
  xOffset = 0
}) {
  const points = [];

  for (let i = 0; i < xData.length; i += 1) {
    points.push({
      y: yOffset - transformer.y(yData[i], ySize),
      x: transformer.x(xData[i], xSize) + xOffset
    });
  }

  (0, _line2.default)(canvas, color, points);
};

var _line = require("./line");

var _line2 = _interopRequireDefault(_line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }