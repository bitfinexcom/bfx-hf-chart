import React from 'react'
import OnClickOutside from 'react-onclickoutside'
import { Scrollbars } from 'react-custom-scrollbars'
import './Dropdown.css'

class Dropdown extends React.Component {
  state = {
    open: false,
  }

  constructor (props) {
    super(props)

    this.onToggle = this.onToggle.bind(this)
  }

  handleClickOutside () {
    this.setState(() => ({
      open: false,
    }))
  }

  onToggle () {
    this.setState(({ open }) => ({
      open: !open,
    }))
  }

  render () {
    const { label, children } = this.props
    const { open } = this.state

    return (
      <div className='bfxc__dropdown-wrapper'>
        <p onClick={this.onToggle}>{label}</p>

        {open && (
          <div className='bfxc__dropdown-menu'>
            <Scrollbars
              renderThumbVertical={({ style, ...props }) => (
                <div
                  style={{
                    ...style,
                    backgroundColor: '#333',
                  }}

                  {...props}
                />
              )}
            >
              {children}
            </Scrollbars>
          </div>
        )}
      </div>
    )
  }
}

export default OnClickOutside(Dropdown)
