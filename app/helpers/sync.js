import * as utils from './utils'
import {syncPost} from '../../electron/ipc_render'

export default function({post, value = '', zhihu = {}, github = {}, loginStatus}) {
  if (!post) {
    return Promise.reject(new Error('未选择需要同步的作品'))
  }

  let args = {
    title: utils.getMarkdownTitle(value),
    content: utils.normalizeMarkdownContent(value)
  }

  if (!args.title) {
    return Promise.reject(new Error('标题不能为空（格式参考：# 我的标题）'))
  }

  if (!args.content) {
    return Promise.reject(new Error('内容不能为空'))
  }

  const BASE_LEN = Object.keys(args).length

  if (loginStatus.github) {
    args.github = github
    args.github.key = post.github_id
  }

  if (loginStatus.zhihu) {
    args.zhihu = {
      cookie: zhihu.cookie,
      token: zhihu.token,
      key: post.zhihu_kid
    }
  }

  if (Object.keys(args).length === BASE_LEN) {
    return Promise.reject(new Error('没有设置任何写作平台的帐号信息'))
  }

  if (loginStatus.zhihu && !zhihu.cookie) {
    return Promise.reject(new Error('应用程序内部错误，无法获取关键数据'))
  }

  return syncPost(args)
}
