import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadService {

    async clearImage(filePath) {
        await fs.unlink(filePath, err => {
            throw new HttpException('Remove File Fail', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    };
}
