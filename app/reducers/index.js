import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'
import settings from './settings'
import posts from './posts'
import account from './account'
import status from './status'
import notifier from './notifier'

const rootReducer = combineReducers({
  settings,
  posts,
  routing,
  account,
  status,
  notifier
})

export default rootReducer
