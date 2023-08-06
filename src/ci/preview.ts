import {Preview} from '../type'
import * as core from '@actions/core'
import {generate, getQrCode} from '../utils/qrcode'
import fs from 'fs'
import {getArgs} from './utils'
import * as cp from 'child_process'

export const preview = async (option: Preview): Promise<string> => {
  const previewArgs = []
  if (option.qrcodeFormat === 'terminal') {
    previewArgs.push(
      ...[
        '--qrcode-format',
        'image',
        '--qrcode-output-dest',
        option.qrcodeOutputDest
      ]
    )
  } else {
    previewArgs.push(...['--qrcode-format', option.qrcodeFormat])
    if (option.qrcodeOutputDest) {
      previewArgs.push(...['--qrcode-output-dest', option.qrcodeOutputDest])
    }
  }
  if (option.pagePath) {
    previewArgs.push(...['--preview-page-path', option.pagePath])
  }
  if (option.searchQuery) {
    previewArgs.push(...['--preview-search-query', option.searchQuery])
  }
  if (option.scene) {
    previewArgs.push(...['--scene', `${option.scene}`])
  }
  const command = [
    'npx',
    'miniprogram-ci',
    'preview',
    ...getArgs(option),
    ...previewArgs
  ].join(' ')

  core.info('Command:')
  core.info(`  ${command}`)
  cp.execSync(command)
  if (option.qrcodeFormat === 'terminal') {
    const qrcodeData = await getQrCode(option.qrcodeOutputDest)
    const qrcode = await generate(qrcodeData)
    core.info(`Generate terminal qrcode:\n${qrcode}`)
    fs.promises.unlink(option.qrcodeOutputDest)
    return qrcode
  }
  return ''
}
