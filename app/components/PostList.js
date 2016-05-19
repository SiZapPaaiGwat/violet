import React, {PropTypes} from 'react'
import styles from './PostList.css'

export default React.createClass({
  propTypes: {
    posts: PropTypes.array
  },

  getDefaultProps() {
    return {
      posts: []
    }
  },

  render() {
    return (
      <div className={styles.postContainer}>
        <ul>
          <li className={styles.postItem}>
            <div className={styles.postTitle}>
              <strong>持续集成（软件质量改进和风险降低之道）之二</strong>
            </div>
            <div>
              <span className={styles.postPubDate}>2016-05-05</span>
              <span>
                <em className={styles.postPlatform}>知乎</em>
                <em className={styles.postPlatform}>GitHub</em>
              </span>
            </div>
          </li>
          <li className={styles.postItem}>
            <div className={styles.postTitle}>
              <strong>持续集成（软件质量改进和风险降低之道）之二</strong>
            </div>
            <div>
              <span className={styles.postPubDate}>2016-05-05</span>
              <span>
                <em className={styles.postPlatform}>知乎</em>
                <em className={styles.postPlatform}>GitHub</em>
              </span>
            </div>
          </li>
        </ul>
      </div>
    )
  }
})
