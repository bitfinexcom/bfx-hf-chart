"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drawing = require("./drawing");

var _drawing2 = _interopRequireDefault(_drawing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HorizontalLineDrawing extends _drawing2.default {
  constructor(chart) {
    super(chart, [{
      keyX: '__mouse',
      keyY: 'price'
    }]);
    this.price = null;
  }

  onMouseDown(x, y) {
    if (this.active) {
      this.price = this.chart.getPriceForRawY(y);
      this.active = false;
    }

    return super.onMouseDown(x, y);
  }

  render() {
    if (!this.price) {
      return;
    }

    const ctx = this.chart.drawingCanvas.getContext('2d');
    const transformer = this.chart.getOHLCTransformer();
    const y = transformer.y(this.price);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.chart.vp.size.w, y);
    ctx.stroke();
    this.renderAnchors();
  }

}

exports.default = HorizontalLineDrawing;