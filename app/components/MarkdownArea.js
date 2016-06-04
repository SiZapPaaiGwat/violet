import React, {PropTypes} from 'react'
import AceEditor from 'react-ace'
import {DEFAULT_TITLE, ZHIHU_XSRF_TOKEN_NAME} from '../helpers/const'
import * as DbUtils from '../helpers/database'
import * as utils from '../helpers/utils'
import {syncPost} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import 'brace'
import 'brace/mode/markdown'
import 'brace/theme/monokai'
import styles from './MarkdownArea.css'
import vars from '../css/var.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  handleSync() {
    let post = this.props.states.posts.selected
    if (!post) {
      App.alert('未选择需要同步的作品', 'warning', '提示')
      return
    }

    let value = this.refs.aceEditor.editor.getValue()
    let args = {
      title: utils.getMarkdownTitle(value),
      content: utils.normalizeMarkdownContent(value)
    }

    let accountMap = this.props.states.account
    let loginStatus = this.props.states.status

    if (loginStatus.github) {
      args.github = accountMap.github
      args.github.key = post.github_id
    }

    if (loginStatus.zhihu) {
      let cookie = DataUtils.getCookiesByPlatform('zhihu')
      args.zhihu = {
        cookie,
        token: utils.getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME),
        key: post.zhihu_kid
      }

      if (!args.zhihu.cookie) {
        App.alert('应用程序内部错误，无法获取关键数据', 'error', '同步失败')
        return
      }
    }

    if (Object.keys(args).length === 2) {
      App.alert('没有设置任何写作平台的帐号信息', 'error', '同步失败')
      return
    }

    syncPost(args).then(result =>
      // 更新 key
      DbUtils.updatePost(post.id, {
        github_id: result[0].number,
        zhihu_id: result[1].slug
      })
    ).then(updated => {
      if (updated) {
        App.alert('文章同步成功', 'success', '恭喜')
      } else {
        App.alert('文章同步成功，但是本地数据更新失败', 'warning', '未知错误')
      }
    }).catch(err => {
      App.alert(err.message, 'error', '同步失败')
    })
  },

  handleChange(value) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let post = this.props.states.posts.selected
      let title = utils.getMarkdownTitle(value)
      DbUtils.updatePost(post.id, {
        title: title || DEFAULT_TITLE,
        content: value
      }).then(updated => {
        if (!updated) return

        this.props.actions.postsUpdate({
          id: post.id,
          title,
          content: value
        })
      })
    }, 600)
  },

  render() {
    let post = this.props.states.posts.selected
    let editorValue = post ? post.content : ''

    return (
      <div ref="container" className={styles.markdownContainer}>
        <AceEditor
          ref="aceEditor"
          onChange={this.handleChange}
          className={styles.aceEditor}
          width="100%"
          height={`calc(100% - ${vars.markdownEditorHeightOffset})`}
          mode="markdown"
          theme="monokai"
          value={editorValue}
          name="editor"
          showGutter={false}
          setOptions={{fontSize: 16, wrap: true}}
        />
      </div>
    )
  }
})
