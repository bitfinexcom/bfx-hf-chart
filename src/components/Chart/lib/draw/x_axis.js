import moment from 'moment'
import _last from 'lodash/last'
import { TIME_FRAME_WIDTHS } from 'bfx-hf-util'

import drawLine from './line'
import CONFIG from '../config'

/**
 * Renders an X-axis at the specified y coord with dynamic tick rendering based
 * on the provided candle dataset.
 *
 * @param {HTML5Canvas} canvas - target canvas to render on
 * @param {Array[]} candles - candle set in bitfinex format
 * @param {number} y - y position of x axis in px
 * @param {number} width - width of x axis in px
 * @param {number} vpWidth - total viewport width in px
 */
export default (canvas, candles, y, width, vpWidth) => {
  const ctx = canvas.getContext('2d')

  ctx.font = `${CONFIG.AXIS_LABEL_FONT_SIZE_PX} ${CONFIG.AXIS_LABEL_FONT_NAME}`
  ctx.fillStyle = CONFIG.AXIS_LABEL_COLOR
  ctx.textAlign = 'center'

  // axis line
  drawLine(canvas, CONFIG.AXIS_COLOR, [
    { x: 0, y },
    { x: width, y }
  ])

  // resolve tick width depending on domain
  const rightMTS = _last(candles)[0]
  const leftMTS = candles[0][0]
  const rangeLengthMTS = rightMTS - leftMTS
  const tickWidthPX = vpWidth / CONFIG.AXIS_X_TICK_COUNT
  let ticks = []

  let tickDivisor = 60 * 60 * 1000 // 1hr by default, overriden below
  const dayCount = rangeLengthMTS / TIME_FRAME_WIDTHS['1D']

  if (dayCount > 30) {
    tickDivisor = 30 * 24 * 60 * 60 * 1000
  } else if (dayCount > 1) {
    tickDivisor = 24 * 60 * 60 * 1000
  } else {
    const hourCount = rangeLengthMTS / TIME_FRAME_WIDTHS['1h']

    if (hourCount > 1 && hourCount < CONFIG.AXIS_X_TICK_COUNT) {
      tickDivisor = 60 * 60 * 1000
    }
  }

  // generate ticks
  const paddedLeftMTS = leftMTS - (leftMTS % tickDivisor)

  for (let i = 0; i < (rangeLengthMTS / tickDivisor); i += 1) {
    ticks.push(paddedLeftMTS + (i * tickDivisor))

    if (paddedLeftMTS + ((i + 1) * tickDivisor) > rightMTS) {
      break
    }
  }

  let previousTick

  // render ticks
  for (let i = 0; i < ticks.length; i += 1) {
    const mts = ticks[i] // (tickWidthMTS * i) + leftMTS
    const tickX = (((width - (rightMTS - mts)) / width) * vpWidth)
    const tickY = y + CONFIG.AXIS_LABEL_FONT_SIZE_PX + CONFIG.AXIS_LABEL_MARGIN_PX
    const date = new Date(mts)
    let label

    if (previousTick && previousTick.getDay() === date.getDay()) {
      label = moment(date).format('HH:mm')
    } else {
      label = moment(date).format('DD/MM')
    }

    ctx.fillText(label, tickX, tickY, tickWidthPX)

    // tick
    drawLine(canvas, CONFIG.AXIS_TICK_COLOR, [
      { x: tickX, y: tickY - CONFIG.AXIS_LABEL_FONT_SIZE_PX },
      { x: tickX, y: 0 },
    ])

    previousTick = date
  }
}
