#!/usr/bin/env node
'use strict'

const path = require('path')

const APP_ROOT_PATH = require('app-root-path').path
const APP_PACKAGE = require(path.resolve(APP_ROOT_PATH, 'package.json'))

const module_resolve = require('resolve')

const SHELL_PACKAGE_NAME = '@things-factory/shell'
const SHELL_MODULE_PATH = path.resolve(module_resolve.sync(SHELL_PACKAGE_NAME), '..', '..')

const SHELL_PACKAGE = require(path.resolve(SHELL_MODULE_PATH, 'package.json'))

var cordovaPlugins = require('../things-factory-native.config').plugins

// const PLUGIN_PATHS = []
// cordovaPlugins.forEach(p => {
//   PLUGIN_PATHS.push(
//     path.resolve(
//       module_resolve.sync(p, {
//         packageFilter: (pkg, dir) => {
//           pkg.main = './package.json'
//           return pkg
//         }
//       }),
//       '../'
//     )
//   )
// })

var spawn = require('child_process').spawn

console.log(`installing ${APP_PACKAGE.name}'s cordova plugins!`)

var cordova = spawn(
  'cordova',
  ['plugin', 'add', ...cordovaPlugins, '--searchpath', path.resolve(APP_ROOT_PATH, 'node_modules')],
  {
    cwd: SHELL_MODULE_PATH
  }
)

cordova.stdout.on('data', function(data) {
  console.log(data.toString())
})

cordova.stderr.on('data', function(data) {
  console.log('stderr: ' + data.toString())
})

cordova.on('exit', function(code) {
  if (code == 0) console.log(`All cordova plugins installed!`)
  else console.log('child process exited with code ' + code.toString())
})
