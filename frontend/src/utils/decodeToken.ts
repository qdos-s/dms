import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  username: string;
  role: "admin" | "simple";
};

export const decodeToken = (token?: string) => {
  let tkn = token;
  if (!tkn) {
    tkn = JSON.parse(localStorage.getItem("token") || "null");
  }
  if (tkn) {
    const decoded = jwtDecode(tkn!) as JwtPayload;
    return {
      username: decoded.username,
      role: decoded.role,
    };
  }
  return null;
};
