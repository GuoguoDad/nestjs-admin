import { ApiProperty } from '@nestjs/swagger'

export class FileUploadReq {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File
}

export class FilesUploadReq {
  @ApiProperty({ type: 'string', format: 'binary' })
  files: Express.Multer.File[]
}
