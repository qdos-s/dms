import { ChangeEvent, FC } from "react";

import styles from "../styles/Options.module.css";

type OptionsPropTypes = {
  handleOnSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  handleSearch: () => void;
};

const Options: FC<OptionsPropTypes> = ({
  handleOnSelectChange,
  onSearchChange,
  searchText,
  handleSearch,
}) => {
  return (
    <div className={styles.options}>
      <div className={styles.option}>
        <div className={styles.sorting}>Sorting: </div>
        <select className={styles.select} onChange={handleOnSelectChange}>
          <option>IDLE</option>
          <option>ASC</option>
          <option>DESC</option>
        </select>
      </div>
      <div className={styles.option}>
        <input
          type="text"
          placeholder={"Search..."}
          className={styles.input}
          onChange={onSearchChange}
          value={searchText}
          onBlur={handleSearch}
        />
        <button className={styles.search} onClick={handleSearch}>
          Search!
        </button>
      </div>
    </div>
  );
};

export default Options;
