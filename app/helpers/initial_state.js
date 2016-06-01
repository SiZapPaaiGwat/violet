import * as DataUtils from '../helpers/client_data'

export default {
  // 是否展示相应胡弹窗页面
  settings: {
    // 打开哪个弹窗，zhihu,github,list
    name: ''
  },
  posts: {
    datasource: [],
    selected: null
  },
  routing: {
  },
  // 账户设置信息
  account: DataUtils.getAccountMap()
}
