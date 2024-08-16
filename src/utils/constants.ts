/* eslint-disable no-shadow */
export enum Inputs {
  mode = 'mode',
  platform = 'platform',
  type = 'type',
  projectPath = 'project-path',
  privateKey = 'private-key',
  privateKeyPath = 'private-key-path',
  ignores = 'ignores',
  version = 'version',
  desc = 'desc',
  robot = 'robot',
  threads = 'threads',
  // preview input
  qrcodeFormat = 'qrcode-format',
  qrcodeOutputDest = 'qrcode-output-dest',
  pagePath = 'page-path',
  searchQuery = 'search-query',
  scene = 'scene',
  // output
  output = 'output',
  outputPath = 'output-path',

  ciVersion = 'ci-version'
}

export enum Outputs {
  appid = 'appid',
  version = 'version',
  outputPath = 'outputPath'
}
