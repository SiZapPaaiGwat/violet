import React, {PropTypes} from 'react'
import * as DbUtils from '../helpers/database'
import styles from './PostList.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
  },

  componentDidMount() {
    DbUtils.listPosts().then((posts) => {
      this.props.actions.postsList({
        posts: posts.reverse()
      })

      let items = this.props.states.posts.datasource
      if (items.length) {
        this.props.actions.postsSelect(items[0])
      }
    })
  },

  render() {
    let posts = this.props.states.posts.datasource
    let list = posts.map((post, i) => {
      let handleClick = () => {
        this.props.actions.postsSelect(post)
        let parent = this.props.parent
        parent.refs.dialog.hide()
        parent.resetSettings()
      }
      return (
        <li key={post.id} onClick={handleClick}>
          <div className={styles.postTitle}>
            <span>{post.title}</span>
            <div>
              <span className={styles.postPubDate}>
                {new Date(post.create_on).toLocaleString()}
              </span>
            </div>
          </div>
        </li>
      )
    })
    let el = posts.length ? <ul>{list}</ul> :
      <div className={styles.noPost}>还没有任何作品</div>
    return (
      <div className={styles.postContainer}>
        {el}
      </div>
    )
  }
})
