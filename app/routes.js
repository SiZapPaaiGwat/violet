import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Root from './containers/Root'
import Settings from './containers/Settings'
import Writting from './containers/Writting'

export default (
  <Route path="/" component={Root}>
    <IndexRoute component={Settings} />
    <Route path="settings" component={Settings} />
    <Route path="write" component={Writting} />
  </Route>
)
