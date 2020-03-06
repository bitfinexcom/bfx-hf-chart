"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactOnclickoutside = require("react-onclickoutside");

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _reactCustomScrollbars = require("react-custom-scrollbars");

require("./Dropdown.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Dropdown extends _react2.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      open: false
    });

    this.onToggle = this.onToggle.bind(this);
  }

  handleClickOutside() {
    this.setState(() => ({
      open: false
    }));
  }

  onToggle() {
    this.setState(({
      open
    }) => ({
      open: !open
    }));
  }

  render() {
    const {
      label,
      children
    } = this.props;
    const {
      open
    } = this.state;
    return _react2.default.createElement("div", {
      className: "bfxc__dropdown-wrapper"
    }, _react2.default.createElement("p", {
      onClick: this.onToggle
    }, label), open && _react2.default.createElement("div", {
      className: "bfxc__dropdown-menu"
    }, _react2.default.createElement(_reactCustomScrollbars.Scrollbars, {
      renderThumbVertical: ({
        style,
        ...props
      }) => _react2.default.createElement("div", _extends({
        style: { ...style,
          backgroundColor: '#333'
        }
      }, props))
    }, children)));
  }

}

exports.default = (0, _reactOnclickoutside2.default)(Dropdown);