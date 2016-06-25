import React, {PropTypes} from 'react'
import * as CloudUtils from '../helpers/cloud_storage'
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
    // this.setState({isLoading: true})
    // CloudUtils.query().then(cloudPosts => {
    //   this.setState({isLoading: true})
    //   return CloudUtils.syncNow(cloudPosts, this.props.states.posts.datasource)
    // }).then(() => {
    //   this.setState({isLoading: true})
    //   App.alert('同步成功', '本次同步云端新增2条记录，更新3条记录<br /> 本地删除1条记录，更新2条记录', 'success')
    // }).catch(err => {
    //   App.alert('同步出错', err.message)
    // })
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
                >
                  立即同步
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
