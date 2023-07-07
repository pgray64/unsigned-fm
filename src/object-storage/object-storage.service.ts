import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class ObjectStorageService {
  private s3OriginEndpoint: string;
  private s3CdnUrl: string;
  private s3Region: string;
  private s3KeyId: string;
  private s3SecretKey: string;
  private s3Bucket: string;
  private s3Client: S3Client;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.s3OriginEndpoint = this.configService.getOrThrow('S3_ORIGIN_ENDPOINT');
    this.s3CdnUrl = this.configService.getOrThrow('S3_CDN_URL');
    this.s3Region = this.configService.getOrThrow('S3_REGION');
    this.s3KeyId = this.configService.getOrThrow('S3_KEY_ID');
    this.s3SecretKey = this.configService.getOrThrow('S3_SECRET_KEY');
    this.s3Bucket = this.configService.getOrThrow('S3_BUCKET');

    this.s3Client = new S3Client({
      endpoint: this.s3OriginEndpoint,
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      region: this.s3Region,
      credentials: {
        accessKeyId: this.s3KeyId,
        secretAccessKey: this.s3SecretKey,
      },
    });
  }

  async uploadObjectFromUrl(params: {
    urlToUpload: string;
    key: string;
    isPublic: boolean;
  }) {
    const response = await firstValueFrom(
      this.httpService.get(params.urlToUpload, {
        responseType: 'arraybuffer',
      }),
    ).catch((e: any) => {
      Logger.error(
        e,
        'Failed to download content from url for s3 upload: ' +
          params.urlToUpload,
      );
      throw e;
    });
    const buffer = Buffer.from(response.data, 'base64');
    const putParams = {
      //file name you can get from URL or in any other way, you could then pass it as parameter to the function for example if necessary
      Key: params.key,
      Body: buffer,
      Bucket: this.s3Bucket,
      ACL: params.isPublic ? 'public-read' : 'private',
    };

    await this.s3Client
      .send(new PutObjectCommand(putParams))
      .catch((e: any) => {
        Logger.error(
          e,
          'Failed to upload content from the following url: ' +
            params.urlToUpload,
        );
        throw e;
      });
  }
  getUniqueObjectKey(folder?: string): string {
    return (folder ? folder + '/' : '') + randomUUID();
  }
  getFullObjectUrl(key: string | undefined | null): string | null {
    if (!key) {
      return null;
    }
    return this.s3CdnUrl + '/' + key;
  }
}
