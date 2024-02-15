import { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Form.module.css";

type FormPropTypes = {
  headerText: string;
  buttonText: string;
  onUsernameChangeHandler: (value: string) => void;
  onPasswordChangeHandler: (value: string) => void;
  onRoleChangeHandler?: (value: "Admin" | "Simple") => void;
  onSubmitHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  withRole?: boolean;
  isLoading: boolean;
};

const Form: FC<FormPropTypes> = ({
  headerText,
  buttonText,
  onUsernameChangeHandler,
  onPasswordChangeHandler,
  onRoleChangeHandler,
  onSubmitHandler,
  withRole,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h1>{headerText}</h1>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username: </label>
          <br />
          <input
            type="text"
            id="username"
            className={styles.input}
            onChange={(e) => onUsernameChangeHandler(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password: </label>
          <br />
          <input
            type="password"
            id="password"
            className={styles.input}
            onChange={(e) => onPasswordChangeHandler(e.target.value)}
          />
        </div>
        {withRole && (
          <div className={styles.formGroup}>
            <label htmlFor="role">Role: </label>
            <br />
            <select
              id="role"
              className={styles.select}
              onChange={(e) =>
                onRoleChangeHandler!(e.target.value as "Admin" | "Simple")
              }
            >
              <option>Admin</option>
              <option>Simple</option>
            </select>
          </div>
        )}
        <div className={styles.controlButtons}>
          {withRole && (
            <button
              type="button"
              className={styles.button}
              onClick={() => navigate("/home")}
            >
              Back!
            </button>
          )}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
