import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../config/env";
import { IFileStorage } from "../../../domain/service/fileStorage.service";
import { randomUUID } from "crypto";

export class S3FileStorage implements IFileStorage {
    private _s3: S3Client;

    constructor() {
        this._s3 = new S3Client({
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY
            }
        })
    }

    async upload(
        data: { file: Buffer; folder: string ,contentType:string}
    ): Promise<string> {
        const key = `${data.folder}/${randomUUID()}`;

        await this._s3.send(
            new PutObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key: key,
                Body: data.file,
                ContentType: data.contentType,      // image/png, image/jpeg, etc.
                ContentDisposition: "inline",
            })
        )
        return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
    }

    async delete(fileKeyOrUrl: string): Promise<void> {
        const key = this._extractKey(fileKeyOrUrl)

        await this._s3.send(
            new DeleteObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key: key
            })
        )
    }
    private _extractKey(urlOrKey: string): string {
        if (!urlOrKey.startsWith('http')) {
            return urlOrKey;
        }
        const url = new URL(urlOrKey);
        return url.pathname.slice(1)
    }

}