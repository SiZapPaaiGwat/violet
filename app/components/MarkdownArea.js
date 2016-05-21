import React from 'react'
import AceEditor from 'react-ace'
import {EDITOR_INITIAL_VALUE} from '../helpers/const'
import 'brace'
import 'brace/mode/markdown'
import 'brace/theme/github'
import styles from './MarkdownArea.css'
import variables from '../css/var.css'

export default React.createClass({
  getInitialState() {
    return {
      width: 0,
      height: 0
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

  handleChange(newValue) {
    console.log('change', newValue)
  },

  render() {
    let el = this.state.width ? (
      <AceEditor
        className={styles.aceEditor}
        onChange={this.handleChange}
        width={this.state.width}
        height={this.state.height}
        mode="markdown"
        theme="github"
        value={EDITOR_INITIAL_VALUE}
        name="editor"
        showGutter={false}
        setOptions={{fontSize: 16, wrap: true}}
      />
    ) : null
    return (
      <div ref="container" className={styles.markdownContainer}>
        {el}
      </div>
    )
  }
})
