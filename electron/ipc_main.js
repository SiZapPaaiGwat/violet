import {ipcMain} from 'electron'
import * as RequestHandler from './request_handler'
import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

/**
 * 发布文章到各个写作平台
知乎参考格式
<b>加粗</b><p><i>斜体</i></p><p><u>下划线</u></p><h2>标题</h2>
<blockquote>引用</blockquote><p></p>
<ol><li><span style=\"line-height: 1.7;\">1</span><br></li>
<li><span style=\"line-height: 1.7;\">2</span><br></li>
<li><span style=\"line-height: 1.7;\">3</span><br></li>
</ol><p></p>
<ul><li><span style=\"line-height: 1.7;\">ol</span><br></li>
<li><span style=\"line-height: 1.7;\">ol</span><br></li>
<li><span style=\"line-height: 1.7;\">ol</span></li>
</ul><br><p></p><br><p></p>
<pre lang=\"\">var a = 1;\nfunction A() {\n    console.log(123)\n}\n</pre><p></p>
 */
ipcMain.on('sync-post-start', (event, {title, content, github, zhihu}) => {
  let tasks = []
  if (github) {
    tasks.push(RequestHandler.publishGitHub({
      ...github,
      title: title.trim(),
      content: content.trim()
    }))
  } else {
    // null 表示没有同步
    tasks.push(Promise.resolve(null))
  }

  if (zhihu) {
    tasks.push(RequestHandler.publishZhihu({
      ...zhihu,
      title: title.trim(),
      content: marked(content).trim()
    }))
  } else {
    tasks.push(Promise.resolve(null))
  }

  Promise.all(tasks).then(result => {
    event.sender.send('sync-post-finish', {
      github: result[0],
      zhihu: result[1]
    })
  }).catch(error => {
    event.sender.send('user-action-error', {error, title: '同步失败'})
  })
})

/**
 * 检测各个平台的登录情况
 */
ipcMain.on('detect-login-status-start', (event, {zhihu, github}) => {
  let tasks = []

  if (github) {
    tasks.push(RequestHandler.isGitHubLoggin(github))
  } else {
    tasks.push(Promise.resolve(false))
  }
  if (zhihu) {
    tasks.push(RequestHandler.isZhihuLoggin(zhihu))
  } else {
    tasks.push(Promise.resolve(false))
  }

  Promise.all(tasks).then(result => {
    event.sender.send('detect-login-status-finish', {
      github: result[0],
      zhihu: result[1]
    })
  }).catch(error => {
    event.sender.send('user-action-error', {error, title: '登录态异常'})
  })
})

ipcMain.on('zhihu-whoami-start', (event, args) => {
  RequestHandler.whoAmI(args).then(json => {
    event.sender.send('zhihu-whoami-finish', json)
  }).catch(error => {
    event.sender.send('user-action-error', {error, title: '获取身份失败'})
  })
})
