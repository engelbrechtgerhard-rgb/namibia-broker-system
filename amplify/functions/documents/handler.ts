import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});
const BUCKET = process.env.BUCKET_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  try {
    // Generate presigned upload URL
    if (method === 'POST' && path === '/documents/upload-url') {
      const { key, contentType } = JSON.parse(event.body ?? '{}');
      const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }), { expiresIn: 300 });
      return respond(200, { url, key });
    }

    // Generate presigned download URL
    if (method === 'GET' && path.startsWith('/documents/download-url')) {
      const key = event.queryStringParameters?.key ?? '';
      const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 300 });
      return respond(200, { url });
    }

    // List documents for an entity
    if (method === 'GET' && path.startsWith('/documents/list')) {
      const prefix = event.queryStringParameters?.prefix ?? '';
      const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
      const files = (result.Contents ?? []).map((o) => ({ key: o.Key, size: o.Size, lastModified: o.LastModified }));
      return respond(200, files);
    }

    // Delete document
    if (method === 'DELETE' && path.startsWith('/documents/')) {
      const key = decodeURIComponent(path.replace('/documents/', ''));
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      return respond(200, { deleted: key });
    }

    return respond(404, { message: 'Route not found' });
  } catch (err) {
    console.error(err);
    return respond(500, { message: 'Internal server error' });
  }
};

const respond = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
