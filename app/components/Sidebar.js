import React, {Component} from 'react'
import {Button} from 'antd'

export default class SideBar extends Component {
  render() {
    return (
      <div className="pure-menu">
        <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <a href="#/list" className="pure-menu-link">我的作品</a></li>
            <li className="pure-menu-item">
              <a href="#/settings" className="pure-menu-link">同步设置</a>
            </li>
            <li className="pure-menu-item">
              <a href="#/write" className="pure-menu-link">开始创作</a>
            </li>
        </ul>
        <div className="purchase-button-wrapper">
          <Button type="primary">购买序列号</Button>
        </div>
      </div>
    )
  }
}
