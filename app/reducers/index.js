import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'
import settings from './settings'
import posts from './posts'
import account from './account'
import status from './status'

const rootReducer = combineReducers({
  settings,
  posts,
  routing,
  account,
  status
})

export default rootReducer
