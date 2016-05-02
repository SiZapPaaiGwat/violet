import _ from 'lodash'
import * as appActions from './counter.js'

const actions = {
  app: appActions
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
