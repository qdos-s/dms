import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers } from "../utils.js";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const getDocumentsHandler = async () => {
  const dynamodb = connectDynamoDB();

  const params = {
    TableName: "documents",
  };

  const scanResult = await dynamodb.scan(params).promise();

  const items = scanResult["Items"].map((x) => {
    Object.keys(x).forEach((attr) => {
      if ("S" in x[attr]) x[attr] = x[attr].S;
      else x[attr] = x[attr][Object.keys(x[attr])[0]];
    });
    return x;
  });

  const body = JSON.stringify({
    documents: items,
  });
  return {
    statusCode: 200,
    headers,
    body,
  };
};

export const getDocuments = middy(getDocumentsHandler)
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .use(authMiddleware());
