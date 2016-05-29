import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'
import settings from './settings'
import posts from './posts'


const rootReducer = combineReducers({
  settings,
  posts,
  routing
})

export default rootReducer
