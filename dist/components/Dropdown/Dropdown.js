function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import OnClickOutside from 'react-onclickoutside';
import { Scrollbars } from 'react-custom-scrollbars';
import './Dropdown.css';

class Dropdown extends React.Component {
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
    return React.createElement("div", {
      className: "bfxc__dropdown-wrapper"
    }, React.createElement("p", {
      onClick: this.onToggle
    }, label), open && React.createElement("div", {
      className: "bfxc__dropdown-menu"
    }, React.createElement(Scrollbars, {
      renderThumbVertical: ({
        style,
        ...props
      }) => React.createElement("div", _extends({
        style: { ...style,
          backgroundColor: '#333'
        }
      }, props))
    }, children)));
  }

}

export default OnClickOutside(Dropdown);