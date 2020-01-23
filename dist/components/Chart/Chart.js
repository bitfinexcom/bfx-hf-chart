function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import ClassNames from 'classnames';
import { TIME_FRAME_WIDTHS } from 'bfx-hf-util';
import HFI from 'bfx-hf-indicators';
import randomColor from 'randomcolor';
import Dropdown from '../Dropdown';
import ChartLib from './lib/chart';
import formatAxisTick from './lib/util/format_axis_tick';
import LineDrawing from './lib/drawings/line';
import HorizontalLineDrawing from './lib/drawings/horizontal_line';
import VerticalLineDrawing from './lib/drawings/vertical_line';
import ParallelLineDrawing from './lib/drawings/parallel_lines';
import serializeIndicators from './lib/util/serialize_indicators';
import unserializeIndicators from './lib/util/unserialize_indicators';
import LoadingBeeSpinner from '../LoadingBeeSpinner';
import IndicatorSettingsModal from '../IndicatorSettingsModal';
import './Chart.css';
import './icon_font/styles.css';
const TOPBAR_HEIGHT = 45;
const TOOLBAR_HEIGHT = 45; // Library methods are made available on the class before export
// (to maintain CRA index.js)

class Chart extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      hoveredCandle: null,
      indicatorSettings: [],
      settingsModalOpen: false,
      settingsModalIndicatorIndex: -1,
      isFullscreen: false
    });

    this.onHoveredCandle = this.onHoveredCandle.bind(this);
    this.onCloseIndicatorSettings = this.onCloseIndicatorSettings.bind(this);
    this.onOpenIndicatorSettings = this.onOpenIndicatorSettings.bind(this);
    this.onUpdateIndicatorSettings = this.onUpdateIndicatorSettings.bind(this);
    this.onSaveIndicatorSettings = this.onSaveIndicatorSettings.bind(this);
    this.onToggleFullscreen = this.onToggleFullscreen.bind(this);
    this.onFullscreenExit = this.onFullscreenExit.bind(this);
    this.wrapperRef = React.createRef();
    this.ohlcCanvasRef = React.createRef();
    this.axisCanvasRef = React.createRef();
    this.drawingCanvasRef = React.createRef();
    this.indicatorCanvasRef = React.createRef();
    this.crosshairCanvasRef = React.createRef();
    this.chart = null;
  }

  componentDidMount() {
    const {
      width,
      height,
      onLoadMore,
      indicators,
      candles,
      candleWidth,
      trades,
      config,
      onTimeFrameChange,
      orders,
      position,
      marketLabel
    } = this.props;
    document.addEventListener('fullscreenchange', this.onFullscreenExit, false);
    document.addEventListener('mozfullscreenchange', this.onFullscreenExit, false);
    document.addEventListener('MSFullscreenChange', this.onFullscreenExit, false);
    document.addEventListener('webkitfullscreenchange', this.onFullscreenExit, false);
    const ohlcCanvas = this.ohlcCanvasRef.current;
    const axisCanvas = this.axisCanvasRef.current;
    const drawingCanvas = this.drawingCanvasRef.current;
    const indicatorCanvas = this.indicatorCanvasRef.current;
    const crosshairCanvas = this.crosshairCanvasRef.current;

    if (!ohlcCanvas || !axisCanvas || !drawingCanvas || !indicatorCanvas || !crosshairCanvas) {
      console.error('mounted without all canvases!');
      return;
    }

    if (this.chart) {
      console.error('chart library initialized before mount!');
      return;
    }

    this.chart = new ChartLib({
      ohlcCanvas,
      axisCanvas,
      drawingCanvas,
      indicatorCanvas,
      crosshairCanvas,
      indicators,
      onLoadMoreCB: onLoadMore,
      onTimeFrameChangeCB: onTimeFrameChange,
      onHoveredCandleCB: this.onHoveredCandle,
      onUpdateIndicatorSettingsCB: this.onUpdateIndicatorSettings,
      data: candles,
      dataKey: `${marketLabel}${candleWidth}`,
      dataWidth: candleWidth,
      trades,
      orders,
      position,
      width,
      height: height - this.getTopReservedSpace(),
      config
    });
  }

  componentDidUpdate(prevProps) {
    const {
      isFullscreen
    } = this.state;
    const {
      candles,
      width,
      height,
      trades,
      indicators,
      drawings,
      candleWidth,
      orders,
      position,
      disableToolbar,
      disableTopbar,
      marketLabel
    } = this.props;

    if (candles !== prevProps.candles || candleWidth !== prevProps.candleWidth) {
      this.chart.updateData(candles, candleWidth, `${marketLabel}${candleWidth}`);
    }

    if (width !== prevProps.width || height !== prevProps.height || disableToolbar !== prevProps.disableToolbar || disableTopbar !== prevProps.disableTopbar) {
      if (isFullscreen) {
        this.chart.updateDimensions(window.innerWidth, this.getChartHeight());
      } else {
        this.chart.updateDimensions(width, this.getChartHeight());
      }
    }

    if (trades !== prevProps.trades) {
      this.chart.updateTrades(trades);
    }

    if (indicators !== prevProps.indicators) {
      this.chart.updateIndicators(indicators);
    }

    if (drawings !== prevProps.drawings) {
      this.chart.updateDrawings(drawings);
    }

    if (orders !== prevProps.orders) {
      this.chart.updateOrders(orders);
    }

    if (position !== prevProps.position) {
      this.chart.updatePosition(position);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.onFullscreenExit);
    document.removeEventListener('mozfullscreenchange', this.onFullscreenExit);
    document.removeEventListener('MSFullscreenChange', this.onFullscreenExit);
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenExit);
  }

  onHoveredCandle(hoveredCandle) {
    this.setState(() => ({
      hoveredCandle
    }));
  }
  /**
   * @param {Array[]} indicators - array of [iClass, args]
   * @param {number} ohlcVPHeight - height of OHLC viewport
   * @param {number} slotHeight - external indicator slot height
   */


  onUpdateIndicatorSettings(indicators, slotHeight) {
    const extCount = indicators.filter(([Class]) => Class.ui.position === 'external').length;
    let currentExtSlot = 0;
    let currentOverlaySlot = 0;
    const indicatorSettings = indicators.map(([Class, args, colors]) => {
      const {
        ui
      } = Class;
      const {
        position
      } = ui;
      return {
        args,
        argsDef: Class.args,
        position,
        colors,
        name: new Class(args).getName(),
        bottom: position !== 'external' ? slotHeight * extCount + 82 + 32 * currentOverlaySlot++ : slotHeight * (extCount - ++currentExtSlot) + slotHeight
      };
    });
    this.setState(() => ({
      indicatorSettings
    }));
  }

  onOpenIndicatorSettings(index) {
    this.setState(() => ({
      settingsModalOpen: true,
      settingsModalIndicatorIndex: index
    }));
  }

  onCloseIndicatorSettings() {
    this.setState(() => ({
      settingsModalOpen: false,
      settingsModalIndicatorIndex: -1
    }));
  }

  onSaveIndicatorSettings(args) {
    const {
      onUpdateIndicatorArgs
    } = this.props;
    const {
      settingsModalIndicatorIndex
    } = this.state;
    onUpdateIndicatorArgs(args, settingsModalIndicatorIndex);
    this.onCloseIndicatorSettings();
  }

  onToggleFullscreen() {
    if (!document.fullscreenElement && !document.mozFullscreenElement && !document.msFullscreenElement && !document.webkitFullscreenElement) {
      if (this.wrapperRef.current) {
        this.setState(() => ({
          isFullscreen: true
        }));
        setTimeout(() => {
          this.wrapperRef.current.requestFullscreen();
          this.chart.updateDimensions(window.innerWidth, window.innerHeight);
        }, 0);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); // see onFullscreenExit()
      }
    }
  }

  onFullscreenExit() {
    if (document.fullscreenElement || document.mozFullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement) {
      return;
    }

    const {
      width
    } = this.props;
    this.setState(() => ({
      isFullscreen: false
    }));
    this.chart.updateDimensions(width, this.getChartHeight());
  }

  onAddIndicator(i) {
    const {
      onAddIndicator
    } = this.props;

    if (!onAddIndicator) {
      return;
    }

    const {
      ui
    } = i;
    const {
      type
    } = ui;
    const args = i.args.map(a => a.default);
    const colors = [];

    switch (type) {
      case 'rsi':
      case 'line':
        {
          colors.push(randomColor());
          break;
        }

      case 'lines':
        {
          ui.lines.forEach(() => colors.push(randomColor()));
          break;
        }

      case 'bbands':
        {
          colors.push(randomColor());
          colors.push('#fff');
          colors.push(randomColor());
          break;
        }

      case 'macd':
        {
          colors.push(randomColor());
          colors.push(randomColor());
          colors.push(randomColor());
          break;
        }

      default:
        {
          throw new Error(`unknown indicator type: ${type}`);
        }
    }

    onAddIndicator([i, args, colors]);
  }

  getTopReservedSpace() {
    const {
      disableTopbar,
      disableToolbar
    } = this.props;
    let space = 0;

    if (!disableToolbar) {
      space += TOOLBAR_HEIGHT;
    }

    if (!disableTopbar) {
      space += TOPBAR_HEIGHT;
    }

    return space;
  }

  getChartHeight() {
    const {
      isFullscreen
    } = this.state;
    const height = isFullscreen ? window.innerHeight : this.props.height;
    return height - this.getTopReservedSpace();
  }

  render() {
    const {
      indicatorSettings,
      settingsModalIndicatorIndex,
      settingsModalOpen,
      isFullscreen
    } = this.state;
    const {
      marketLabel,
      bgColor = '#000',
      candleWidth,
      candles,
      onTimeFrameChange,
      onAddDrawing,
      isSyncing,
      disableToolbar,
      disableTopbar,
      onDeleteIndicator,
      disableIndicators,
      candleLoadingThreshold = 0
    } = this.props;
    const height = isFullscreen ? window.innerHeight : this.props.height;
    const width = isFullscreen ? window.innerWidth : this.props.width;
    const {
      hoveredCandle
    } = this.state;
    const topReservedSpace = this.getTopReservedSpace();
    const renderHeight = this.getChartHeight();
    const canvasStyle = {
      top: `${topReservedSpace}px`
    };
    return React.createElement("div", {
      ref: this.wrapperRef,
      className: "bfxc__wrapper",
      style: {
        width: `${width}px`,
        height: `${height}px`
      }
    }, React.createElement("div", {
      className: "bfxc__bg",
      style: {
        width,
        height: renderHeight,
        background: bgColor,
        top: `${topReservedSpace}px`
      }
    }), !disableTopbar && React.createElement("div", {
      className: "bfxc__topbar"
    }, React.createElement("p", {
      className: "bfxcs__topbar-market"
    }, marketLabel), React.createElement("div", {
      className: "bfxcs__topbar-ohlc bfxcs__topbar-section"
    }, React.createElement("div", {
      className: "bfxcs__topbar-ohlc-entry"
    }, React.createElement("p", null, "O"), React.createElement("p", null, hoveredCandle ? formatAxisTick(hoveredCandle[1]) : '-')), React.createElement("div", {
      className: "bfxcs__topbar-ohlc-entry"
    }, React.createElement("p", null, "H"), React.createElement("p", null, hoveredCandle ? formatAxisTick(hoveredCandle[3]) : '-')), React.createElement("div", {
      className: "bfxcs__topbar-ohlc-entry"
    }, React.createElement("p", null, "L"), React.createElement("p", null, hoveredCandle ? formatAxisTick(hoveredCandle[4]) : '-')), React.createElement("div", {
      className: "bfxcs__topbar-ohlc-entry"
    }, React.createElement("p", null, "C"), React.createElement("p", null, hoveredCandle ? formatAxisTick(hoveredCandle[2]) : '-'))), React.createElement("div", {
      className: "bfxcs__topbar-tfs bfxcs__topbar-section"
    }, Object.keys(TIME_FRAME_WIDTHS).map(tf => React.createElement("p", {
      key: tf,
      className: ClassNames({
        active: tf === candleWidth
      }),
      onClick: () => onTimeFrameChange && onTimeFrameChange(tf)
    }, tf))), !disableIndicators && React.createElement("div", {
      className: "bfxc__topbar-indicators bfxcs__topbar-section"
    }, React.createElement(Dropdown, {
      label: React.createElement("span", null, React.createElement("i", {
        className: "icon-indicators"
      }), "Indicators", React.createElement("i", {
        className: "icon-chevron-down-passive"
      }))
    }, React.createElement("ul", null, Object.values(HFI).filter(i => !!i.label).map(i => React.createElement("li", {
      key: i.id,
      onClick: () => this.onAddIndicator(i)
    }, i.humanLabel))))), React.createElement("div", {
      className: "bfxcs__topbar-fullscreen"
    }, React.createElement("i", {
      className: "icon-move",
      onClick: this.onToggleFullscreen
    })), isSyncing && React.createElement("div", {
      className: "bfxc__topbar-spinner"
    })), !disableToolbar && React.createElement("ul", {
      className: "bfxc__toolbar"
    }, React.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(LineDrawing)
    }, "Line"), React.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(HorizontalLineDrawing)
    }, "HLine"), React.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(VerticalLineDrawing)
    }, "VLine"), React.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(ParallelLineDrawing)
    }, "PLines")), React.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.axisCanvasRef,
      style: canvasStyle
    }), React.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.ohlcCanvasRef,
      style: canvasStyle
    }), React.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.indicatorCanvasRef,
      style: canvasStyle
    }), React.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.drawingCanvasRef,
      style: canvasStyle
    }), React.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.crosshairCanvasRef,
      style: canvasStyle
    }), candles.length > candleLoadingThreshold && indicatorSettings.length > 0 && React.createElement("ul", {
      className: "bfxc__overlaysettings-wrapper"
    }, indicatorSettings.map((settings, i) => React.createElement("li", {
      key: i,
      style: {
        borderColor: `${settings.colors[0]}99`,
        bottom: `${settings.bottom}px`,
        left: 32
      }
    }, React.createElement("p", null, settings.name), React.createElement("i", {
      className: "icon-settings",
      onClick: () => this.onOpenIndicatorSettings(i)
    }), React.createElement("i", {
      className: "icon-delete",
      onClick: () => onDeleteIndicator(i)
    })))), settingsModalOpen && React.createElement(IndicatorSettingsModal, {
      settings: indicatorSettings[settingsModalIndicatorIndex],
      onClose: this.onCloseIndicatorSettings,
      onSave: this.onSaveIndicatorSettings,
      onDelete: () => {
        onDeleteIndicator(settingsModalIndicatorIndex);
        this.onCloseIndicatorSettings();
      }
    }), candles.length <= candleLoadingThreshold && React.createElement(LoadingBeeSpinner, {
      top: this.getTopReservedSpace()
    }));
  }

}

Chart.serializeIndicators = serializeIndicators;
Chart.unserializeIndicators = unserializeIndicators;
export default Chart;