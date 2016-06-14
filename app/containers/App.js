import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import SyncNotifier from '../components/SyncNotifier'
import * as DbUtils from '../helpers/database'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'
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
        Alert({
          title,
          text,
          type,
          allowOutsideClick: false
        })
        return Promise.resolve(null)
      }

      return Alert(Object.assign({}, title, {allowOutsideClick: false}))
    }
    App.stopLoading = () => {
      this.props.actions.postsLoading({
        isLoading: false
      })
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
    let account = this.props.states.account || {}
    /**
     * NOTE
     * 启动时不验证上次登录是否有效，直接认定为已经登录
     * 用户同步时跟据同步结果直接反馈信息
     */
    Object.keys(account).forEach(platform => {
      this.props.actions.statusUpdate({
        platform,
        value: true
      })
    })

    this.enableSync()
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
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    let states = this.props.states
    let DynamicComponent = createLoginPage(states.settings.name) || MarkdownArea
    let notifier = states.notifier

    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        <DynamicComponent {...this.props} />
        {notifier.length && <SyncNotifier tasks={notifier} />}

        {
          //devTools
        }
      </div>
    )
  }
})
