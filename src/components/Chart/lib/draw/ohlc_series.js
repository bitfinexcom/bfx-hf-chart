import _last from 'lodash/last'
import _max from 'lodash/max'
import _min from 'lodash/min'
import CONFIG from '../config'

const { 
  RISING_CANDLE_FILL,
  RISING_VOL_FILL,
  FALLING_CANDLE_FILL,
  FALLING_VOL_FILL,
} = CONFIG

/**
 * Renders a series of candles on the target 2D context, using the specified
 * viewport dimensions (scaled appropriately)
 *
 * @param {Context2D} ctx - target rendering context
 * @param {Array[]} candles - candles in bitfinex format
 * @param {number} candleWidth - width of each candle in px
 * @param {number} targetWidth - candle viewport width in px
 * @param {number} targetHeight - candle viewport height in px
 * @param {number} vpWidth - actual viewport width in px
 */
export default (ctx, candles, candleWidth, targetWidth, targetHeight, vpWidth) => {
  const rightMTS = _last(candles)[0]
  const maxVol = _max(candles.map(ohlc => ohlc[5]))
  const maxP = _max(candles.map(ohlc => ohlc[3]))
  const minP = _min(candles.map(ohlc => ohlc[4]))
  const pd = maxP - minP

  for (let i = 0; i < candles.length; i += 1) {
    const d = candles[i]
    const [mts, o, c, h, l, v] = d

    const oPX = ((o - minP) / pd) * targetHeight
    const hPX = ((h - minP) / pd) * targetHeight
    const lPX = ((l - minP) / pd) * targetHeight
    const cPX = ((c - minP) / pd) * targetHeight

    const x = (((targetWidth - (rightMTS - mts)) / targetWidth) * (vpWidth - (candleWidth / 2)))
    const y = targetHeight - _max([oPX, cPX])

    // volume
    ctx.fillStyle = c >= o
      ? RISING_VOL_FILL
      : FALLING_VOL_FILL

    ctx.fillRect(
      x - (candleWidth / 2),
      targetHeight,
      candleWidth,
      -((v / maxVol) * targetHeight)
    )

    ctx.fillStyle = c >= o ? RISING_CANDLE_FILL : FALLING_CANDLE_FILL
    ctx.strokeStyle = ctx.fillStyle

    // body
    ctx[c >= o ? 'strokeRect' : 'fillRect'](
      x - (candleWidth / 2),
      y,
      candleWidth,
      _max([oPX, cPX]) - _min([oPX, cPX])
    )

    // wicks
    ctx.beginPath()
    ctx.moveTo(x, targetHeight - _max([oPX, cPX]))
    ctx.lineTo(x, targetHeight - hPX)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(x, targetHeight - _min([oPX, cPX]))
    ctx.lineTo(x, targetHeight - lPX)
    ctx.stroke()
    ctx.closePath()
  }
}
