"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _line = require("../draw/line");

var _line2 = _interopRequireDefault(_line);

var _drawing = require("./drawing");

var _drawing2 = _interopRequireDefault(_drawing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LineDrawing extends _drawing2.default {
  constructor(chart) {
    super(chart, [{
      keyX: 'start.mts',
      keyY: 'start.price'
    }, {
      keyX: 'end.mts',
      keyY: 'end.price'
    }]);
    this.start = null;
    this.end = null;
  }

  onMouseDown(x, y) {
    const mts = this.chart.getMTSForRawX(x);
    const price = this.chart.getPriceForRawY(y);

    if (this.active) {
      if (!this.start) {
        this.start = {
          mts,
          price
        };
      } else {
        this.end = {
          mts,
          price
        };
        this.active = false;
      }
    }

    return super.onMouseDown(x, y);
  }

  render() {
    if (!this.start) {
      return;
    }

    const transformer = this.chart.getOHLCTransformer();
    const linePoints = [];
    linePoints.push(transformer.point(this.start));

    if (!this.end) {
      linePoints.push(transformer.point(this.chart.getOHLCMousePosition()));
    } else {
      linePoints.push(transformer.point(this.end));
    }

    (0, _line2.default)(this.chart.drawingCanvas, '#fff', linePoints);
    this.renderAnchors();
  }

}

exports.default = LineDrawing;