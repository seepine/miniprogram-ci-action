const modeDic = ['upload', 'preview'] as const
type Mode = (typeof modeDic)[number]

const typeDic = [
  'miniProgram',
  'miniGame',
  'miniProgramPlugin',
  'miniGamePlugin'
] as const
type Type = (typeof typeDic)[number]

export const filterType = (type?: string): Type => {
  if (typeDic.find(item => item === type)) {
    return type as Type
  }
  return 'miniProgram'
}
export const filterMode = (type?: string): Mode => {
  if (modeDic.find(item => item === type)) {
    return type as Mode
  }
  return 'upload'
}

export type CiOption = {
  mode: Mode
  appid: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setting?: any
  type: Type
  projectPath: string
  privateKey?: string
  privateKeyPath?: string
  ignores?: string[]
  version: string
  desc?: string
  robot?: number
  threads?: number
}

export type Upload = CiOption & {}

const qrcodeFormatDic = ['base64', 'image', 'terminal'] as const
type qrcodeFormat = (typeof qrcodeFormatDic)[number]

export const filterQrcodeFormat = (type?: string): qrcodeFormat => {
  if (qrcodeFormatDic.find(item => item === type)) {
    return type as qrcodeFormat
  }
  return 'terminal'
}

export type Preview = CiOption & {
  qrcodeFormat: qrcodeFormat
  qrcodeOutputDest: string
  pagePath?: string
  searchQuery?: string
  scene?: number
}
