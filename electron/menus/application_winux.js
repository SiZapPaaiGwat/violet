import {shell} from 'electron'

export default function(mainWindow) {
  return [{
    label: '&File',
    submenu: [{
      label: '&Open',
      accelerator: 'Ctrl+O'
    }, {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click() {
        mainWindow.close()
      }
    }]
  }, {
    label: '&View',
    submenu: [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click() {
        mainWindow.reload()
      }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click() {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click() {
        mainWindow.toggleDevTools()
      }
    }]
  }, {
    label: '帮助',
    submenu: [{
      label: '官网',
      click() {
        shell.openExternal('https://github.com/simongfxu/violet')
      }
    }, {
      label: '反馈建议',
      click() {
        shell.openExternal('https://jinshuju.net/f/2yctZ5?x_field_1=client')
      }
    }, {
      label: '联系开发者',
      click() {
        shell.openExternal('http://www.weibo.com/xugaofan')
      }
    }]
  }]
}
