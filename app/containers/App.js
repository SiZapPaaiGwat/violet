import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SettingsZhihu from '../components/SettingsZhihu'
import Alert from 'react-notification-system'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  componentDidMount() {
    App.alert = (message, level = 'warning') => {
      this.refs.alert.addNotification({
        message,
        level
      })
    }
  },

  render() {
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    let states = this.props.states
    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        <MarkdownArea {...this.props} />
        {
          states.settings.name === 'zhihu' && <SettingsZhihu {...this.props} />
        }
        {
          //settings.github && <SettingsContent />
        }
        {
          //settings.list && <SettingsContent />
        }

        <Alert ref="alert" />
      </div>
    )
  }
})
