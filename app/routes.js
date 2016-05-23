import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Root from './containers/Root'

export default (
  <Route path="/" component={Root}>
    <IndexRoute component={Root} />
  </Route>
)
