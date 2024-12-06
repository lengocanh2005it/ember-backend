import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { config } from 'dotenv';

config();

@Injectable()
export class UploadsService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT!,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
  }

  public uploadFile = async (
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<{ url: string }> => {
    await this.checkBucketExist(bucketName);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return {
      url: `${process.env.MINIO_ENDPOINT}/${bucketName}/${file.originalname}`,
    };
  };

  private checkBucketExist = async (bucketName: string): Promise<void> => {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (err) {
      if (err.name === 'NotFound' || err.name === 'NoSuchBucket') {
        await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      } else throw err;
    }
  };
}
