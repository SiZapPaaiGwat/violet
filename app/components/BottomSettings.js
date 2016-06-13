import React, {PropTypes} from 'react'
import * as DbUtils from '../helpers/database'
import {DEFAULT_TITLE, DEFAULT_CONTENT, SUPPORT_PLATFORM_LIST} from '../helpers/const'
import styles from './BottomSettings.css'
import globalStyles from '../css/global.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  handleCreate() {
    let items = this.props.states.posts.datasource
    let newestItem = items[0] || {}
    if (newestItem.title === DEFAULT_TITLE && newestItem.content === DEFAULT_CONTENT) {
      this.props.actions.postsSelect(newestItem)
      this.props.actions.settingsShow({name: ''})
      return
    }

    DbUtils.createPost(DEFAULT_TITLE, DEFAULT_CONTENT).then(id => {
      this.props.actions.postsCreate({
        id,
        title: DEFAULT_TITLE,
        content: DEFAULT_CONTENT,
        create_on: Date.now(),
        platforms: []
      })
      this.props.actions.postsSelect(this.props.states.posts.datasource[0])
      this.props.actions.settingsShow({name: ''})
    }).catch(err => {
      App.alert('新建作品失败', err.message)
    })
  },

  renderPlatforms() {
    let status = this.props.states.status
    return SUPPORT_PLATFORM_LIST.map(plat => {
      let platformName = plat.name
      let handleClick = () => {
        if (this.props.states.settings.name !== platformName) {
          this.props.actions.settingsShow({name: platformName})
        }
      }

      return (
        <a
          href="javascript:;"
          key={platformName}
          onClick={handleClick}
          title={plat.label}
          className={status[platformName] ? '' : styles.disabled}
          disabled={!status[platformName]}
        >
          <img src={plat.icon} alt={plat.name} className={styles.img} />
        </a>
      )
    })
  },

  render() {
    let status = this.props.states.status
    return (
      <div className={styles.bottomSettingsContainer}>
        <div style={{cssFloat: 'left'}}>
          {this.renderPlatforms()}
        </div>

        <div style={{cssFloat: 'right'}}>
          <a
            onClick={this.handleCreate}
            className={status.create ? '' : styles.clickableless}
            href="javascript:;"
            title="创作新作品"
          >
            <i className={globalStyles.iconfont}>&#xe677;</i>
          </a>
        </div>
      </div>
    )
  }
})
