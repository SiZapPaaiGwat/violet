import React, {PropTypes} from 'react'
import styles from './Form.css'
import _ from 'lodash'

export default React.createClass({
  propTypes: {
    onSubmit: PropTypes.func,
    extends: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  },

  handleSubmit(e) {
    e.preventDefault()
    if (this.props.onSubmit) {
      let keys = this.props.extends.map(item => {
        return item.name
      })
      let values = this.props.extends.map(item => {
        return this.refs[item.name].value
      })
      this.props.onSubmit(_.zipObject(keys, values))
    }
  },

  render() {
    let extra = this.props.extends.map(item => {
      let type = item.type || 'text'
      return (
        <section key={item.name}>
            <label htmlFor={item.name}>{item.label}</label>
            <input
              ref={item.name}
              name={item.name}
              type={type}
              placeholder={item.placeholder}
              required={item.required}
              defaultValue={item.value}
            />
        </section>
      )
    })

    return (
      <form action="#" method="POST" className={styles.forms} onSubmit={this.handleSubmit}>
        {extra}
        <section>
          <button type="submit"
            disabled={this.props.isLoading}
            className={`${styles.btn} ${styles.btnBorderOpen} ${styles.btnPurple}`}
          >
            {this.props.isLoading ? '正在保存...' : '立即保存'}
          </button>
        </section>
      </form>
    )
  }
})
