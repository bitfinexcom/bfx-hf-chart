import _max from 'lodash/max'
import _min from 'lodash/min'

import drawLine from './line'
import formatAxisTick from '../util/format_axis_tick'

import CONFIG from '../config'

/**
 * Renders a Y-axis at the specified X coord with dynamic tick rendering based
 * on the provided candle dataset.
 *
 * @param {HTML5Canvas} canvas - target canvas to render on
 * @param {Array[]} candles - candle set in bitfinex format
 * @param {number} x - x position of y axis in px
 * @param {number} height - total axis height in px
 * @param {number} vpHeight - actual viewport height in px
 */
export default (canvas, candles, x, height, vpHeight) => {
  const ctx = canvas.getContext('2d')

  ctx.font = `${CONFIG.AXIS_LABEL_FONT_SIZE_PX} ${CONFIG.AXIS_LABEL_FONT_NAME}`
  ctx.fillStyle = CONFIG.AXIS_LABEL_COLOR
  ctx.textAlign = 'left'

  drawLine(canvas, CONFIG.AXIS_COLOR, [
    { x, y: 0 },
    { x, y: height },
  ])

  const maxP = _max(candles.map(ohlc => ohlc[3]))
  const minP = _min(candles.map(ohlc => ohlc[4]))
  const pd = maxP - minP

  const tickHeightPX = vpHeight / CONFIG.AXIS_Y_TICK_COUNT
  const tickHeightPrice = pd / CONFIG.AXIS_Y_TICK_COUNT

  for (let i = 0; i < CONFIG.AXIS_Y_TICK_COUNT; i += 1) {
    const tickY = vpHeight - (tickHeightPX * i)
    const tickX = x + CONFIG.AXIS_LABEL_MARGIN_PX
    const tick = minP + (tickHeightPrice * i)

    ctx.fillText(formatAxisTick(tick), tickX, tickY + (CONFIG.AXIS_LABEL_FONT_SIZE_PX / 2), canvas.width - x)

    // tick
    drawLine(canvas, CONFIG.AXIS_TICK_COLOR, [
      { x: tickX - 3, y: tickY },
      { x: 0, y: tickY },
    ])
  }
}
