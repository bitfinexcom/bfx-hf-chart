"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require("lodash/get");

var _get3 = _interopRequireDefault(_get2);

var _set2 = require("lodash/set");

var _set3 = _interopRequireDefault(_set2);

var _distance = require("../util/distance");

var _distance2 = _interopRequireDefault(_distance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PROXIMITY_LIMIT_PX = 7;

class Drawing {
  constructor(chart, anchors = []) {
    this.chart = chart;
    this.anchors = anchors;
    this.active = true;
    this.anchors.forEach(a => {
      a.moving = false;
      a.render = false;
    });
  }

  isActive() {
    return this.active;
  }

  render() {}

  renderAnchors() {
    const ctx = this.chart.drawingCanvas.getContext('2d');
    const transformer = this.chart.getOHLCTransformer();
    ctx.strokeStyle = '#fff';
    this.anchors.forEach(a => {
      if (!a.render) {
        return;
      }

      const anchorX = a.keyX === '__mouse' ? this.lastMouseX : transformer.x((0, _get3.default)(this, a.keyX));
      const anchorY = a.keyY === '__mouse' ? this.lastMouseY : transformer.y((0, _get3.default)(this, a.keyY));
      ctx.beginPath();
      ctx.arc(anchorX, anchorY, PROXIMITY_LIMIT_PX, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }

  onMouseUp() {
    this.anchors.forEach(a => a.moving = false);
  }

  onMouseDown(x, y) {
    let hasMovingAnchor = false;
    this.anchors.forEach(a => {
      a.moving = a.render;

      if (a.moving) {
        hasMovingAnchor = true;
      }
    });
    return hasMovingAnchor;
  }

  onMouseMove(x, y) {
    this.lastMouseX = x;
    this.lastMouseY = y;
    const transformer = this.chart.getOHLCTransformer();
    this.anchors.forEach(a => {
      const anchorX = a.keyX === '__mouse' ? this.lastMouseX : transformer.x((0, _get3.default)(this, a.keyX));
      const anchorY = a.keyY === '__mouse' ? this.lastMouseY : transformer.y((0, _get3.default)(this, a.keyY));
      a.render = (0, _distance2.default)(x, y, anchorX, anchorY) < PROXIMITY_LIMIT_PX;

      if (a.moving) {
        if (a.keyX !== '__mouse') {
          (0, _set3.default)(this, a.keyX, this.chart.getMTSForRawX(x));
        }

        if (a.keyY !== '__mouse') {
          (0, _set3.default)(this, a.keyY, this.chart.getPriceForRawY(y));
        }
      }
    });
  }

}

exports.default = Drawing;