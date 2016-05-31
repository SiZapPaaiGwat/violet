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
import globalStyles from '../css/global.css'
import variables from '../css/var.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      width: null,
      height: null
    }
  },

  resizeEditorWH() {
    let el = this.refs.container
    this.setState({
      width: `${el.offsetWidth - parseInt(variables.paddingHoriz, 10) * 2}px`,
      height: `${el.offsetHeight - parseInt(variables.paddingVertical, 10) * 2}px`
    })
  },

  componentDidMount() {
    this.resizeEditorWH()
  },

  handleSync() {
    let value = this.refs.aceEditor.editor.getValue()
    let args = {
      title: utils.getMarkdownTitle(value),
      content: utils.normalizeMarkdownContent(value)
    }

    let accountMap = DataUtils.getAccountMap()
    DataUtils.getLoginDetails(accountMap).then(result => {
      if (result.github) {
        args.github = accountMap.github
      }

      if (result.zhihu) {
        let cookie = DataUtils.getCookiesByPlatform('zhihu')
        args.zhihu = {
          cookie,
          token: utils.getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
        }
      }

      if (Object.keys(args).length === 2) {
        return Promise.reject(new Error('没有设置任何写作平台'))
      }

      return syncPost(args)
    }).then(result => {
      alert('文章同步成功')
    }).catch(err => {
      console.log(err)
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
    let el = this.state.width ? (
      <AceEditor
        ref="aceEditor"
        onChange={this.handleChange}
        className={styles.aceEditor}
        width={this.state.width}
        height={this.state.height}
        mode="markdown"
        theme="github"
        value={editorValue}
        name="editor"
        showGutter={false}
        setOptions={{fontSize: 16, wrap: true}}
      />
    ) : null

    return (
      <div ref="container" className={styles.markdownContainer}>
        <div className={styles.container}>
          <a href="javascript:;" title="开始同步文章" onClick={this.handleSync}>
            <i className={globalStyles.iconfont}>&#xe6a2;</i>
          </a>
        </div>

        {el}
      </div>
    )
  }
})
