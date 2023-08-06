import {Upload} from '../type'
import * as core from '@actions/core'
import {getArgs} from './utils'
import * as cp from 'child_process'

export const upload = async (option: Upload): Promise<void> => {
  const command = ['npx', 'miniprogram-ci', 'upload', ...getArgs(option)].join(
    ' '
  )

  core.info('Command:')
  core.info(`  ${command}`)
  cp.execSync(command)
}
