import _ from 'lodash'
import * as settings from './settings.js'

const actions = {
  settings
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
