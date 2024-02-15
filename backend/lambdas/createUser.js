import bcrypt from "bcryptjs";
import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers, shortUid } from "../utils.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware.js";

const createUserHandler = async (event) => {
  const obj = event.body;
  const ddb = connectDynamoDB();

  const getItemParams = {
    Key: {
      username: {
        S: obj.username,
      },
    },
    TableName: "users",
  };

  const res = await ddb.getItem(getItemParams).promise();

  if (res.Item) {
    const body = JSON.stringify({
      err: "A user with the same username already exists!",
    });
    return {
      statusCode: 422,
      headers,
      body,
    };
  }

  const hashedPassword = await bcrypt.hash(obj.password, 5);

  const params = {
    TableName: "users",
    Item: {
      id: {
        S: shortUid(),
      },
      username: {
        S: obj.username,
      },
      password: {
        S: hashedPassword,
      },
      role: {
        S: obj.role,
      },
    },
  };

  await ddb.putItem(params).promise();

  const body = JSON.stringify({
    status: "OK",
  });
  return {
    statusCode: 200,
    headers,
    body,
  };
};

export const createUser = middy(createUserHandler)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(roleValidationMiddleware());
