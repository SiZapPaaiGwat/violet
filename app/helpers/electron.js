import {ipcRenderer} from 'electron'

export default function(title, content, accountMap, callback) {
  ipcRenderer.on('sync-finish', callback)
  ipcRenderer.send('sync-start', title, content, accountMap)
}
