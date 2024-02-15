import { ChangeEvent, FC, useState } from "react";
import Modal from "react-overlays/Modal";

import inputStyles from "../styles/MainPage.module.css";
import modalStyles from "../styles/SimpleModal.module.css";
import { ChangeFileNameTypes, FileProps } from "../types";

type ModalPropTypes = {
  showModal: boolean;
  handleClose: () => void;
  title: string;
  fileToUploadVersion?: FileProps;
  fileToUpdateFileName?: FileProps;
  uploadFile?: (file: File | null) => Promise<void>;
  changeFileName?: (obj: ChangeFileNameTypes) => void;
  setShowModal: (value: boolean) => void;
};

const renderBackdrop = (props: any) => (
  <div className={modalStyles.backdrop} {...props} />
);

const SimpleModal: FC<ModalPropTypes> = ({
  showModal,
  handleClose,
  title,
  fileToUploadVersion,
  fileToUpdateFileName,
  uploadFile,
  changeFileName,
  setShowModal,
}) => {
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setNewFile(file);
  };

  return (
    <Modal
      className={modalStyles.modal}
      show={showModal}
      onHide={handleClose}
      renderBackdrop={renderBackdrop}
    >
      <div>
        <div className={modalStyles["modal-header"]}>
          <div className={modalStyles["modal-title"]}>{title}</div>
          <div>
            <span className={modalStyles["close-button"]} onClick={handleClose}>
              x
            </span>
          </div>
        </div>
        {!!fileToUploadVersion && (
          <div className={modalStyles["modal-content"]}>
            <div className={inputStyles.upload}>
              <label className={inputStyles["input-file"]}>
                <input type="file" name="file" onChange={handleFileChange} />
                {newFile ? (
                  <span>{newFile.name}</span>
                ) : (
                  <span>Choose File!</span>
                )}
              </label>
              <button
                className={inputStyles.button}
                onClick={() => {
                  setShowModal(false);
                  uploadFile!(newFile);
                }}
                disabled={fileToUploadVersion.name !== newFile?.name}
              >
                Upload File!
              </button>
            </div>
          </div>
        )}
        {!!fileToUpdateFileName && (
          <div className={modalStyles["modal-content"]}>
            <input
              defaultValue={fileToUpdateFileName.name}
              type="text"
              onChange={handleOnChange}
              className={modalStyles.input}
            />
            <button
              className={inputStyles.button}
              onClick={() => {
                setShowModal(false);
                changeFileName!({
                  oldFileName: fileToUpdateFileName.name,
                  newFileName,
                  fileId: fileToUpdateFileName.fileId,
                });
              }}
              disabled={
                newFileName.trim().length < 1 ||
                fileToUpdateFileName.name === newFileName.trim()
              }
            >
              Update!
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SimpleModal;
