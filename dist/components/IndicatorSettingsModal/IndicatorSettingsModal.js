function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import _isFinite from 'lodash/isFinite';
import _isString from 'lodash/isString';
import './IndicatorSettingsModal.css';
export default class IndicatorSettingsModal extends React.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      values: []
    });

    const {
      settings = {}
    } = this.props;
    const {
      argsDef,
      args = []
    } = settings;
    this.state.values = args.map((arg, i) => _isFinite(arg) || _isString(arg) ? arg : argsDef[i].default);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onValueChange(index, value) {
    this.setState(({
      values
    }) => {
      const nextValues = [...values];
      nextValues[index] = _isFinite(+value) ? +value : value;
      return {
        values: nextValues
      };
    });
  }

  onSave() {
    const {
      onSave
    } = this.props;
    const {
      values
    } = this.state;
    onSave(values);
  }

  render() {
    const {
      values
    } = this.state;
    const {
      onClose,
      onDelete,
      settings = {}
    } = this.props;
    const {
      name,
      argsDef,
      args = []
    } = settings;
    return React.createElement("div", {
      className: "bfxc__indicatorsettingsmodal-outer"
    }, React.createElement("div", {
      className: "bfxc__indicatorsettingsmodal-wrapper"
    }, React.createElement("p", {
      className: "bfxc__indicatorsettingsmodal-title"
    }, name, " Settings"), React.createElement("ul", {
      className: "bfxc__indicatorsettingsmodal-settings"
    }, args.map((arg, i) => React.createElement("li", null, React.createElement("p", null, argsDef[i].label), React.createElement("input", {
      type: "text",
      value: values[i],
      onChange: e => this.onValueChange(i, e.target.value)
    })))), React.createElement("ul", {
      className: "bfxc__indicatorsettingsmodal-actions"
    }, React.createElement("li", null, React.createElement("button", {
      onClick: onClose
    }, "Close")), React.createElement("li", null, React.createElement("button", {
      onClick: onDelete,
      className: "red"
    }, "Delete")), React.createElement("li", null, React.createElement("button", {
      onClick: this.onSave,
      className: "green"
    }, "Save")))));
  }

}