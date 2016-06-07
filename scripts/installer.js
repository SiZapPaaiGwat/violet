#!/usr/bin/env node

/**
 * 打包exe文件为安装包程序
 */

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')
const rootPath = path.join(__dirname, '..')
const outPath = path.join(rootPath, 'release')
// TODO 更换应用icon
const setupIcon = path.join(rootPath, 'electron', 'icons', 'win', 'app.ico')
// TODO 更好loading图片
const loadingGif = path.join(rootPath, 'assets', 'imgs', 'loading.gif')

const config = {
  appDirectory: path.join(outPath, 'violet-win32-ia32'),
  outputDirectory: path.join(outPath, 'windows-installer'),
  iconUrl: setupIcon,
  loadingGif,
  setupIcon,
  setupExe: 'violet.exe',
  noMsi: true,
  skipUpdateIcon: true
}

function deleteOutputFolder() {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'release', 'windows-installer'), (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

deleteOutputFolder()
.then(() => createWindowsInstaller(config))
.catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
