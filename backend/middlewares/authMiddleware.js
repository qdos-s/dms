import jwt from "jsonwebtoken";
import { headers } from "../utils.js";

export const authMiddleware = () => {
  return {
    before: async (handler) => {
      const event = handler.event;
      const authHeader = event.headers.authorization;
      const tkn = authHeader.split(" ")[1];
      const decode = jwt.verify(tkn, "secret-key");
      if (!decode.iat) {
        const body = JSON.stringify({
          err: "Unauthorized!",
        });
        return {
          statusCode: 401,
          headers,
          body,
        };
      }
      handler.decoded = decode;
    },
  };
};
