import drawLine from '../draw/line'
import Drawing from './drawing'

export default class ParallelLineDrawing extends Drawing {
  constructor (chart) {
    super(chart, [{
      keyX: 'start.mts',
      keyY: 'start.price',
    }, {
      keyX: 'end.mts',
      keyY: 'end.price',
    }, {
      keyX: 'parallel.mts',
      keyY: 'parallel.price',
    }])

    this.start = null
    this.end = null
    this.parallel = null
  }

  onMouseDown (x, y) {
    const mts = this.chart.getMTSForRawX(x)
    const price = this.chart.getPriceForRawY(y)

    if (this.active) {
      if (this.end && this.start) {
        this.parallel = { mts, price }
        this.active = false
      } else if (!this.start) {
        this.start = { mts, price }
      } else {
        this.end = { mts, price }
      }
    }

    return super.onMouseDown(x, y)
  }

  render () {
    if (!this.start) {
      return
    }

    const linePoints = []
    const transformer = this.chart.getOHLCTransformer()
    const start = transformer.point(this.start)
    const end = this.end
      ? transformer.point(this.end)
      : transformer.point(this.chart.getOHLCMousePosition())
    const m = (end.y - start.y) / (end.x - start.x)
    const b = start.y - (m * start.x)

    linePoints.push({
      x: 0,
      y: b,
    })

    linePoints.push({
      x: this.chart.vp.size.w,
      y: (m * this.chart.vp.size.w) + b,
    })

    drawLine(this.chart.drawingCanvas, '#fff', linePoints)

    if (this.start && this.end) {
      const pLinePoints = []
      const parallel = this.parallel
        ? transformer.point(this.parallel)
        : transformer.point(this.chart.getOHLCMousePosition())
      const pB = parallel.y - (m * parallel.x)

      pLinePoints.push({
        x: 0,
        y: pB,
      })

      pLinePoints.push({
        x: this.chart.vp.size.w,
        y: (m * this.chart.vp.size.w) + pB,
      })

      drawLine(this.chart.drawingCanvas, '#fff', pLinePoints)
    }

    this.renderAnchors()
  }
}
