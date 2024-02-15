import { FC } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Header.module.css";
import { ActiveUserType } from "../types";

type HeaderPropTypes = {
  activeUser: ActiveUserType;
  onLogout: () => void;
};

const Header: FC<HeaderPropTypes> = ({ activeUser, onLogout }) => {
  return (
    <div className={styles.header}>
      <div className={styles.group}>
        <img
          src="https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/document.svg"
          alt="icon"
          height="30px"
          width="30px"
        />
        <p>Document Management System</p>
      </div>
      <div className={styles.group}>
        {activeUser.role === "admin" && (
          <Link to="/registration" className={styles.button}>
            Register New User!
          </Link>
        )}
        <button
          onClick={() => {
            onLogout();
            localStorage.removeItem("token");
          }}
          className={styles.button}
        >
          Logout!
        </button>
      </div>
    </div>
  );
};

export default Header;
