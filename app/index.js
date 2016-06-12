import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'
import initialState from './helpers/initial_state'
import 'normalize.css'
import './css/sweetalert2.css'

const store = configureStore(initialState)
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
