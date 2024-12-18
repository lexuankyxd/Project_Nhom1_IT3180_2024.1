import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function uploadToBucket(buffer, name, type) {
  const key = name + "__" + randomImageName();
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: type,
  };
  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    return key;
  } catch (err) {
    console.log("Error when uploading to bucket", err);
    throw Error("bucket upload error");
  }
}

export async function deleteFromBucket(key) {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
  } catch (err) {
    console.log("Error when deleting from bucket", err);
  }
}
