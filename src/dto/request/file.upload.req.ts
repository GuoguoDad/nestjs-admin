import { ApiProperty } from '@nestjs/swagger';

export class FileUploadReq {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

export class FilesUploadReq {
    @ApiProperty({type: 'string', format: 'binary' })
    files: any[];
}