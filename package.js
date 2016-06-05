/* eslint-disable */
'use strict';

require('babel-polyfill');
const os = require('os');
const fs = require('fs');
const webpack = require('webpack');
const electronCfg = require('./webpack.config.main.js');
const cfg = require('./webpack.config.renderer.js');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
//  support argument names: all, icon
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);
const appName = pkg.productName;
const shouldUseAsar = true;
const shouldBuildAll = argv.all;
const electronVersion = '1.2.0';
const iconUrl = 'app/imgs/app';
/**
 * 原则上只需要以下几个目录的文件
 * index.html
 * main.js
 * package.json
 * dist/*
 */
const finallyIncludedFiles = [
  'index.html', 'main.js', 'package.json', 'dist', 'node_modules'
];
const ignoreFiles = fs.readdirSync('.').concat(['release'])
  .filter(item => !finallyIncludedFiles.includes(item))
  .map(item => `^/${item.replace('.', '\\.')}($|/)`)
  .concat(devDeps.map(name => `/node_modules/${name}($|/)`))
  .concat(
    deps.filter(name => !electronCfg.externals.includes(name))
      .map(name => `/node_modules/${name}($|/)`)
  );
const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  icon: iconUrl,
  ignore: ignoreFiles
};

DEFAULT_OPTS.version = electronVersion;
startPack();

function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
}

function startPack() {
  console.log('start pack...');
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del('release'))
    .then(paths => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach(plat => {
          archs.forEach(arch => {
            pack(plat, arch, log(plat, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png';
      if (plat === 'darwin') {
        extension = '.icns';
      } else if (plat === 'win32') {
        extension = '.ico';
      }
      return extension;
    })()
  };

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version,
    out: `release/${plat}-${arch}`
  });

  packager(opts, cb);
}


function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err);
    console.log(`${plat}-${arch} finished!`);
  };
}
