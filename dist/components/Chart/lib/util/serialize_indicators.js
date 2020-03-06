"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = indicators => {
  return JSON.stringify(indicators.map(([iClass, iArgs, iColors]) => [iClass.id, iArgs, iColors]));
};