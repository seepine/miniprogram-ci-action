import {CiOption} from '../type'
import * as core from '@actions/core'

export const getArgs = (option: CiOption): string[] => {
  const args = []
  if (option.version) {
    args.push(...[' --app-version', `'${option.version}'`])
  }
  if (option.desc) {
    args.push(...['--app-changelog', `'${option.desc}'`])
  }
  core.debug(args.toString())
  return args
}
