function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { AutoSizer } from 'react-virtualized';
import BFXI from 'bfx-hf-indicators';
import Chart from './components/Chart';
import MockCandleData from './btc_candle_data.json';
import './Demo.css';
const INDICATORS_STORAGE_KEY = 'bfxc-demo-indicators';
const DEFAULT_INDICATORS_JSON = '[["ema",[20,"close"],["#2da3c4"]],["ema",[100,"close"],["#fcfcba"]],["macd",[12,26,9],["#2acca1","#02f73b","#1073ba"]],["rsi",[14],["#7320bc"]],["mo",[10],["#f8fc0a"]],["acc",[10],["#b4e560"]]]';
MockCandleData.sort((a, b) => a[0] - b[0]);
export default class Demo extends React.PureComponent {
  static loadIndicators() {
    if (!localStorage) {
      return [];
    }

    try {
      return JSON.parse(localStorage.getItem(INDICATORS_STORAGE_KEY) || DEFAULT_INDICATORS_JSON).map(([iClassID, iArgs, iColors]) => [Object.values(BFXI).find(i => i.id === iClassID), iArgs, iColors]);
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
    this.chartRef = React.createRef();
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
    const stored = indicators.map(([iClass, iArgs, iColors]) => [iClass.id, iArgs, iColors]);
    localStorage.setItem(INDICATORS_STORAGE_KEY, JSON.stringify(stored));
  }

  render() {
    const {
      drawings,
      indicators
    } = this.state;
    return React.createElement("div", {
      id: "bitfinex-chart-demo__bfxc"
    }, React.createElement(AutoSizer, null, ({
      width,
      height
    }) => React.createElement(Chart, {
      ref: this.chartRef,
      indicators: indicators,
      drawings: drawings,
      marketLabel: "BTC/USD",
      candles: MockCandleData,
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