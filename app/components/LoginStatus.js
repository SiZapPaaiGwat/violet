import React, {PropTypes} from 'react'
import styles from './Form.css'

export default React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func
  },

  render() {
    return (
      <div className={styles.forms}>
        <section>
          <label>当前用户:</label>
          <input type="text" value={this.props.username} readOnly />
        </section>

        <section>
          <button
            onClick={this.props.onLogout}
            className={`${styles.btn} ${styles.btnBorderOpen} ${styles.btnPurple}`}
          >
            注销
          </button>
        </section>
      </div>
    )
  }
})
