import React, {PropTypes} from 'react'
import styles from './BottomSettings.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired
  },

  showSettingsContent() {
    this.props.actions.settingsShow()
  },

  render() {
    return (
      <div className={styles.bottomSettingsContainer}>
        <a href="javascript:;" onClick={this.showSettingsContent}>
          <i className={styles.iconfont}>&#xe62d;</i>
        </a>
        <a href="javascript:;">
          <i className={styles.iconfont} style={{cssFloat: 'right'}}>&#xe677;</i>
        </a>
      </div>
    )
  }
})
