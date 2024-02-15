export const setAuthHeader = () => {
  const tkn = JSON.parse(localStorage.getItem("token") || "null");
  if (!tkn) throw new Error("token is null");
  return `Bearer ${tkn}`;
};
