import React, {PropTypes} from 'react'
import styles from './BottomSettings.css'
import globalStyles from '../css/global.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired
  },

  showContentPage() {
    this.props.actions.settingsShow()
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
        <a href="javascript:;"
          style={{marginRight: '12px', cssFloat: 'right'}}
        >
          <i className={globalStyles.iconfont}>&#xe677;</i>
        </a>

      </div>
    )
  }
})
