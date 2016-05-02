import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import App from './App'
import actionMap from '../actions/index'
import _ from 'lodash'

export function mapStateToProps(state = {}) {
  return {
    states: _.assign({}, state)
  }
}

export function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators(actionMap, dispatch)
  return {actions}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
