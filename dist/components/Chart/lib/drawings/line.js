import drawLine from '../draw/line';
import Drawing from './drawing';
export default class LineDrawing extends Drawing {
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

    drawLine(this.chart.drawingCanvas, '#fff', linePoints);
    this.renderAnchors();
  }

}