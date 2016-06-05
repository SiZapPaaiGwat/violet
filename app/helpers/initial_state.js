import * as DataUtils from '../helpers/client_data'

export default {
  // 是否展示相应胡弹窗页面
  settings: {
    // 打开哪个弹窗，zhihu,github
    name: ''
  },
  posts: {
    datasource: [],
    selected: null
  },
  routing: {
  },
  // 账户设置信息
  account: DataUtils.getAccountMap(),
  // 帐号登录验证状态以及底部工具条状态控制
  status: {
    zhihu: false,
    github: false,
    list: false,
    create: false,
    sync: false
  }
}
