"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require("react-virtualized");

var _Chart = require("./components/Chart");

var _Chart2 = _interopRequireDefault(_Chart);

var _btc_candle_data = require("./btc_candle_data.json");

var _btc_candle_data2 = _interopRequireDefault(_btc_candle_data);

require("./Demo.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const INDICATORS_STORAGE_KEY = 'bfxc-demo-indicators';
const DEFAULT_INDICATORS_JSON = '[["ema",[20,"close"],["#2da3c4"]],["ema",[100,"close"],["#fcfcba"]],["macd",[12,26,9],["#2acca1","#02f73b","#1073ba"]],["rsi",[14],["#7320bc"]],["mo",[10],["#f8fc0a"]],["acc",[10],["#b4e560"]]]';

_btc_candle_data2.default.sort((a, b) => a[0] - b[0]);

class Demo extends _react2.default.PureComponent {
  static loadIndicators() {
    if (!localStorage) {
      return [];
    }

    try {
      return _Chart2.default.unserializeIndicators(localStorage.getItem(INDICATORS_STORAGE_KEY) || DEFAULT_INDICATORS_JSON);
    } catch {
      return [];
    }
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      drawings: [],
      indicators: []
    });

    this.onUpdateIndicatorArgs = this.onUpdateIndicatorArgs.bind(this);
    this.onDeleteIndicator = this.onDeleteIndicator.bind(this);
    this.onAddIndicator = this.onAddIndicator.bind(this);
    this.onAddDrawing = this.onAddDrawing.bind(this);
    this.chartRef = _react2.default.createRef();
    this.state.indicators = Demo.loadIndicators();
  }

  onAddIndicator(i) {
    this.setState(({
      indicators
    }) => ({
      indicators: [...indicators, i]
    }));
    this.deferSaveState();
  }

  onAddDrawing(D) {
    this.setState(({
      drawings
    }) => ({
      drawings: [new D(this.chartRef.current.chart), ...drawings]
    }));
  }

  onDeleteIndicator(index) {
    this.setState(({
      indicators
    }) => {
      const nextIndicators = [...indicators];
      nextIndicators.splice(index, 1);
      return {
        indicators: nextIndicators
      };
    });
    this.deferSaveState();
  }

  onUpdateIndicatorArgs(args, index) {
    this.setState(({
      indicators
    }) => {
      const nextIndicators = [...indicators];
      const nextIndicator = [...nextIndicators[index]];
      nextIndicator[1] = args;
      nextIndicators[index] = nextIndicator;
      return {
        indicators: nextIndicators
      };
    });
    this.deferSaveState();
  }

  deferSaveState() {
    setTimeout(() => {
      this.saveState();
    }, 0);
  }

  saveState() {
    if (!localStorage) {
      return;
    }

    const {
      indicators
    } = this.state;
    localStorage.setItem(INDICATORS_STORAGE_KEY, _Chart2.default.serializeIndicators(indicators));
  }

  render() {
    const {
      drawings,
      indicators
    } = this.state;
    return _react2.default.createElement("div", {
      id: "bitfinex-chart-demo__bfxc"
    }, _react2.default.createElement(_reactVirtualized.AutoSizer, null, ({
      width,
      height
    }) => _react2.default.createElement(_Chart2.default, {
      ref: this.chartRef,
      indicators: indicators,
      drawings: drawings,
      marketLabel: "BTC/USD",
      candles: _btc_candle_data2.default,
      candleWidth: "1m",
      width: width,
      height: height,
      disableToolbar: true,
      onUpdateIndicatorArgs: this.onUpdateIndicatorArgs,
      onDeleteIndicator: this.onDeleteIndicator,
      onAddIndicator: this.onAddIndicator,
      onAddDrawing: this.onAddDrawing
    })));
  }

}

exports.default = Demo;