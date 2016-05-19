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
        <a
          href="javascript:;"
          onClick={this.showSettingsContent}
          style={{marginLeft: '12px'}}
        >
          <i className={styles.iconfont}>&#xe62d;</i>
        </a>
        <a href="javascript:;"
          style={{marginRight: '12px', cssFloat: 'right'}}
        >
          <i className={styles.iconfont}>&#xe677;</i>
        </a>
      </div>
    )
  }
})
