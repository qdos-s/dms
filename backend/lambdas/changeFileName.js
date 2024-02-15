import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { connectDynamoDB, headers, s3 } from "../utils.js";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware.js";

const changeFileNameHandler = async (event) => {
  const obj = event.body;
  const ddb = connectDynamoDB();

  const getParams = {
    Bucket: "documents",
    Key: `${obj.fileId}_${obj.oldFileName}`,
  };

  s3.getObject(getParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      const deleteParams = {
        Bucket: "documents",
        Key: `${obj.fileId}_${obj.oldFileName}`,
      };
      const dataObj = data;

      s3.deleteObject(deleteParams, function (err) {
        if (err) {
          console.log("Error", err);
        } else {
          const putParams = {
            Bucket: "documents",
            Key: `${obj.fileId}_${obj.newFileName}`,
            Body: dataObj.Body,
          };

          s3.putObject(putParams, function (err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data);
            }
          });
        }
      });
    }
  });

  const params = {
    TableName: "documents",
    Key: {
      fileId: {
        S: obj.fileId,
      },
    },
    UpdateExpression: "set #name = :r",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":r": {
        S: obj.newFileName,
      },
    },
  };

  await ddb.updateItem(params).promise();

  const body = JSON.stringify({
    status: "OK",
  });
  return {
    statusCode: 200,
    headers,
    body,
  };
};

export const changeFileName = middy(changeFileNameHandler)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(roleValidationMiddleware());
