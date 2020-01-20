import Drawing from './drawing'

export default class HorizontalLineDrawing extends Drawing {
  constructor (chart) {
    super(chart, [{
      keyX: '__mouse',
      keyY: 'price',
    }])

    this.price = null
  }

  onMouseDown (x, y) {
    if (this.active) {
      this.price = this.chart.getPriceForRawY(y)
      this.active = false
    }

    return super.onMouseDown(x, y)
  }

  render () {
    if (!this.price) {
      return
    }

    const ctx = this.chart.drawingCanvas.getContext('2d')
    const transformer = this.chart.getOHLCTransformer()
    const y = transformer.y(this.price)

    ctx.strokeStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(this.chart.vp.size.w, y)
    ctx.stroke()

    this.renderAnchors()
  }
}
