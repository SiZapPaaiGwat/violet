import React, {PropTypes} from 'react'
import _ from 'lodash'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'
import * as CloudUtils from '../helpers/cloud_storage'
import * as DbUtils from '../helpers/database'
import styles from '../helpers/create_login/CreateLogin.css'
import formStyles from './Form.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  getInitialState() {
    let user = CloudUtils.getCurrentUser()
    return {
      isLoading: false,
      email: user.getEmail()
    }
  },

  handleCloudSync(formData) {
    this.setState({isLoading: true})
    CloudUtils.query().then(cloudPosts => {
      let localPosts = this.props.states.posts.datasource.filter(item => {
        return item.title !== DEFAULT_TITLE || item.content !== DEFAULT_CONTENT
      })
      let remotePosts = cloudPosts.map(item => {
        return CloudUtils.purify(item)
      })
      let {local, cloud, indexes} = CloudUtils.compare(remotePosts, localPosts)
      let {insert, update, remove} = local
      if (!cloud.length && !insert.length && !update.length && !remove.length) {
        App.alert('同步结束', '本地作品已与云端记录保持一致', 'info')
        this.setState({isLoading: false})
        return Promise.resolve()
      }

      return Promise.all([
        CloudUtils.sync(cloud),
        DbUtils.bulk(local.insert, local.update, local.remove)
      ]).then(result => {
        let tips = `
          云端更新(${cloud.length})
          本地新增(${insert.length}) / 更新(${update.length}) / 删除(${remove.length})
        `
        App.alert('同步成功', tips.trim(), 'success')
        // 找到本地需要更新object_id的数据
        return Promise.all(_.keys(indexes).map(i => {
          return DbUtils.updatePost(indexes[i], {
            object_id: result[0][0].id
          }, true)
        }))
      }).then(() => {
        return DbUtils.listPosts()
      }).then(posts => {
        this.setState({isLoading: false})
        this.props.actions.postsList({posts})
      })
    }).catch(err => {
      this.setState({isLoading: false})
      console.error(err)
      App.alert('同步出错', err.message)
    })
  },

  handleLogout() {
    CloudUtils.logout()
    this.props.actions.settingsShow({
      name: 'register'
    })
  },

  render() {
    let btnClass = `${formStyles.btn} ${formStyles.btnBorderOpen} ${formStyles.btnPurple}`
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>violet同步帐号</h2>
            <div className={formStyles.forms}>
              <section>
                <label>Email:</label>
                <input type="text" value={this.state.email} readOnly />
              </section>

              <section>
                <button
                  onClick={this.handleCloudSync}
                  className={btnClass}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? '正在同步...' : '立即同步'}
                </button>
                <a href="javascript:;"
                  style={{marginLeft: '24px'}}
                  onClick={this.handleLogout}
                >
                  <small>注销当前帐号</small>
                </a>
              </section>
            </div>
        </div>
      </div>
    )
  }
})
