import { Injectable } from '@nestjs/common'
import { createWriteStream } from 'fs'
import { join } from 'path'
import fse from 'fs-extra'
import dayjs from 'dayjs'

import { uploadResponse } from './interface/upload.interface'

@Injectable()
export class UploadService {
  upload(file: Express.Multer.File): Promise<uploadResponse> {
    return new Promise((resolve, reject) => {
      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      const name = `${dayjs().format('HHmmssSSS')}-${originalname}`
      const path = join(__dirname, `../../upload/${dayjs().format('YYYYMMDD')}`, name)
      fse.ensureFileSync(path)

      const writeImage = createWriteStream(path)

      const fileData = file.buffer
      writeImage.on('open', () => {
        const blockSize = 128
        const nbBlocks = Math.ceil(fileData.length / blockSize)
        for (let i = 0; i < nbBlocks; i += 1) {
          const currentBlock = fileData.subarray(blockSize * i, Math.min(blockSize * (i + 1), fileData.length))
          writeImage.write(currentBlock)
        }
        writeImage.end()
      })

      writeImage.on('error', (err) => {
        reject({ res: null, err })
      })
      writeImage.on('finish', () => {
        resolve({ res: { path, name }, err: null })
      })
    })
  }
}
