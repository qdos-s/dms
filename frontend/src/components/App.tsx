import "../styles/App.module.css";

import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { decodeToken } from "../utils/decodeToken.ts";
import Login from "./Login.tsx";
import MainPage from "./MainPage.tsx";
import Registration from "./Registration.tsx";

const App = () => {
  const [token, setToken] = useState<string | null>(
    JSON.parse(localStorage.getItem("token") ?? "null"),
  );
  const user = decodeToken(token ?? undefined);

  const logIn = (token: string) => setToken(token);

  const logOut = () => setToken(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={
              user ? (
                <Navigate to={"/home"} replace />
              ) : (
                <Navigate to={"/login"} replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={"/home"} replace />
              ) : (
                <Login onLogin={logIn} />
              )
            }
          />
          <Route
            path="/home"
            element={
              user ? <MainPage onLogout={logOut} /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/registration"
            element={
              user && user?.role === "admin" ? (
                <Registration />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
