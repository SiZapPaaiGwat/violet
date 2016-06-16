import appdmg from 'appdmg'
import path from 'path'
import pkg from '../package.json'

let task = appdmg({
  basepath: path.resolve(__dirname, '..'),
  target: path.resolve(__dirname, '..', `release/violet-v${pkg.version}.dmg`),
  // https://github.com/LinusU/node-appdmg/blob/master/README.md#specification
  specification: {
    title: 'violet',
    contents: [
      {x: 448, y: 344, type: 'link', path: '/Applications'},
      {x: 192, y: 344, type: 'file', path: 'release/violet-darwin-x64/violet.app'}
    ]
  }
})

task.on('progress', (info) => {
  console.log(info)
})

task.on('finish', () => {
  console.log('Finish making dmg')
})

task.on('error', (err) => {
  throw err
})
