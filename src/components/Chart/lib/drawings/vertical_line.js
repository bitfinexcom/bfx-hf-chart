import Drawing from './drawing'

export default class VerticalLineDrawing extends Drawing {
  constructor (chart) {
    super(chart, [{
      keyX: 'mts',
      keyY: '__mouse',
    }])

    this.mts = null
  }

  onMouseDown (x, y) {
    if (this.active) {
      this.mts = this.chart.getMTSForRawX(x)
      this.active = false
    }

    return super.onMouseDown(x, y)
  }

  render () {
    if (!this.mts) {
      return
    }

    const ctx = this.chart.drawingCanvas.getContext('2d')
    const transformer = this.chart.getOHLCTransformer()
    const x = transformer.x(this.mts)

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this.chart.vp.size.h)
    ctx.stroke()

    this.renderAnchors()
  }
}
