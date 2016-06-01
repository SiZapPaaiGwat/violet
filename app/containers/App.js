import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SettingsZhihu from '../components/SettingsZhihu'
import SettingsGitHub from '../components/SettingsGitHub'
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
    let DynamicComponent = PostList
    if (states.settings.name === 'zhihu') {
      DynamicComponent = SettingsZhihu
    } else if (states.settings.name === 'github') {
      DynamicComponent = SettingsGitHub
    }

    return (
      <div>
        <BottomSettings {...this.props} />
        <MarkdownArea {...this.props} />
        <DynamicComponent {...this.props} />
        <Alert ref="alert" />
      </div>
    )
  }
})
