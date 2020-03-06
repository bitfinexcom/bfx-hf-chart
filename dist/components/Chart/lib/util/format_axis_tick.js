"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = tick => {
  return +tick.toPrecision(8).toLocaleString('en-US', {
    maximumFractionDigits: 8
  });
};