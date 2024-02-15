import "react-toastify/dist/ReactToastify.css";

import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { setAuthHeader } from "../utils/setAuthHeader.ts";
import Form from "./Form.tsx";

const Registration = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<"Admin" | "Simple">("Admin");

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4566/restapis/gfpzkgjitd/local/_user_request_/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: setAuthHeader(),
          },
          body: JSON.stringify({
            username,
            password,
            role: role.toLowerCase(),
          }),
        },
      );
      const result = await response.json();
      if (result.status === "OK") {
        toast.success(`${username} has been successfully created!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(result.err, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setIsLoading(false);
    } catch (e) {
      toast.error(`Failed to create ${username}!`, {
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

  const onRoleChangeHandler = (value: "Admin" | "Simple") => {
    setRole(value);
  };

  return (
    <>
      <Form
        headerText={"Register New User!"}
        buttonText={"Register!"}
        onUsernameChangeHandler={onUsernameChangeHandler}
        onPasswordChangeHandler={onPasswordChangeHandler}
        onRoleChangeHandler={onRoleChangeHandler}
        onSubmitHandler={onSubmitHandler}
        isLoading={isLoading}
        withRole
      />
      <ToastContainer />
    </>
  );
};

export default Registration;
