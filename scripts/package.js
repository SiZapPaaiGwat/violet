/**
 * 打包应用
 * npm run pack (for current platform only)
 * npm run pack-all (for linxu/darwin/windows x64 & ia32)
 */
require('babel-polyfill')
const os = require('os')
const fs = require('fs')
const webpack = require('webpack')
const electronCfg = require('../webpack.config.main.js')
const cfg = require('../webpack.config.renderer.js')
const packager = require('electron-packager')
const del = require('del')
//  support argument names: all, icon
const argv = require('minimist')(process.argv.slice(2))
const pkg = require('../package.json')

const deps = Object.keys(pkg.dependencies)
const devDeps = Object.keys(pkg.devDependencies)
const shouldBuildAll = argv.all
const electronVersion = '1.2.0'
const iconUrls = {
  linux: '../electron/icons/png/64.png',
  darwin: '../electron/icons/png/app.icns',
  win32: '../electron/icons/mac/app.ico'
}
const osSpecifiedSettings = {
  linux: {

  },
  // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#os-xmac-app-store-targets-only
  darwin: {
    'app-bundle-id': '',
    'app-category-type': '',
    'osx-sign': null
  },
  win32: {
    'version-string': {
      ProductName: 'violet',
      CompanyName: '',
      FileDescription: 'A fantasy sync tool for writers'
    }
  }
}
const finallyIncludedFiles = [
  'index.html', 'main.js', 'package.json', 'dist', 'node_modules'
]
const ignoreFiles = fs.readdirSync('.').concat(['release'])
  .filter(item => !finallyIncludedFiles.includes(item))
  .map(item => `^/${item.replace('.', '\\.')}($|/)`)
  .concat(devDeps.map(name => `/node_modules/${name}($|/)`))
  .concat(deps.filter(name => !electronCfg.externals.includes(name))
    .map(name => `/node_modules/${name}($|/)`))
// 通用打包配置
const DEFAULT_OPTS = {
  dir: '../',
  asar: true,
  prune: true,
  overwrite: true,
  name: pkg.productName,
  ignore: ignoreFiles,
  version: electronVersion,
  'app-version': pkg.version
}
const archs = ['ia32', 'x64']
const platforms = ['linux', 'win32', 'darwin']

function startPack() {
  console.log('start pack...')

  function build(config) {
    return new Promise((resolve, reject) => {
      console.log(`Building scripts via webpack using ${config.entry} ...`)

      webpack(config, (err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve(stats)
        }
      })
    })
  }

  function pack(platform, arch) {
    return new Promise((resolve, reject) => {
      // there is no darwin ia32 electron
      if (platform === 'darwin' && arch === 'ia32') {
        resolve([])
        return
      }

      const opts = Object.assign({}, DEFAULT_OPTS, osSpecifiedSettings[platform], {
        platform,
        arch,
        icon: iconUrls[platform],
        out: `../release/${platform}-${arch}`
      })

      console.log(`Packing ${platform}-${arch} with details:`)
      console.log(opts)

      packager(opts, (err, appPaths) => {
        if (err) {
          reject(err)
          return
        }

        resolve(appPaths)
      })
    })
  }

  build(electronCfg)
  .then(() => build(cfg))
  .then(() => del('release'))
  .then(paths => {
    let tasks = []
    if (shouldBuildAll) {
      platforms.forEach(plat => {
        archs.forEach(arch => {
          tasks.push(pack(plat, arch))
        })
      })
    } else {
      tasks.push(pack(os.platform(), os.arch()))
    }

    return Promise.all(tasks)
  }).then(list => {
    console.log('Packing success')
    console.log(list)
  }).catch(err => {
    console.error(err)
  })
}

startPack()
