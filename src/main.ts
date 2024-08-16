import * as core from '@actions/core'
import {
  formatDate,
  getInput,
  getInputAsArray,
  getInputAsInt,
  Inputs,
  Outputs,
  stringify
} from './utils/index'
import {
  CiOption,
  filterMode,
  filterPlatform,
  filterQrcodeFormat,
  filterType,
  Preview
} from './type'
import path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import {upload} from './ci/upload'
import {preview} from './ci/preview'
import {upload as dyUpload} from './douyin/upload'
import {preview as dyPreview} from './douyin/preview'

const defaultPrivateKeyPath = '../private.key'

async function run(): Promise<void> {
  let autoPrivateKey = false
  let isTest = false
  let qrcode = ''
  const workspace = process.env.GITHUB_WORKSPACE || __dirname
  let option: CiOption
  try {
    core.debug(new Date().toTimeString())

    option = {
      mode: filterMode(getInput(Inputs.mode)),
      platform: filterPlatform(getInput(Inputs.platform)),
      appid: '',
      type: filterType(getInput(Inputs.type)),
      projectPath: getInput(Inputs.projectPath) || '',
      privateKey: getInput(Inputs.privateKey),
      privateKeyPath: getInput(Inputs.privateKeyPath),
      ignores: getInputAsArray(Inputs.ignores),

      version: getInput(Inputs.version) || '',
      desc: getInput(Inputs.desc),
      robot: getInputAsInt(Inputs.robot),
      threads: getInputAsInt(Inputs.threads),

      ciVersion: getInput(Inputs.ciVersion)
    }
    if (getInput(Inputs.mode) === 'test') {
      isTest = true
    }
    if (!option.projectPath) {
      option.projectPath = './'
    }
    option.projectPath = path.resolve(workspace, `${option.projectPath}`)

    if (option.privateKey) {
      autoPrivateKey = true
      option.privateKeyPath = path.resolve(workspace, defaultPrivateKeyPath)
      fs.writeFileSync(option.privateKeyPath, option.privateKey)
      core.info('read privateKey success and write to privateKeyPath.')
      option.privateKey = ''
    } else {
      if (!option.privateKeyPath) {
        throw Error('privateKey 和 privateKeyPath 不能都为空')
      }
      option.privateKeyPath = path.resolve(workspace, option.privateKeyPath)
    }
    if (option.ignores?.length === 0) {
      option.ignores = ['node_modules/**/*']
    }
    const projectConfig = JSON.parse(
      fs
        .readFileSync(`${option.projectPath}/project.config.json`)
        .toString('utf8')
    )
    option.appid = projectConfig.appid
    option.setting = projectConfig.setting

    if (!option.version) {
      option.version = formatDate(new Date(), 'YYYY.MMDD.HHmmss')
    }
    if (!option.desc) {
      option.desc = 'fix some bug.'
    }
    if (!option.threads) {
      option.threads = os.cpus().length
    }

    // handler
    if (isTest) {
      // eslint-disable-next-line no-console
      console.log('Test option:')
      // eslint-disable-next-line no-console
      console.log(`${stringify(option)}`)
      qrcode = 'xxxxx\nx x x\nxxxxx'
    } else if (option.mode === 'upload') {
      core.info('Options:')
      core.info(`${stringify(option)}`)
      if (option.platform === 'wechat') {
        await upload(option)
      } else {
        await dyUpload(option)
      }
    } else if (option.mode === 'preview') {
      const previewOption: Preview = {
        ...option,
        qrcodeFormat: filterQrcodeFormat(getInput(Inputs.qrcodeFormat)),
        qrcodeOutputDest:
          getInput(Inputs.qrcodeOutputDest) || './preview-qrcode.png',
        pagePath: getInput(Inputs.pagePath),
        searchQuery: getInput(Inputs.searchQuery),
        scene: getInputAsInt(Inputs.scene)
      }

      previewOption.qrcodeOutputDest = path.resolve(
        workspace,
        previewOption.qrcodeOutputDest
      )
      core.info('Options:')
      core.info(`${stringify(previewOption)}`)
      if (option.platform === 'wechat') {
        qrcode = await preview(previewOption)
      } else {
        qrcode = await dyPreview(previewOption)
      }
    }
    if (autoPrivateKey) {
      fs.promises.unlink(option.privateKeyPath)
    }

    core.setOutput(Outputs.appid, option.appid)
    core.setOutput(Outputs.version, option.version)
    core.info(`  ⚙  ::set-output:: appid=${option.appid}`)
    core.info(`  ⚙  ::set-output:: version=${option.version}`)
    core.info(`  ✅  Success - ${option.mode} done.`)
    let outputTemplate = getInput(Inputs.output)
    if (outputTemplate) {
      const outputPath = path.resolve(
        workspace,
        getInput(Inputs.outputPath) || './output.txt'
      )
      outputTemplate = outputTemplate
        .replace(/{appid}/g, option.appid)
        .replace(/{version}/g, option.version)
        .replace(/{qrcode}/g, qrcode)
      fs.writeFileSync(outputPath, outputTemplate)
      core.info(`  ✅  Success - write output file to ${outputPath}.`)
    }
  } catch (error) {
    if (autoPrivateKey) {
      fs.promises.unlink(defaultPrivateKeyPath)
    }
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
