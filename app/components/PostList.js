import React, {Component, PropTypes} from 'react'
import styles from './PostList.css'

export default class PostList extends Component {
  static propTypes = {
    posts: PropTypes.array
  }

  render() {
    return (
      <div className={styles.postContainer}>

      </div>
    )
  }
}
