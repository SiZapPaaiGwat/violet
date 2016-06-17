#!/usr/bin/env node

/**
 * 打包exe文件为安装包程序
 */

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')
const pkg = require('../package.json')
const rootPath = path.join(__dirname, '..')
const outPath = path.join(rootPath, 'release')
const setupIcon = path.join(rootPath, 'electron', 'icons', 'win', 'app.ico')
const loadingGif = path.join(rootPath, 'app', 'imgs', 'loading.gif')
const installFolder = path.join(rootPath, 'release', 'windows-installer')

const config = {
  appDirectory: path.join(outPath, 'violet-win32-x64'),
  outputDirectory: installFolder,
  iconUrl: setupIcon,
  loadingGif,
  setupIcon,
  setupExe: `violet-v${pkg.version}.exe`,
  noMsi: true,
  skipUpdateIcon: true,
  description: pkg.description
}

function deleteOutputFolder() {
  return new Promise((resolve, reject) => {
    rimraf(installFolder, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

deleteOutputFolder()
.then(() => {
  createWindowsInstaller(config)
}).then(() => {
  console.log('Done making windows installer')
}).catch(error => {
  console.error(error.message || error)
  process.exit(1)
})
