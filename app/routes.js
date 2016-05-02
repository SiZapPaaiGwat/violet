import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Root from './containers/Root'
import Settings from './containers/Settings'

export default (
  <Route path="/" component={Root}>
    <IndexRoute component={Settings} />
    <Route path="settings" component={Settings} />
  </Route>
)
