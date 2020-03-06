"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _last2 = require("lodash/last");

var _last3 = _interopRequireDefault(_last2);

var _bfxHfUtil = require("bfx-hf-util");

var _line = require("./line");

var _line2 = _interopRequireDefault(_line);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders an X-axis at the specified y coord with dynamic tick rendering based
 * on the provided candle dataset.
 *
 * @param {HTML5Canvas} canvas - target canvas to render on
 * @param {Array[]} candles - candle set in bitfinex format
 * @param {number} y - y position of x axis in px
 * @param {number} width - width of x axis in ms (time)
 * @param {number} vpWidth - total viewport width in px
 */
exports.default = (canvas, candles, y, width, vpWidth) => {
  const ctx = canvas.getContext('2d');
  ctx.font = `${_config2.default.AXIS_LABEL_FONT_SIZE_PX} ${_config2.default.AXIS_LABEL_FONT_NAME}`;
  ctx.fillStyle = _config2.default.AXIS_LABEL_COLOR;
  ctx.textAlign = 'center'; // axis line

  (0, _line2.default)(canvas, _config2.default.AXIS_COLOR, [{
    x: 0,
    y
  }, {
    x: vpWidth,
    y
  }]); // resolve tick width depending on domain

  const rightMTS = (0, _last3.default)(candles)[0];
  const leftMTS = candles[0][0];
  const rangeLengthMTS = rightMTS - leftMTS;
  const tickWidthPX = vpWidth / _config2.default.AXIS_X_TICK_COUNT;
  let ticks = [];
  let tickDivisor = 60 * 60 * 1000; // 1hr by default, overriden below

  const dayCount = rangeLengthMTS / _bfxHfUtil.TIME_FRAME_WIDTHS['1D'];

  if (dayCount > 30) {
    tickDivisor = 30 * 24 * 60 * 60 * 1000;
  } else if (dayCount > 1) {
    tickDivisor = 24 * 60 * 60 * 1000;
  } else {
    const hourCount = rangeLengthMTS / _bfxHfUtil.TIME_FRAME_WIDTHS['1h'];

    if (hourCount > 1 && hourCount < _config2.default.AXIS_X_TICK_COUNT) {
      tickDivisor = 60 * 60 * 1000;
    }
  } // generate ticks


  const paddedLeftMTS = leftMTS - leftMTS % tickDivisor;

  for (let i = 0; i < rangeLengthMTS / tickDivisor; i += 1) {
    ticks.push(paddedLeftMTS + i * tickDivisor);

    if (paddedLeftMTS + (i + 1) * tickDivisor > rightMTS) {
      break;
    }
  }

  let previousTick; // render ticks

  for (let i = 0; i < ticks.length; i += 1) {
    const mts = ticks[i]; // (tickWidthMTS * i) + leftMTS

    const tickX = (width - (rightMTS - mts)) / width * vpWidth;
    const tickY = y + _config2.default.AXIS_LABEL_FONT_SIZE_PX + _config2.default.AXIS_LABEL_MARGIN_PX;
    const date = new Date(mts);
    let label;

    if (previousTick && previousTick.getDay() === date.getDay()) {
      label = (0, _moment2.default)(date).format('HH:mm');
    } else {
      label = (0, _moment2.default)(date).format('DD/MM');
    }

    ctx.fillText(label, tickX, tickY, tickWidthPX); // tick

    (0, _line2.default)(canvas, _config2.default.AXIS_TICK_COLOR, [{
      x: tickX,
      y: tickY - _config2.default.AXIS_LABEL_FONT_SIZE_PX
    }, {
      x: tickX,
      y: 0
    }]);
    previousTick = date;
  }
};