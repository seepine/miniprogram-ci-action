import {Upload} from '../type'
import * as core from '@actions/core'
import {getArgs} from './utils'
import * as cp from 'child_process'

export const upload = async (option: Upload): Promise<void> => {
  cp.execSync(
    [
      'npx',
      `tt-ide-cli@${option.ciVersion || '0.1.27'}`,
      'set-app-config',
      option.appid,
      '--token',
      option.privateKey
    ].join(' ')
  )
  const command = [
    'npx',
    `tt-ide-cli@${option.ciVersion || '0.1.27'}`,
    'upload',
    ...getArgs(option),
    option.projectPath
  ].join(' ')
  core.info('Command:')
  core.info(`  ${command}`)
  cp.execSync(command)
  cp.execSync(`npx ${`tt-ide-cli@${option.ciVersion || '0.1.27'}`} logout`)
}
