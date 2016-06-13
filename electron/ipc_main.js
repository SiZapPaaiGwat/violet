import {ipcMain} from 'electron'
import PlatformHandler from './platforms/handler'
import ZhihuHandler from './platforms/zhihu'
import './platforms/github'
import './platforms/medium'

function zipObject(keys = [], values = []) {
  let obj = {}
  keys.forEach((key, i) => {
    obj[key] = values[i]
  })
  return obj
}

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
ipcMain.on('sync-post-start', (event, {title = '', content = '', ...platforms}) => {
  let keys = Object.keys(platforms)
  let handlerList = PlatformHandler.map(keys).map((instance, i) => {
    return new instance({
      ...platforms[keys[i]],
      title: title.trim(),
      content: content.trim()
    }).publish()
  })

  Promise.all(handlerList).then(result => {
    event.sender.send('sync-post-finish', zipObject(keys, result))
  }).catch(error => {
    console.log(error)
    event.sender.send('user-action-error', {text: error.message, title: '同步失败', error})
  })
})

/**
 * 检测各个平台的登录情况
 */
ipcMain.on('detect-login-status-start', (event, platforms) => {
  let keys = Object.keys(platforms)
  let handlerList = PlatformHandler.map(keys).map((instance, i) => {
    return new instance(platforms[keys[i]]).whoAmI()
  })

  Promise.all(handlerList).then(result => {
    event.sender.send('detect-login-status-finish', zipObject(keys, result))
  }).catch(error => {
    console.log(error)
    event.sender.send('user-action-error', {text: error.message, error, title: '登录态异常'})
  })
})
