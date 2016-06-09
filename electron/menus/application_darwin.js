import {app, shell} from 'electron'

export default function(mainWindow) {
  return [{
    label: 'violet',
    submenu: [{
      label: 'About Violet',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Hide Violet',
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:'
    }, {
      label: 'Show All',
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click() {
        app.quit()
      }
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'Command+R',
      click() {
        mainWindow.reload()
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click() {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click() {
        mainWindow.toggleDevTools()
      }
    }]
  }, {
    label: 'Window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:'
    }, {
      label: 'Close',
      accelerator: 'Command+W',
      selector: 'performClose:'
    }, {
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      selector: 'arrangeInFront:'
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
