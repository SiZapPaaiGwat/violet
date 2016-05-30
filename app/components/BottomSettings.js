import React, {PropTypes} from 'react'
import * as DbUtils from '../helpers/database'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'
import styles from './BottomSettings.css'
import globalStyles from '../css/global.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired
  },

  showContentPage() {
    this.props.actions.settingsShow()
  },

  handleCreate() {
    DbUtils.createPost(DEFAULT_TITLE, DEFAULT_CONTENT).then(id => {
      this.props.actions.postsCreate({
        id,
        title: DEFAULT_TITLE,
        content: DEFAULT_CONTENT,
        create_on: Date.now(),
        platforms: []
      })
      alert('操作成功')
    }).catch(err => {
      alert('操作失败')
    })
  },

  render() {
    // TODO 加载设置页面
    return (
      <div className={styles.bottomSettingsContainer}>
        <a
          href="javascript:;"
          onClick={this.showContentPage}
          style={{marginLeft: '12px'}}
        >
          <i className={globalStyles.iconfont}>&#xe62d;</i>
        </a>
        <a
          onClick={this.handleCreate}
          href="javascript:;"
          style={{marginRight: '12px', cssFloat: 'right'}}
        >
          <i className={globalStyles.iconfont}>&#xe677;</i>
        </a>

      </div>
    )
  }
})
