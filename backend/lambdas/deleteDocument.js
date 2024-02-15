import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers, s3 } from "../utils.js";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware.js";

const deleteDocumentHandler = async (event) => {
  const ddb = connectDynamoDB();
  const obj = event.body;

  const params = {
    Key: {
      fileId: {
        S: obj.fileId,
      },
    },
    TableName: "documents",
  };

  const foundDocument = await ddb.getItem(params).promise();

  if (foundDocument.Item) {
    await ddb.deleteItem(params).promise();

    const deleteParams = {
      Bucket: "documents",
      Key: `${obj.fileId}_${obj.filename}`,
    };

    await s3.deleteObject(deleteParams).promise();

    const body = JSON.stringify({
      status: "OK",
    });
    return {
      statusCode: 200,
      headers,
      body,
    };
  }

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      err: "Something went wrong!",
    }),
  };
};

export const deleteDocument = middy(deleteDocumentHandler)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(roleValidationMiddleware());
