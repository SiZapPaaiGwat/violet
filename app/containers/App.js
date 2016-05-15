import React, {Component, PropTypes} from 'react'
import PostList from '../components/PostList'
import BottomSettings from '../components/BottomSettings'
import SettingsContent from '../components/SettingsContent'
import MarkdownArea from '../components/MarkdownArea'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    states: PropTypes.object
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
        <PostList />
        <BottomSettings />
        <MarkdownArea />
        {this.props.states.showSettings && <SettingsContent />}
      </div>
    )
  }
}
