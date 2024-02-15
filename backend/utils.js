import AWS from "aws-sdk";
import { uuid as uuidv4 } from "uuidv4";

export const headers = {
  "content-type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

const LOCALSTACK_HOSTNAME = process.env.LOCALSTACK_HOSTNAME;
const ENDPOINT = `http://${LOCALSTACK_HOSTNAME}:4566`;
if (LOCALSTACK_HOSTNAME) {
  process.env.AWS_SECRET_ACCESS_KEY = "test";
  process.env.AWS_ACCESS_KEY_ID = "test";
}

export const shortUid = () => uuidv4().substring(0, 8);

const CLIENT_CONFIG = LOCALSTACK_HOSTNAME ? { endpoint: ENDPOINT } : {};

export const connectDynamoDB = () => new AWS.DynamoDB(CLIENT_CONFIG);

export const s3 = new AWS.S3({
  ...CLIENT_CONFIG,
  s3ForcePathStyle: true,
  signatureVersion: "v2",
});
s3.api.globalEndpoint = LOCALSTACK_HOSTNAME;
