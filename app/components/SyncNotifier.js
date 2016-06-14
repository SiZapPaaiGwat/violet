import React, {PropTypes} from 'react'
import styles from './SyncNotifier.css'

/**
 * borrowed from https://codepen.io/simongfxu/pen/MeyGzZ
 */
export default React.createClass({
  propTypes: {
    children: PropTypes.any
  },

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.taskWrapper}>
          <div className={styles.taskContent}>
            <div className={styles.taskContentTitle}>
              <h2>
                作品同步进度
                <small className={styles.taskReport}>
                  <span className={styles.taskRemain}>1</span> / 3
                </small>
              </h2>
            </div>
            <ul className={styles.taskList}>
              <li className={styles.taskItem}>
                <span className={`${styles.label} ${styles.waiting}`}></span>
                <p className={styles.text}>Medium【等待中】</p>
              </li>
              <li className={styles.taskItem}>
                <span className={`${styles.label} ${styles.urgent}`}></span>
                <a href="javascript:;" className={styles.details}>详情</a>
                <p className={styles.text}>GitHub【已失败】</p>
              </li>
              <li className={styles.taskItem}>
                <span className={`${styles.label} ${styles.normal}`}></span>
                <p className={styles.text}>知乎【已成功】</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
})
