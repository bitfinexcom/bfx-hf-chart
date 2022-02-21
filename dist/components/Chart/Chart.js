"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _bfxHfUtil = require("bfx-hf-util");

var _bfxHfIndicators = require("bfx-hf-indicators");

var _bfxHfIndicators2 = _interopRequireDefault(_bfxHfIndicators);

var _randomcolor = require("randomcolor");

var _randomcolor2 = _interopRequireDefault(_randomcolor);

var _Dropdown = require("../Dropdown");

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _chart = require("./lib/chart");

var _chart2 = _interopRequireDefault(_chart);

var _line = require("./lib/drawings/line");

var _line2 = _interopRequireDefault(_line);

var _horizontal_line = require("./lib/drawings/horizontal_line");

var _horizontal_line2 = _interopRequireDefault(_horizontal_line);

var _vertical_line = require("./lib/drawings/vertical_line");

var _vertical_line2 = _interopRequireDefault(_vertical_line);

var _parallel_lines = require("./lib/drawings/parallel_lines");

var _parallel_lines2 = _interopRequireDefault(_parallel_lines);

var _serialize_indicators = require("./lib/util/serialize_indicators");

var _serialize_indicators2 = _interopRequireDefault(_serialize_indicators);

var _unserialize_indicators = require("./lib/util/unserialize_indicators");

var _unserialize_indicators2 = _interopRequireDefault(_unserialize_indicators);

var _LoadingBeeSpinner = require("../LoadingBeeSpinner");

var _LoadingBeeSpinner2 = _interopRequireDefault(_LoadingBeeSpinner);

var _IndicatorSettingsModal = require("../IndicatorSettingsModal");

var _IndicatorSettingsModal2 = _interopRequireDefault(_IndicatorSettingsModal);

require("./Chart.css");

