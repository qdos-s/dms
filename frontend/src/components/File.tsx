import { FC } from "react";
import { BeatLoader } from "react-spinners";

import deleteIcon from "../assets/deleteIcon.png";
import editIcon from "../assets/editIcon.png";
import uploadImg from "../assets/uploadImg.png";
import { override } from "../commons";
import styles from "../styles/File.module.css";
import { ActiveUserType, ChangeFileNameTypes, FileProps } from "../types";
import SimpleModal from "./SimpleModal.tsx";

type FilePropTypes = {
  file: FileProps;
  fileToDelete: FileProps | null;
  fileToUploadVersion: FileProps | null;
  fileToUpdateFileName: FileProps | null;
  downloadAs: (fileId: string, name: string) => Promise<void>;
  activeUser: ActiveUserType;
  handleUploadNewVersion: (file: FileProps) => void;
  handleChangeFileName: (file: FileProps) => void;
  handleDelete: (file: FileProps) => Promise<void>;
  showModal: boolean;
  handleClose: () => void;
  uploadFile: (file: File | null) => Promise<void>;
  changeFileName: (body: ChangeFileNameTypes) => Promise<void>;
  setShowModal: (value: boolean) => void;
};

const File: FC<FilePropTypes> = ({
  file,
  fileToDelete,
  fileToUploadVersion,
  fileToUpdateFileName,
  downloadAs,
  activeUser,
  handleUploadNewVersion,
  handleChangeFileName,
  handleDelete,
  showModal,
  handleClose,
  uploadFile,
  changeFileName,
  setShowModal,
}) => {
  return (
    <div
      className={
        fileToDelete?.fileId !== file.fileId &&
        fileToUploadVersion?.fileId !== file.fileId &&
        fileToUpdateFileName?.fileId !== file.fileId
          ? styles.fileContainer
          : `${styles.fileContainer} ${styles.overlay}`
      }
    >
      {fileToDelete?.fileId == file.fileId && (
        <BeatLoader color="#ffffff" cssOverride={override} />
      )}
      {fileToUploadVersion?.fileId == file.fileId && (
        <BeatLoader color="#ffffff" cssOverride={override} />
      )}
      {fileToUpdateFileName?.fileId == file.fileId && (
        <BeatLoader color="#ffffff" cssOverride={override} />
      )}
      <div className={styles.fileGroup}>
        <div
          onClick={async () => await downloadAs(file.fileId, file.name)}
          className={styles.file}
        >
          {file.name}
        </div>
        <span>
          Created By: <b>{file.createdBy}</b>
        </span>
      </div>
      {activeUser.role === "admin" && (
        <div className={styles.buttonsContainer}>
          <img
            src={uploadImg}
            className={styles.link}
            alt="Upload New Version"
            onClick={() => handleUploadNewVersion(file)}
          />
          <img
            src={editIcon}
            className={styles.link}
            alt="Rename File"
            onClick={() => handleChangeFileName(file)}
          />
          <img
            src={deleteIcon}
            className={styles.link}
            alt="Delete File"
            onClick={() => handleDelete(file)}
          />
        </div>
      )}
      {!!fileToUploadVersion && (
        <SimpleModal
          setShowModal={setShowModal}
          showModal={showModal}
          handleClose={handleClose}
          title={"Upload New Version!"}
          fileToUploadVersion={fileToUploadVersion}
          uploadFile={uploadFile}
        />
      )}
      {!!fileToUpdateFileName && (
        <SimpleModal
          setShowModal={setShowModal}
          showModal={showModal}
          handleClose={handleClose}
          title={"Change File Name!"}
          fileToUpdateFileName={fileToUpdateFileName}
          changeFileName={changeFileName}
        />
      )}
    </div>
  );
};

export default File;
