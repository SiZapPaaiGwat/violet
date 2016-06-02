import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SettingsZhihu from '../components/SettingsZhihu'
import SettingsGitHub from '../components/SettingsGitHub'
import Alert from 'react-notification-system'
import Modal from 'react-skylight'
import * as DbUtils from '../helpers/database'
import * as DataUtils from '../helpers/client_data'
import vars from '../css/var.css'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  componentDidMount() {
    App.alert = (message, level = 'warning', title = '提示') => {
      this.refs.alert.addNotification({
        title,
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

    DbUtils.listPosts().then((posts) => {
      this.props.actions.postsList({
        posts: posts.reverse()
      })

      let items = this.props.states.posts.datasource
      if (items.length && !this.props.states.posts.selected) {
        this.props.actions.postsSelect(items[0])
      }
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

  handleSync() {
    this.refs.mdEditor.handleSync()
  },

  render() {
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    let states = this.props.states
    let DynamicComponent = null
    let title = ' '
    let dialogName = states.settings.name
    if (dialogName === 'zhihu') {
      DynamicComponent = SettingsZhihu
      title = '设置知乎帐号'
    } else if (dialogName === 'github') {
      DynamicComponent = SettingsGitHub
      title = '设置GitHub帐号'
    } else if (dialogName === 'list') {
      DynamicComponent = PostList
      title = '作品列表'
    }
    // 知乎登录后或者使用github，窗口高度需要调整
    let useMiniStyle = (dialogName === 'zhihu' && states.status.zhihu) || (
      dialogName === 'github'
    )
    let dialogStyles = {
      width: vars.dialogWidth,
      height: useMiniStyle ? vars.dialogMiniHeight : vars.dialogHeight,
      marginTop: useMiniStyle ? vars.dialogMiniMarginTop : vars.dialogMarginTop,
      marginLeft: vars.dialogMarginLeft,
    }

    return (
      <div>
        <BottomSettings {...this.props} parent={this} />
        <MarkdownArea {...this.props} ref="mdEditor" />
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
