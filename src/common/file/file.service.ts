import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
    static multerConfig(){
        return multer.diskStorage({
            destination: (req, file, cb) =>{
                const UploadPath = "E:/pitchPerfect/imgs/userProfile";

                if(!fs.existsSync(UploadPath)) {
                    fs.mkdirSync(UploadPath, {recursive: true});
                }

                cb(null, UploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                const fileExtenstion = extname(file.originalname);
                cb(null, uniqueSuffix + fileExtenstion);
            }
        })
    }
}
