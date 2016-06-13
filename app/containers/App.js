import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import * as DbUtils from '../helpers/database'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'
import {getLoginStatus} from '../helpers/sync'
import {detectLoginStatus} from '../../electron/ipc_render'
import createLoginPage from '../helpers/create_login/CreateLogin'
import Alert from 'sweetalert2'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  componentDidMount() {
    App.alert = (title = 'oops', text = '遇到了一点问题', type = 'error') => {
      if (typeof title === 'string') {
        Alert(title, text, type)
        return Promise.resolve(null)
      }

      return Alert(title)
    }
    App.mountTime = Date.now()

    this.loadLoginStatus()
    this.loadPostList()
  },

  enableSync() {
    this.props.actions.statusUpdate({
      platform: 'sync',
      value: true
    })
  },

  loadLoginStatus() {
    let account = this.props.states.account
    if (Object.keys(account).length === 0) {
      this.enableSync()
      return
    }

    detectLoginStatus(account).then(result => {
      let status = getLoginStatus(result)
      Object.keys(result).forEach(platform => {
        this.props.actions.statusUpdate({
          platform,
          value: status[platform]
        })
      })

      // 现在可以同步了
      this.enableSync()
    }).catch(err => {
      console.log(err)
      App.alert('获取帐号信息出错', err.message)
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
      // 现在可以使用创建按钮了
      'list,create'.split(',').forEach(item => {
        this.props.actions.statusUpdate({
          platform: item,
          value: true
        })
      })
    }).catch(err => {
      console.log(err)
      App.alert('获取作品列表出错', err.message)
    })
  },

  render() {
    let devTools
    if (process.env.NODE_ENV !== 'production') {
      // import 有提升的副作用，这里需要在需要时引入
      const DevTools = require('./DevTools')
      devTools = <DevTools />
    }

    let states = this.props.states
    let DynamicComponent = createLoginPage(states.settings.name) || MarkdownArea

    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        <DynamicComponent {...this.props} />
        {devTools}
      </div>
    )
  }
})
