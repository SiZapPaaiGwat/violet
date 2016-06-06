import React, {PropTypes} from 'react'
import AceEditor from 'react-ace'
import {DEFAULT_TITLE} from '../helpers/const'
import * as DbUtils from '../helpers/database'
import * as utils from '../helpers/utils'
import 'brace'
import 'brace/mode/markdown'
import 'brace/theme/monokai'
import styles from './MarkdownArea.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
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
          height="100%"
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
