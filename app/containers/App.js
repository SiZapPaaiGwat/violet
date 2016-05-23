import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired
  },

  render() {
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        <MarkdownArea {...this.props} />
      </div>
    )
  }
})
