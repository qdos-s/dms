import AWS from "aws-sdk";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { connectDynamoDB, headers } from "../utils.js";

const getDocumentsHandler = async (event) => {
  const dynamodb = connectDynamoDB();

  const pageSize = parseInt(event.queryStringParameters.pageSize);
  const sortBy = event.queryStringParameters.sortBy;
  const scanIndex = event.queryStringParameters.scanIndex;
  const searchText = event.queryStringParameters.searchText;
  const lastEvaluatedKey = event.body.lastEvaluatedKey;

  const limit = pageSize + 1;

  let params = {
    TableName: "documents",
    ExpressionAttributeNames: { "#name": "name" },
    ProjectionExpression: "fileId, #name, queryKey, createdBy",
    KeyConditionExpression: "queryKey = :key",
    ExpressionAttributeValues: {
      ":key": { S: "exist" },
    },
    IndexName: "nameAndQueryKey",
    Limit: limit,
    ScanIndexForward: scanIndex === "true",
  };

  if (lastEvaluatedKey?.fileId) params.ExclusiveStartKey = lastEvaluatedKey;
  if (searchText) {
    params.ExpressionAttributeValues[":search"] = { S: searchText };
    params.KeyConditionExpression += ` and begins_with(#name, :search)`;
  }

  const queryResult = await dynamodb.query(params).promise();

  const items = queryResult.Items.slice(0, 5).map((item) => {
    return AWS.DynamoDB.Converter.unmarshall(item);
  });

  if (
    (scanIndex === "false" && sortBy !== "DESC") ||
    (scanIndex === "true" && sortBy === "DESC")
  )
    items.reverse();

  const isNextRecord =
    queryResult.Items.length === limit ||
    (scanIndex === "false" && sortBy !== "DESC") ||
    (scanIndex === "true" && sortBy === "DESC");

  const body = JSON.stringify({
    documents: items,
    lastEvaluatedKey: queryResult.Items[4] ?? null,
    isNextRecord,
  });

  return {
    statusCode: 200,
    headers,
    body,
  };
};

export const getDocuments = middy(getDocumentsHandler)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());
