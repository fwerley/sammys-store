import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default {
    async image(req: Request, res: Response) {
        const { folder } = req.body;
        const streamUpload = (req: Request) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder
                }, (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file!.buffer).pipe(stream);
            })
        };
        try {
            const result = await streamUpload(req);
            res.send(result);
        } catch (error) {
            console.log(error)
        }
    }
}