import React, {PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import MarkdownArea from '../components/MarkdownArea'
import * as DbUtils from '../helpers/database'
import * as DataUtils from '../helpers/client_data'
import {getCookieByName} from '../helpers/utils'
import {DEFAULT_TITLE, DEFAULT_CONTENT, ZHIHU_XSRF_TOKEN_NAME} from '../helpers/const'
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
        Alert({
          title,
          text,
          type
        })
        return Promise.resolve(null)
      }

      return Alert(title)
    }
    App.mountTime = Date.now()

    this.loadLoginStatus()
    this.loadPostList()
  },

  loadLoginStatus() {
    let cookie = DataUtils.getCookiesByPlatform('zhihu')
    detectLoginStatus({
      zhihu: {
        cookie,
        token: getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
      },
      github: this.props.states.account.github
    }).then(result => {
      this.props.actions.statusUpdate({
        platform: 'github',
        value: result.github
      })

      this.props.actions.statusUpdate({
        platform: 'zhihu',
        value: result.zhihu ? {
          // 可能还没有申请专栏
          writable: result.zhihu.columns.length > 0
        } : false
      })
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
      'list,create,sync'.split(',').forEach(item => {
        this.props.actions.statusUpdate({
          platform: item,
          value: true
        })
      })
    }).catch(err => {
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
    let DynamicComponent = createLoginPage(states.settings.name, this.props) ||
      <MarkdownArea {...this.props} />

    return (
      <div>
        <PostList {...this.props} />
        <BottomSettings {...this.props} />
        {DynamicComponent}
      </div>
    )
  }
})
