import { headers } from "../utils.js";

export const roleValidationMiddleware = () => {
  return {
    before: async (handler) => {
      const decoded = handler.decoded;
      if (decoded.role !== "admin") {
        const body = JSON.stringify({
          err: "Available only for admins!",
        });
        return {
          statusCode: 403,
          headers,
          body,
        };
      }
    },
  };
};
