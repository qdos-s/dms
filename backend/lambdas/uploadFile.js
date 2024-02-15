import parser from "lambda-multipart-parser";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers, s3, shortUid } from "../utils.js";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware.js";

const uploadFileHandler = async (event) => {
  const ddb = connectDynamoDB();
  const uid = shortUid();

  const res = await parser.parse(event);

  const file = res.files[0].content;
  const filename = res.filename;
  const username = res.username;
  const isUploadingNewVersion = res.isUploadingNewVersion === "true";
  const fileId = res.fileId;

  let uploadParams;

  if (isUploadingNewVersion && fileId) {
    uploadParams = {
      Bucket: "documents",
      Key: `${fileId}_${filename}`,
      Body: file,
    };
  } else {
    uploadParams = {
      Bucket: "documents",
      Key: `${uid}_${filename}`,
      Body: file,
    };
  }

  const result = await s3.upload(uploadParams).promise();

  if (isUploadingNewVersion && fileId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: "OK",
      }),
    };
  }

  if (result) {
    const params = {
      TableName: "documents",
      Item: {
        fileId: {
          S: uid,
        },
        name: {
          S: filename,
        },
        createdBy: {
          S: username,
        },
      },
    };

    await ddb.putItem(params).promise();
  }

  const body = JSON.stringify({
    status: "OK",
    file: {
      fileId: uid,
      name: filename,
      createdBy: username,
    },
  });
  return {
    statusCode: 200,
    headers,
    body,
  };
};

export const uploadFile = middy(uploadFileHandler)
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(roleValidationMiddleware());
