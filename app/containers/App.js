import React, {Component, PropTypes} from 'react'
import {Row, Col} from 'antd'
import SideBar from '../components/SideBar'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    // let devTools
    // if (process.env.NODE_ENV !== 'production') {
    //   // import 有提升的副作用，这里需要在需要时引入
    //   const DevTools = require('./DevTools')
    //   devTools = <DevTools />
    // }

    return (
      <div>
        <Row>
          <Col span="4">
            <SideBar />
          </Col>
          <Col span="20">{this.props.children}</Col>
        </Row>
      </div>
    )
  }
}
