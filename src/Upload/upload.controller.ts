import { Controller, Get, Post, UseInterceptors, Param, Res, UnsupportedMediaTypeException, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import { File } from './upload.interface';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = ('public')
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    (
        // file.mimetype === 'image/jpg' ||
        // file.mimetype === 'image/jpeg' ||
        // file.mimetype === 'image/gif' ||
        // file.mimetype === 'application/pdf' ||
        // file.mimetype === 'text/plain' ||
        file.mimetype === 'image/vnd.adobe.photoshop' ||
        file.mimetype === 'application/x-photoshop' ||
        file.mimetype === 'application/photoshop' ||
        file.mimetype === 'application/psd' ||
        file.mimetype === 'image/psd' ||
        file.mimetype === 'application/postscript' ||
        file.mimetype === 'image/tiff' ||
        file.mimetype === 'video/quicktime' ||
        file.mimetype === 'application/vnd.audiograph' ||
        file.mimetype === 'application/x-indesign'
    ) ? cb(null, true) : cb(new UnsupportedMediaTypeException('Invalid file type'));
};

@Controller()
export class UploadController {
    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor({
        storage: fileStorage,
        fileFilter: fileFilter,
        limits: { fileSize: 1024 * 1024 * 60 }
    }))
    uploadFile(@UploadedFiles() files: File[], @Res() res) {
        const resualt = files.map(file => {
            return {
                name: file.fieldname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }
        })
        return res.status(201).send(resualt);
    }

    @Get('public/:fileId')
    download(@Param('fileId') fileId, @Res() res) {
        return res.sendFile(fileId, { root: 'public' });
    };
}
