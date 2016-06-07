import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SettingsZhihu from '../components/SettingsZhihu'
import SettingsGitHub from '../components/SettingsGitHub'
import Alert from 'react-notification-system'
import * as DbUtils from '../helpers/database'
import * as DataUtils from '../helpers/client_data'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'

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

    this.loadLoginStatus()
    this.loadPostList()
  },

  loadLoginStatus() {
    let github = this.props.states.account.github
    DataUtils.getLoginDetails({zhihu: true, github}).then(result => {
      this.props.actions.statusUpdate({
        platform: 'github',
        value: result.github
      })

      this.props.actions.statusUpdate({
        platform: 'zhihu',
        value: result.zhihu ? {
          writable: result.zhihu.columns.length > 0
        } : false
      })
    }).catch(err => {
      console.log(err)
      App.alert(err.message, 'error', '获取同步帐号信息出错')
    })
  },

  loadPostList() {
    DbUtils.listPosts().then(posts => {
      // 初次加载创建一条默认记录
      if (posts.length === 0) {
        return DbUtils.createPost(DEFAULT_TITLE, DEFAULT_CONTENT)
      }

      return Promise.resolve(posts)
    }).then(posts => {
      if (typeof posts === 'number') {
        return DbUtils.listPosts()
      }

      return Promise.resolve(posts)
    }).then(posts => {
      this.props.actions.postsList({posts: posts.reverse()})
      this.props.actions.postsSelect(this.props.states.posts.datasource[0])
      'list,create,sync'.split(',').forEach(item => {
        this.props.actions.statusUpdate({
          platform: item,
          value: true
        })
      })
    }).catch(err => {
      App.alert(err.message, 'error', '获取作品列表出错')
    })
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
    let pageName = states.settings.name
    if (pageName === 'zhihu') {
      DynamicComponent = SettingsZhihu
    } else if (pageName === 'github') {
      DynamicComponent = SettingsGitHub
    } else {
      DynamicComponent = MarkdownArea
    }

    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        <DynamicComponent {...this.props} />
        <Alert ref="alert" />
      </div>
    )
  }
})
