import React from 'react'
import globalStyles from '../css/global.css'
import styles from './MarkdownTools.css'

export default React.createClass({
  render() {
    return (
      <div className={styles.container}>
        <a href="javascript:;" title="开始同步文章">
          <i className={globalStyles.iconfont}>&#xe6a2;</i>
        </a>
      </div>
    )
  }
})
