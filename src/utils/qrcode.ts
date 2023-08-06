import Jimp from 'jimp'
import jsQR, {QRCode} from 'jsqr'
import qrcodeTerminal from 'qrcode-terminal'

export const getQrCode = async (path: string): Promise<QRCode> => {
  const jimp = await Jimp.read(path)
  const pixels = Uint8ClampedArray.from(jimp.bitmap.data)
  const qrcode = jsQR(pixels, jimp.getWidth(), jimp.getHeight())
  if (!qrcode) {
    throw Error(`get '${path}' file data failure`)
  }
  return qrcode
}

export const generate = async (qrcode: QRCode): Promise<string> => {
  return new Promise(RES => {
    qrcodeTerminal.generate(
      qrcode.data,
      {
        small: true
      },
      (res: string) => {
        RES(res.trim())
      }
    )
  })
}
