import * as DataUtils from '../helpers/client_data'

export default {
  // 是否展示相应胡弹窗页面
  settings: {
    // 打开哪个弹窗，zhihu,github
    name: ''
  },
  posts: {
    datasource: [],
    selected: null,
    loadingStatus: {}
  },
  routing: {},
  // 账户设置信息
  account: DataUtils.getAccountMap(),
  // 帐号登录验证状态以及底部工具条状态控制
  status: {
    // 这里不要写出现具体的平台名称
    // zhihu: false,
    // github: false,
    list: false,
    create: false,
    sync: false
  },
  // 作品同步进度通知队列
  notifier: []
}
