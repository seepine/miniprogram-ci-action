import {test} from '@jest/globals'
import {getQrCode, generate} from '../src/utils/qrcode'

test('qrcode generate', async () => {
  const qrcodeData = await getQrCode('./__tests__/dist/preview.png')
  const qrcode = await generate(qrcodeData)
  console.log(qrcode)
})
