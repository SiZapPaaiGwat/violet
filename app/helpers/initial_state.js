import * as DataUtils from '../helpers/client_data'

export default {
  // 打开哪些帐号设置（展示）页面，为空则展示编辑器页面
  settings: {
    // 打开哪个弹窗，zhihu,github
    name: ''
  },
  posts: {
    datasource: [],
    // 当前选中作品
    selected: null,
    // {id, isLoading} 哪些作品正在同步
    loadingStatus: {}
  },
  routing: {},
  // 帐号信息，用于控制底部平台工具条登录状态
  account: DataUtils.getAccountMap(),
  // 作品相关工具条状态是否可用
  status: {
    list: false,
    create: false,
    sync: false
  },
  // 作品同步进度通知队列
  notifier: []
}
