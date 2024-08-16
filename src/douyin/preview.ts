import {Preview} from '../type'
import * as core from '@actions/core'
import {generate, getQrCode} from '../utils/qrcode'
import fs from 'fs'
import {getArgs} from './utils'
import * as cp from 'child_process'

export const preview = async (option: Preview): Promise<string> => {
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
    'preview',
    ...getArgs(option),
    '--qrcode-output',
    option.qrcodeOutputDest,
    option.projectPath
  ].join(' ')
  core.info('Command:')
  core.info(`  ${command}`)
  cp.execSync(command)
  cp.execSync(`npx ${`tt-ide-cli@${option.ciVersion || '0.1.27'}`} logout`)
  if (option.qrcodeFormat === 'terminal') {
    const qrcodeData = await getQrCode(option.qrcodeOutputDest)
    const qrcode = await generate(qrcodeData)
    core.info(`Generate terminal qrcode:\n${qrcode}`)
    fs.promises.unlink(option.qrcodeOutputDest)
    return qrcode
  }
  return ''
}
