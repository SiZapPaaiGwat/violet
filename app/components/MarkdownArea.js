import React, {PropTypes} from 'react'
import AceEditor from 'react-ace'
import {
  DEFAULT_TITLE, AUTO_SAVING_STORE_PERIOD, AUTO_SAVING_DATABASE_PERIOD
} from '../helpers/const'
import * as DbUtils from '../helpers/database'
import * as utils from '../helpers/utils'
import _ from 'lodash'
import 'brace'
import 'brace/mode/markdown'
import 'brace/theme/monokai'
import styles from './MarkdownArea.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  componentDidMount() {
    /**
     * 更新db不能频繁操作
     */
    this.syncStore = _.debounce(this.syncStore, AUTO_SAVING_STORE_PERIOD)
    this.syncDatabase = _.debounce(this.syncDatabase, AUTO_SAVING_DATABASE_PERIOD)
  },

  syncDatabase() {
    let post = this.props.states.posts.selected
    let value = this.refs.aceEditor.editor.getValue()
    let title = utils.getMarkdownTitle(value)
    let updates = {
      title: title || DEFAULT_TITLE,
      content: value
    }
    console.log('#Updating database:')
    console.log(updates)
    DbUtils.updatePost(post.id, updates).then(updated => {
      console.log('#Updating result:', updated)
    }).catch(err => {
      console.error(err.message)
    })
  },

  syncStore(value) {
    let post = this.props.states.posts.selected
    let title = utils.getMarkdownTitle(value)
    this.props.actions.postsUpdate({
      id: post.id,
      title,
      content: value
    })
    this.syncDatabase()
  },

  render() {
    let post = this.props.states.posts.selected
    let editorValue = post ? post.content : ''

    return (
      <div ref="container" className={styles.markdownContainer}>
        <AceEditor
          ref="aceEditor"
          onChange={this.syncStore}
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
