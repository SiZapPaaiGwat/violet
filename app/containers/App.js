import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SettingsZhihu from '../components/SettingsZhihu'
import SettingsGitHub from '../components/SettingsGitHub'
import Alert from 'react-notification-system'
import Modal from 'react-skylight'
import * as DataUtils from '../helpers/client_data'

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

    let github = this.props.states.account.github
    DataUtils.getLoginDetails({zhihu: true, github}).then(result => {
      if (Object.keys(result).length !== 2) {
        throw new Error('调用错误')
      }

      this.props.actions.statusUpdate({
        platform: 'zhihu',
        value: result.zhihu
      })

      this.props.actions.statusUpdate({
        platform: 'github',
        value: result.github
      })
    }).catch(err => {
      App.alert(err.message)
    })
  },

  componentWillUpdate(nextProps) {
    let currentName = this.props.states.settings.name
    let nextName = nextProps.states.settings.name
    if (nextName && currentName !== nextName) {
      this.refs.dialog.show()
    }
  },

  resetSettings() {
    this.props.actions.settingsShow({name: ''})
  },

  render() {
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    // TODO compute from css
    let dialogStyles = {
      width: '400px',
      height: '480px',
      marginTop: '-240px',
      marginLeft: '-200px'
    }
    let states = this.props.states
    let DynamicComponent = null
    let title = ' '
    if (states.settings.name === 'zhihu') {
      DynamicComponent = SettingsZhihu
      title = '设置知乎帐号'
    } else if (states.settings.name === 'github') {
      DynamicComponent = SettingsGitHub
      title = '设置GitHub帐号'
    } else if (states.settings.name === 'list') {
      DynamicComponent = PostList
      title = '作品列表'
    }

    return (
      <div>
        <BottomSettings {...this.props} />
        <MarkdownArea {...this.props} />
        <Modal
          ref="dialog"
          title={title}
          isVisible={states.settings.name !== ''}
          dialogStyles={dialogStyles}
          afterClose={this.resetSettings}
        >
          {DynamicComponent && <DynamicComponent {...this.props} parent={this} />}
        </Modal>
        <Alert ref="alert" />
      </div>
    )
  }
})
