import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MODE'] = 'test'
  process.env['INPUT_PROJECT-PATH'] = '../__tests__/dist'
  process.env['INPUT_PRIVATE-KEY'] = 'theInputPrivateKey'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test output', () => {
  process.env['INPUT_MODE'] = 'test'
  process.env['INPUT_PROJECT-PATH'] = '../__tests__/dist'
  process.env['INPUT_PRIVATE-KEY'] = 'theInputPrivateKey'
  process.env['INPUT_OUTPUT'] =
    'appid={appid},version={version}\n```\n{qrcode}\n```\n'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
