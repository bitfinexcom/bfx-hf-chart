"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _max2 = require("lodash/max");

var _max3 = _interopRequireDefault(_max2);

var _min2 = require("lodash/min");

var _min3 = _interopRequireDefault(_min2);

var _line = require("./line");

var _line2 = _interopRequireDefault(_line);

var _format_axis_tick = require("../util/format_axis_tick");

var _format_axis_tick2 = _interopRequireDefault(_format_axis_tick);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = (canvas, candles, x, height, vpHeight) => {
  const ctx = canvas.getContext('2d');
  ctx.font = `${_config2.default.AXIS_LABEL_FONT_SIZE_PX} ${_config2.default.AXIS_LABEL_FONT_NAME}`;
  ctx.fillStyle = _config2.default.AXIS_LABEL_COLOR;
  ctx.textAlign = 'left';
  (0, _line2.default)(canvas, _config2.default.AXIS_COLOR, [{
    x,
    y: 0
  }, {
    x,
    y: height
  }]);
  const maxP = (0, _max3.default)(candles.map(ohlc => ohlc[3]));
  const minP = (0, _min3.default)(candles.map(ohlc => ohlc[4]));
  const pd = maxP - minP;
  const tickHeightPX = vpHeight / _config2.default.AXIS_Y_TICK_COUNT;
  const tickHeightPrice = pd / _config2.default.AXIS_Y_TICK_COUNT;

  for (let i = 0; i < _config2.default.AXIS_Y_TICK_COUNT; i += 1) {
    const tickY = vpHeight - tickHeightPX * i;
    const tickX = x + _config2.default.AXIS_LABEL_MARGIN_PX;
    const tick = minP + tickHeightPrice * i;
    ctx.fillText((0, _format_axis_tick2.default)(tick), tickX, tickY + _config2.default.AXIS_LABEL_FONT_SIZE_PX / 2, canvas.width - x); // tick

    (0, _line2.default)(canvas, _config2.default.AXIS_TICK_COLOR, [{
      x: tickX - 3,
      y: tickY
    }, {
      x: 0,
      y: tickY
    }]);
  }
};