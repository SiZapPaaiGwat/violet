import {app, BrowserWindow, Menu, crashReporter} from 'electron'
import path from 'path'
import addApplicationMenu2Mac from './menus/application_darwin'
import addApplicationMenu2Winux from './menus/application_winux'
import './ipc_main'

let mainWindow = null

function initialize() {
  function makeSingleInstance() {
    if (process.mas) return false

    return app.makeSingleInstance(function() {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        }
        mainWindow.focus()
      }
    })
  }

  let shouldQuit = makeSingleInstance()
  if (shouldQuit) {
    app.quit()
    return
  }

  crashReporter.start({
    productName: 'violet',
    companyName: 'violet',
    autoSubmit: true,
    submitURL: 'https://simongfxu.github.io/'
  })

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
  }

  function onAppReady() {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728
    })

    let indexName = process.env.HOT ? 'index.dev.html' : 'index.html'
    let entryPath = path.join(__dirname, process.env.HOT ? '..' : '.', indexName)
    console.log(`Loading entry file: ${entryPath}`)
    mainWindow.loadURL(`file://${entryPath}`)

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools()
    }

    let template = process.platform === 'darwin' ? addApplicationMenu2Mac(mainWindow) :
      addApplicationMenu2Winux(mainWindow)
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('ready', onAppReady)
}

initialize()
