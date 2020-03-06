"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _last2 = require("lodash/last");

var _last3 = _interopRequireDefault(_last2);

var _max2 = require("lodash/max");

var _max3 = _interopRequireDefault(_max2);

var _min2 = require("lodash/min");

var _min3 = _interopRequireDefault(_min2);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = (ctx, candles, candleWidth, targetWidth, targetHeight, vpWidth) => {
  const rightMTS = (0, _last3.default)(candles)[0];
  const maxVol = (0, _max3.default)(candles.map(ohlc => ohlc[5]));
  const maxP = (0, _max3.default)(candles.map(ohlc => ohlc[3]));
  const minP = (0, _min3.default)(candles.map(ohlc => ohlc[4]));
  const pd = maxP - minP;

  for (let i = 0; i < candles.length; i += 1) {
    const d = candles[i];
    const [mts, o, c, h, l, v] = d;
    const oPX = (o - minP) / pd * targetHeight;
    const hPX = (h - minP) / pd * targetHeight;
    const lPX = (l - minP) / pd * targetHeight;
    const cPX = (c - minP) / pd * targetHeight;
    const x = (targetWidth - (rightMTS - mts)) / targetWidth * (vpWidth - candleWidth / 2);
    const y = targetHeight - (0, _max3.default)([oPX, cPX]); // volume

    ctx.fillStyle = c >= o ? _config2.default.RISING_VOL_FILL : _config2.default.FALLING_VOL_FILL;
    ctx.fillRect(x - candleWidth / 2, targetHeight, candleWidth, -(v / maxVol * targetHeight));
    ctx.fillStyle = c >= o ? _config2.default.RISING_CANDLE_FILL : _config2.default.FALLING_CANDLE_FILL;
    ctx.strokeStyle = ctx.fillStyle; // body

    ctx[c >= o ? 'strokeRect' : 'fillRect'](x - candleWidth / 2, y, candleWidth, (0, _max3.default)([oPX, cPX]) - (0, _min3.default)([oPX, cPX])); // wicks

    ctx.beginPath();
    ctx.moveTo(x, targetHeight - (0, _max3.default)([oPX, cPX]));
    ctx.lineTo(x, targetHeight - hPX);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(x, targetHeight - (0, _min3.default)([oPX, cPX]));
    ctx.lineTo(x, targetHeight - lPX);
    ctx.stroke();
    ctx.closePath();
  }
};