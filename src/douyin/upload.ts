import {Upload} from '../type'
import * as core from '@actions/core'
import {getArgs} from './utils'
import * as cp from 'child_process'

export const upload = async (option: Upload): Promise<void> => {
  cp.execSync(
    [
      'npx',
      'tma',
      'set-app-config',
      option.appid,
      '--token',
      option.privateKey
    ].join(' ')
  )
  const command = [
    'npx',
    'tma',
    'upload',
    ...getArgs(option),
    option.projectPath
  ].join(' ')
  core.info('Command:')
  core.info(`  ${command}`)
  cp.execSync(command)
  cp.execSync('npx tma logout')
}
