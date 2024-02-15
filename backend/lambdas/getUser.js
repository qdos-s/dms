import bcrypt from "bcryptjs";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers } from "../utils.js";

const getUserHandler = async (event) => {
  const obj = event.body;
  const ddb = connectDynamoDB();
  const params = {
    Key: {
      username: {
        S: obj.username,
      },
    },
    TableName: "users",
  };

  const res = await ddb.getItem(params).promise();

  if (res.Item) {
    const isValid = await bcrypt.compare(obj.password, res.Item.password.S);
    if (isValid) {
      const user = AWS.DynamoDB.Converter.unmarshall(res.Item);
      const token = jwt.sign(
        { username: user.username, role: user.role },
        "secret-key",
      );
      const body = JSON.stringify({
        status: "OK",
        user,
        token,
      });
      return {
        statusCode: 200,
        headers,
        body,
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          err: "Wrong password!",
        }),
      };
    }
  } else {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        err: "User does not exist!",
      }),
    };
  }
};

export const getUser = middy(getUserHandler)
  .use(jsonBodyParser())
  .use(httpErrorHandler());
