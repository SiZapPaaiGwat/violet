import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    status: PropTypes.any,
    children: PropTypes.any
  },

  getDefaultProps() {
    return {
      status: null
    }
  },

  render() {
    let child = status === null ? 'Loading...' : this.props.children

    return (
      <div style={{textAlign: 'center'}}>
        {child}
      </div>
    )
  }
})
