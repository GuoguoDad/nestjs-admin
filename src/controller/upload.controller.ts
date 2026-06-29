import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger'

import { FileUploadReq, FilesUploadReq } from '../dto/request/file.upload.req'
import { UploadService } from '../service/upload.service'
import { ApiException } from '../infrastructure/exception/api.exception'

@ApiTags('UploadController')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '单文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件上传',
    type: FileUploadReq,
  })
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    return await this.uploadService.upload(file)
  }

  @ApiOperation({ summary: '多文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件上传',
    type: FilesUploadReq,
  })
  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: any[]) {
    if (files.length === 0) {
      throw new ApiException('参数有误')
    }
    const urls = []
    for (const file of files) {
      const { err, res } = await this.uploadService.upload(file)
      if (!err) {
        urls.push(res.path)
      }
    }
    return urls
  }
}
