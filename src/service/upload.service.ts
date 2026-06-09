import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';

import { uploadResponse } from './interface/upload.interface';

@Injectable()
export class UploadService {
    upload(file): Promise<uploadResponse> {
        return new Promise((resolve, reject) => {
          const name = `${Date.now()}-${file.originalname}`;
          const path = join(__dirname, '../../upload/files', name);
          const writeImage = createWriteStream(path);

          const fileData = file.buffer;
          writeImage.on('open', () => {
            const blockSize = 128;
            const nbBlocks = Math.ceil(fileData.length / (blockSize));
            for (let i = 0; i < nbBlocks; i += 1) {
              const currentBlock = fileData.slice(
                blockSize * i,
                Math.min(blockSize * (i + 1), fileData.length),
              );
              writeImage.write(currentBlock);
            }
            writeImage.end();
          });

          writeImage.on('error', (err) => { reject({ res: null, err }); });
          writeImage.on('finish', () => { resolve({ res: { path, name }, err: null }); });
        });
    }
}
