import { ChangeEvent, FC } from "react";
import { BeatLoader } from "react-spinners";

import noFilesIcon from "../assets/noFilesIcon.png";
import File from "../components/File.tsx";
import styles from "../styles/Files.module.css";
import { ActiveUserType, ChangeFileNameTypes, FileProps } from "../types";
import Options from "./Options.tsx";
import Pagination from "./Pagination.tsx";

type FilesPropTypes = {
  isFileLoading: boolean;
  files: FileProps[];
  fileToDelete: FileProps | null;
  fileToUploadVersion: FileProps | null;
  fileToUpdateFileName: FileProps | null;
  activeUser: ActiveUserType;
  downloadAs: (fileId: string, name: string) => Promise<void>;
  handleUploadNewVersion: (file: FileProps) => void;
  handleChangeFileName: (file: FileProps) => void;
  handleDelete: (file: FileProps) => Promise<void>;
  showModal: boolean;
  handleClose: () => void;
  uploadFile: (file: File | null) => Promise<void>;
  changeFileName: (body: ChangeFileNameTypes) => Promise<void>;
  isFileUploading: boolean;
  setShowModal: (value: boolean) => void;
  handleOnSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  handleSearch: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  currentPage: number;
  isNextRecord: boolean;
};

const Files: FC<FilesPropTypes> = ({
  isFileLoading,
  files,
  fileToDelete,
  fileToUploadVersion,
  fileToUpdateFileName,
  activeUser,
  downloadAs,
  handleUploadNewVersion,
  handleChangeFileName,
  handleDelete,
  showModal,
  handleClose,
  uploadFile,
  changeFileName,
  isFileUploading,
  setShowModal,
  handleOnSelectChange,
  onSearchChange,
  searchText,
  handleSearch,
  handlePrevPage,
  handleNextPage,
  currentPage,
  isNextRecord,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Options
          handleOnSelectChange={handleOnSelectChange}
          onSearchChange={onSearchChange}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        {!isFileLoading ? (
          <div className={styles.files}>
            {!!files.length &&
              files.map((file: FileProps) => {
                return (
                  <File
                    key={file.fileId}
                    file={file}
                    fileToDelete={fileToDelete}
                    fileToUploadVersion={fileToUploadVersion}
                    fileToUpdateFileName={fileToUpdateFileName}
                    downloadAs={downloadAs}
                    activeUser={activeUser}
                    handleUploadNewVersion={handleUploadNewVersion}
                    handleChangeFileName={handleChangeFileName}
                    handleDelete={handleDelete}
                    showModal={showModal}
                    handleClose={handleClose}
                    uploadFile={uploadFile}
                    changeFileName={changeFileName}
                    setShowModal={setShowModal}
                  />
                );
              })}
            {!files.length && (
              <>
                <div className={styles.content}>
                  <img
                    src={noFilesIcon}
                    className={styles.notFoundIcon}
                    alt="No files to display!"
                  />
                </div>
                <div className={styles.fallback}>No files to display!</div>
              </>
            )}
          </div>
        ) : (
          <BeatLoader color="#ffffff" />
        )}
        {isFileUploading && <BeatLoader color="#ffffff" />}
        <Pagination
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          currentPage={currentPage}
          isNextRecord={isNextRecord}
        />
      </div>
    </div>
  );
};

export default Files;
