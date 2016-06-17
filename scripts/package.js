/**
 * 打包应用
 * npm run pack (for current platform only)
 * npm run pack-all (for linxu/darwin/windows x64 & ia32)
 */
require('babel-polyfill')
const os = require('os')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const electronCfg = require('../webpack.config.main.js')
const cfg = require('../webpack.config.renderer.js')
const packager = require('electron-packager')
const argv = require('minimist')(process.argv.slice(2))
const pkg = require('../package.json')
const basePath = path.join(__dirname, '..')
const iconPath = path.join(basePath, 'electron', 'icons')
const deps = Object.keys(pkg.dependencies)
const devDeps = Object.keys(pkg.devDependencies)
const shouldBuildAll = argv.all

const iconUrls = {
  linux: path.join(iconPath, 'png', '64.png'),
  darwin: path.join(iconPath, 'mac', 'app.icns'),
  win32: path.join(iconPath, 'win', 'app.ico')
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
const ignoreFiles = fs.readdirSync(basePath).concat(['release'])
  .filter(item => {
    return !finallyIncludedFiles.includes(item)
  }).map(item => {
    return `^/${item.replace('.', '\\.')}($|/)`
  })
  .concat(devDeps.map(name => {
    return `/node_modules/${name}($|/)`
  }))
  .concat(deps.filter(name => {
    return !electronCfg.externals.includes(name)
  })
  .map(name => {
    return `/node_modules/${name}($|/)`
  }))
// 通用打包配置
const DEFAULT_OPTS = {
  dir: basePath,
  asar: true,
  prune: true,
  overwrite: true,
  name: pkg.productName,
  ignore: ignoreFiles,
  version: pkg.electronVersion,
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
        out: path.join(basePath, 'release')
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
  .then(() => {
    return build(cfg)
  }).then(paths => {
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
