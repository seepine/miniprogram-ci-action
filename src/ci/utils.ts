import {CiOption} from '../type'
import * as core from '@actions/core'

export const getArgs = (option: CiOption): string[] => {
  const args = [
    '--project-type',
    `'${option.type}'`,
    '--appid',
    `'${option.appid}'`,
    '--project-path',
    `'${option.projectPath}'`
  ]
  if (option.privateKeyPath) {
    args.push(...['--private-key-path', `'${option.privateKeyPath}'`])
  }
  if (option.ignores) {
    args.push(...['--project-ignores', `'${option.ignores.toString()}'`])
  }
  if (option.version) {
    args.push(...['--upload-version', `'${option.version}'`])
  }
  if (option.desc) {
    args.push(...['--upload-description', `'${option.desc}'`])
  }
  if (option.threads) {
    args.push(...['--threads', `${option.threads.toString()}`])
  }
  if (option.robot) {
    args.push(...['--robot', `${option.robot.toString()}`])
  }
  if (option.setting) {
    if (option.setting.es6) {
      args.push(...['--enable-es6', `true`])
    }
    if (option.setting.es7) {
      args.push(...['--enable-es7', `true`])
    }
    if (option.setting.autoPrefixWXSS) {
      args.push(...['--enable-autoprefixwxss', `true`])
    }
    if (option.setting.autoPrefixWXSS) {
      args.push(...['--enable-autoprefixwxss', `true`])
    }
    if (option.setting.autoPrefixWXSS) {
      args.push(...['--enable-autoprefixwxss', `true`])
    }
    if (option.setting.minifyWXSS) {
      args.push(...['--enable-minify-wxss', `true`])
    }
    if (option.setting.minifyWXML) {
      args.push(...['--enable-minify-wxml', `true`])
    }
    if (option.setting.minifyJS) {
      args.push(...['--enable-minify-js', `true`])
    }
    if (option.setting.minify) {
      args.push(...['--enable-minify', `true`])
    }
  }
  core.debug(args.toString())
  return args
}
