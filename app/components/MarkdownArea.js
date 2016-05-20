import React from 'react'
import styles from './MarkdownArea.css'
import 'brace'
import 'brace/mode/markdown'
import 'brace/theme/github'
import AceEditor from 'react-ace'

const INITIAL_VALUE = `
# 努力的区别

> 我每天很辛苦的工作 ，我身边的朋友也是每天忙忙碌碌的，可是并没有感觉自己很
  优秀。 而且我看到一些人，感觉他们好像并没有怎么努力，就可以过的很好，收入比我高两三倍，
  要怎样才可以让自己变得更优秀？努力就可以变得更优秀吗？问题到底出在哪里？

* BTC
* LTC
* ETH

`

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
      width: `${el.offsetWidth - 16 * 2}px`,
      height: `${el.offsetHeight - 10 * 2}px`
    })
  },

  componentDidMount() {
    if (document.readyState === 'complete') {
      this.resizeEditorWH()
    } else {
      window.addEventListener('load', () => {
        this.resizeEditorWH()
      })
    }
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
        value={INITIAL_VALUE}
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
