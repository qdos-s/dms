import "react-toastify/dist/ReactToastify.css";

import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Form from "./Form.tsx";

type LoginPropTypes = {
  onLogin: (token: string) => void;
};

const Login: FC<LoginPropTypes> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4566/restapis/8kpvlotq3a/local/_user_request_/getUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );
      const result = await response.json();
      if (result.status === "OK" && result.user) {
        onLogin(result.token);
        localStorage.setItem("token", JSON.stringify(result.token));
        navigate("/home");
      } else {
        toast.error(result.err, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setIsLoading(false);
    } catch (e) {
      toast.error(`Failed to login!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
    }
  };

  const onUsernameChangeHandler = (value: string) => {
    setUsername(value);
  };

  const onPasswordChangeHandler = (value: string) => {
    setPassword(value);
  };

  return (
    <>
      <Form
        headerText={"Login to proceed!"}
        buttonText={"Login!"}
        onUsernameChangeHandler={onUsernameChangeHandler}
        onPasswordChangeHandler={onPasswordChangeHandler}
        onSubmitHandler={onSubmitHandler}
        isLoading={isLoading}
      />

      <ToastContainer />
    </>
  );
};

export default Login;