require("./icon_font/styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TOPBAR_HEIGHT = 45;
const TOOLBAR_HEIGHT = 45; // Library methods are made available on the class before export
// (to maintain CRA index.js)

class Chart extends _react2.default.Component {
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
    this.wrapperRef = _react2.default.createRef();
    this.ohlcCanvasRef = _react2.default.createRef();
    this.axisCanvasRef = _react2.default.createRef();
    this.drawingCanvasRef = _react2.default.createRef();
    this.indicatorCanvasRef = _react2.default.createRef();
    this.crosshairCanvasRef = _react2.default.createRef();
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

    this.chart = new _chart2.default({
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
          colors.push((0, _randomcolor2.default)());
          break;
        }

      case 'lines':
        {
          ui.lines.forEach(() => colors.push((0, _randomcolor2.default)()));
          break;
        }

      case 'bbands':
        {
          colors.push((0, _randomcolor2.default)());
          colors.push('#fff');
          colors.push((0, _randomcolor2.default)());
          break;
        }

      case 'macd':
        {
          colors.push((0, _randomcolor2.default)());
          colors.push((0, _randomcolor2.default)());
          colors.push((0, _randomcolor2.default)());
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
      candleLoadingThreshold = 0,
      extraHeaderComponentsLeft,
      extraHeaderComponentsRight,
      showMarketLabel
    } = this.props;
    const height = isFullscreen ? window.innerHeight : this.props.height;
    const width = isFullscreen ? window.innerWidth : this.props.width;
    const topReservedSpace = this.getTopReservedSpace();
    const renderHeight = this.getChartHeight();
    const canvasStyle = {
      top: `${topReservedSpace}px`
    };
    return /*#__PURE__*/_react2.default.createElement("div", {
      ref: this.wrapperRef,
      className: "bfxc__wrapper",
      style: {
        width: `${width}px`,
        height: `${height}px`
      }
    }, /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__bg",
      style: {
        width,
        height: renderHeight,
        background: bgColor,
        top: `${topReservedSpace}px`
      }
    }), !disableTopbar && /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__topbar"
    }, extraHeaderComponentsLeft, showMarketLabel && /*#__PURE__*/_react2.default.createElement("p", {
      className: "bfxcs__topbar-market"
    }, marketLabel), /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxcs__topbar-tfs bfxcs__topbar-section"
    }, /*#__PURE__*/_react2.default.createElement(_Dropdown2.default, {
      label: /*#__PURE__*/_react2.default.createElement("span", null, candleWidth, /*#__PURE__*/_react2.default.createElement("i", {
        className: "icon-chevron-down-passive"
      }))
    }, /*#__PURE__*/_react2.default.createElement("ul", null, Object.keys(_bfxHfUtil.TIME_FRAME_WIDTHS).map(tf => /*#__PURE__*/_react2.default.createElement("li", {
      key: tf,
      onClick: () => onTimeFrameChange && onTimeFrameChange(tf)
    }, tf))))), !disableIndicators && /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__topbar-indicators bfxcs__topbar-section"
    }, /*#__PURE__*/_react2.default.createElement(_Dropdown2.default, {
      label: /*#__PURE__*/_react2.default.createElement("span", null, /*#__PURE__*/_react2.default.createElement("i", {
        className: "icon-indicators"
      }), "Indicators", /*#__PURE__*/_react2.default.createElement("i", {
        className: "icon-chevron-down-passive"
      }))
    }, /*#__PURE__*/_react2.default.createElement("ul", null, Object.values(_bfxHfIndicators2.default).filter(i => !!i.label).map(i => /*#__PURE__*/_react2.default.createElement("li", {
      key: i.id,
      onClick: () => this.onAddIndicator(i)
    }, i.humanLabel))))), /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxcs__topbar-fullscreen"
    }, /*#__PURE__*/_react2.default.createElement("i", {
      className: "icon-move",
      onClick: this.onToggleFullscreen
    })), isSyncing && /*#__PURE__*/_react2.default.createElement("div", {
      className: "bfxc__topbar-spinner"
    }), extraHeaderComponentsRight), !disableToolbar && /*#__PURE__*/_react2.default.createElement("ul", {
      className: "bfxc__toolbar"
    }, /*#__PURE__*/_react2.default.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(_line2.default)
    }, "Line"), /*#__PURE__*/_react2.default.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(_horizontal_line2.default)
    }, "HLine"), /*#__PURE__*/_react2.default.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(_vertical_line2.default)
    }, "VLine"), /*#__PURE__*/_react2.default.createElement("li", {
      onClick: () => onAddDrawing && onAddDrawing(_parallel_lines2.default)
    }, "PLines")), /*#__PURE__*/_react2.default.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.axisCanvasRef,
      style: canvasStyle
    }), /*#__PURE__*/_react2.default.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.ohlcCanvasRef,
      style: canvasStyle
    }), /*#__PURE__*/_react2.default.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.indicatorCanvasRef,
      style: canvasStyle
    }), /*#__PURE__*/_react2.default.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.drawingCanvasRef,
      style: canvasStyle
    }), /*#__PURE__*/_react2.default.createElement("canvas", {
      width: width,
      height: renderHeight,
      ref: this.crosshairCanvasRef,
      style: canvasStyle
    }), candles.length > candleLoadingThreshold && indicatorSettings.length > 0 && /*#__PURE__*/_react2.default.createElement("ul", {
      className: "bfxc__overlaysettings-wrapper"
    }, indicatorSettings.map((settings, i) => /*#__PURE__*/_react2.default.createElement("li", {
      key: i,
      style: {
        borderColor: `${settings.colors[0]}99`,
        bottom: `${settings.bottom}px`,
        left: 32
      }
    }, /*#__PURE__*/_react2.default.createElement("p", null, settings.name), /*#__PURE__*/_react2.default.createElement("i", {
      className: "icon-settings",
      onClick: () => this.onOpenIndicatorSettings(i)
    }), /*#__PURE__*/_react2.default.createElement("i", {
      className: "icon-delete",
      onClick: () => onDeleteIndicator(i)
    })))), settingsModalOpen && /*#__PURE__*/_react2.default.createElement(_IndicatorSettingsModal2.default, {
      settings: indicatorSettings[settingsModalIndicatorIndex],
      onClose: this.onCloseIndicatorSettings,
      onSave: this.onSaveIndicatorSettings,
      onDelete: () => {
        onDeleteIndicator(settingsModalIndicatorIndex);
        this.onCloseIndicatorSettings();
      }
    }), candles.length <= candleLoadingThreshold && /*#__PURE__*/_react2.default.createElement(_LoadingBeeSpinner2.default, {
      top: this.getTopReservedSpace()
    }));
  }

}

Chart.serializeIndicators = _serialize_indicators2.default;
Chart.unserializeIndicators = _unserialize_indicators2.default;
exports.default = Chart;