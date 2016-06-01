import _ from 'lodash'
import * as settings from './settings'
import * as posts from './posts'
import * as account from './account'

const actions = {
  settings,
  posts,
  account
}

function convert(actionCreators) {
  let ret = {}
  _.each(actionCreators, (item, key) => {
    _.each(item, (action, funcName) => {
      let newActionName = _.camelCase(`${key}_${funcName}`)
      ret[newActionName] = action
    })
  })

  return ret
}

export default convert(actions)
