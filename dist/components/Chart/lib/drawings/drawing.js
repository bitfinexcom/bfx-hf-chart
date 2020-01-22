import _get from 'lodash/get';
import _set from 'lodash/set';
import distance from '../util/distance';
const PROXIMITY_LIMIT_PX = 7;
export default class Drawing {
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

      const anchorX = a.keyX === '__mouse' ? this.lastMouseX : transformer.x(_get(this, a.keyX));
      const anchorY = a.keyY === '__mouse' ? this.lastMouseY : transformer.y(_get(this, a.keyY));
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
      const anchorX = a.keyX === '__mouse' ? this.lastMouseX : transformer.x(_get(this, a.keyX));
      const anchorY = a.keyY === '__mouse' ? this.lastMouseY : transformer.y(_get(this, a.keyY));
      a.render = distance(x, y, anchorX, anchorY) < PROXIMITY_LIMIT_PX;

      if (a.moving) {
        if (a.keyX !== '__mouse') {
          _set(this, a.keyX, this.chart.getMTSForRawX(x));
        }

        if (a.keyY !== '__mouse') {
          _set(this, a.keyY, this.chart.getPriceForRawY(y));
        }
      }
    });
  }

}