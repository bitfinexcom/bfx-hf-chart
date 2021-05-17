import React from 'react'
import _isFinite from 'lodash/isFinite'
import _isString from 'lodash/isString'
import './IndicatorSettingsModal.css'

export default class IndicatorSettingsModal extends React.PureComponent {
  state = {
    values: []
  }

  constructor (props) {
    super(props)

    const { settings = {} } = this.props
    const { argsDef, args = [] } = settings

    this.state.values = args.map((arg, i) => (
      _isFinite(arg) || _isString(arg) ? arg : argsDef[i].default
    ))

    this.onValueChange = this.onValueChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onValueChange (index, value) {
    this.setState(({ values }) => {
      const nextValues = [...values]
      nextValues[index] = _isFinite(+value) ? +value : value
      return { values: nextValues }
    })
  }

  onSave () {
    const { onSave } = this.props
    const { values } = this.state
    onSave(values)
  }

  render () {
    const { values } = this.state
    const { onClose, onDelete, settings = {} } = this.props
    const { name, argsDef, args = [] } = settings

    return (
      <div className='bfxc__indicatorsettingsmodal-outer'>
        <div className='bfxc__indicatorsettingsmodal-wrapper'>
          <p className='bfxc__indicatorsettingsmodal-title'>
            {name} Settings

            {/* TODO: support multiple colors
            <span
              className='bfxc__indicatorsettingsmodal-color'
              style={{
                backgroundColor: args.__color,
              }}
            />
            */}
          </p>

          <ul className='bfxc__indicatorsettingsmodal-settings'>
            {args.map((arg, i) => (
              <li key={i}>
                <p>{argsDef[i].label}</p>

                <input
                  type='text'
                  value={values[i]}
                  onChange={e => this.onValueChange(i, e.target.value)}
                />
              </li>
            ))}
          </ul>

          <ul className='bfxc__indicatorsettingsmodal-actions'>
            <li>
              <button onClick={onClose}>Close</button>
            </li>

            <li>
              <button onClick={onDelete} className='red'>Delete</button>
            </li>

            <li>
              <button onClick={this.onSave} className='green'>Save</button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
