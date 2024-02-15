import { ChangeEvent, FC, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { sortByOptions } from "../commons";
import styles from "../styles/MainPage.module.css";
import { ChangeFileNameTypes, FileProps } from "../types";
import { decodeToken } from "../utils/decodeToken.ts";
import { setAuthHeader } from "../utils/setAuthHeader.ts";
import { setFilesBySortOptions } from "../utils/setFilesBySortOptions.ts";
import Files from "./Files.tsx";
import Header from "./Header.tsx";

type MainPagePropTypes = {
  onLogout: () => void;
};

const MainPage: FC<MainPagePropTypes> = ({ onLogout }) => {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null);
  const [fileToUploadVersion, setFileToUploadVersion] =
    useState<FileProps | null>(null);
  const [fileToUpdateFileName, setFileToUpdateFileName] =
    useState<FileProps | null>(null);
  const [files, setFiles] = useState<FileProps[] | []>([]);
  const [fileToDelete, setFileToDelete] = useState<FileProps | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<keyof typeof sortByOptions>("IDLE");
  const [counter, setCounter] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsFileLoading(true);
      const response = await fetch(
        "http://localhost:4566/restapis/gfpzkgjitd/local/_user_request_/getDocuments",
        {
          method: "POST",
          headers: {
            Authorization: setAuthHeader(),
          },
        },
      );
      const res = await response.json();
      if (res.documents.length) {
        const filteredFiles = isSearching
          ? res.documents.filter((doc: FileProps) =>
              doc.name.includes(searchText),
            )
          : res.documents;
        const sortedFiles = setFilesBySortOptions(sortBy, filteredFiles);
        if (sortedFiles.length === 0) {
          setFiles(filteredFiles);
        } else {
          setFiles(sortedFiles);
        }
      }
      setIsFileLoading(false);
    };
    fetchDocuments();
  }, [counter]);

  const activeUser = decodeToken();
  if (!activeUser) {
    location.reload();
    return;
  }

  const uploadFile = async (file: File | null) => {
    try {
      if (file) {
        if (!fileToUploadVersion) setIsFileUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);
        formData.append("username", activeUser!.username);
        if (fileToUploadVersion) {
          formData.append("isUploadingNewVersion", "true");
          formData.append("fileId", fileToUploadVersion.fileId);
        }
        const response = await fetch(
          "http://localhost:4566/restapis/gfpzkgjitd/local/_user_request_/uploadFile",
          {
            method: "POST",
            body: formData,
            headers: { Authorization: setAuthHeader() },
          },
        );
        const result = await response.json();
        if (result.status === "OK") {
          toast.success(`${file?.name} uploaded successfully!`, {
            position: toast.POSITION.TOP_CENTER,
          });
          if (!fileToUploadVersion) {
            const updatedFiles = [...files, result.file];
            const sortedFiles = setFilesBySortOptions(sortBy, updatedFiles);
            if (sortedFiles.length > 1) {
              setFiles(sortedFiles);
            } else {
              setCounter((prevState) => ++prevState);
            }
          }
        } else {
          toast.error(result.err, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
        setIsFileUploading(false);
        if (fileToUploadVersion) {
          setShowModal(false);
          setFileToUploadVersion(null);
        }
      } else {
        toast.error("Please select any file!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      toast.error("Failed to upload!", {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsFileUploading(false);
      if (fileToUploadVersion) {
        setShowModal(false);
        setFileToUploadVersion(null);
      }
    }
  };

  const changeFileName = async (body: ChangeFileNameTypes) => {
    try {
      const response = await fetch(
        "http://localhost:4566/restapis/gfpzkgjitd/local/_user_request_/changeFileName",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: setAuthHeader(),
          },
          body: JSON.stringify({
            oldFileName: body.oldFileName,
            newFileName: body.newFileName,
            fileId: body.fileId,
          }),
        },
      );
      const result = await response.json();
      if (result.status === "OK") {
        toast.success(
          `${body.oldFileName} renamed successfully to ${body.newFileName}!`,
          {
            position: toast.POSITION.TOP_CENTER,
          },
        );
        if (fileToUpdateFileName) {
          const updatedFiles = [
            ...files.map((file) => {
              if (file.fileId === body.fileId) {
                return {
                  ...file,
                  name: body.newFileName,
                };
              }
              return file;
            }),
          ];
          const sortedFiles = setFilesBySortOptions(sortBy, updatedFiles);
          if (sortedFiles.length > 1) {
            setFiles(sortedFiles);
          } else {
            setCounter((prevState) => ++prevState);
          }
        }
      } else {
        toast.error(result.err, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      if (fileToUpdateFileName) {
        setShowModal(false);
        setFileToUpdateFileName(null);
      }
    } catch (e) {
      toast.error("Failed to rename!", {
        position: toast.POSITION.TOP_CENTER,
      });
      if (fileToUpdateFileName) {
        setShowModal(false);
        setFileToUpdateFileName(null);
      }
    }
  };

  const handleDelete = async (file: FileProps) => {
    try {
      setFileToDelete(file);
      const response = await fetch(
        "http://localhost:4566/restapis/gfpzkgjitd/local/_user_request_/deleteDocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: setAuthHeader(),
          },
          body: JSON.stringify({
            filename: file.name,
            fileId: file.fileId,
          }),
        },
      );
      const res = await response.json();
      if (res.status === "OK") {
        toast.success(`${file.name} deleted successfully!`, {
          position: toast.POSITION.TOP_CENTER,
        });
        setFileToDelete(null);
        setFiles(() => [
          ...files.filter((fl: FileProps) => fl.fileId !== file.fileId),
        ]);
      } else {
        toast.error(res.err, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      toast.error("Failed to delete!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const downloadAs = async (fileId: string, name: string) => {
    const res = await fetch(
      `http://localhost:4566/documents/${fileId}_${name}`,
    );
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setFileToLoad(file);
  };

  const handleUploadNewVersion = (file: FileProps) => {
    setFileToUploadVersion(file);
    setShowModal(true);
  };

  const handleChangeFileName = (file: FileProps) => {
    setFileToUpdateFileName(file);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFileToUploadVersion(null);
    setFileToUpdateFileName(null);
  };

  const handleOnSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value as keyof typeof sortByOptions;
    setSortBy(sortBy);
    const copiedFiles = [...files];
    const sortedFiles = setFilesBySortOptions(sortBy, copiedFiles);
    if (sortedFiles.length > 1) {
      setFiles(sortedFiles);
    } else {
      setCounter((prevState) => ++prevState);
    }
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setIsSearching(false);
      setCounter((prevState) => ++prevState);
    } else {
      setIsSearching(true);
      setCounter((prevState) => ++prevState);
    }
  };

  return (
    <>
      <Header activeUser={activeUser!} onLogout={onLogout} />
      <Files
        isFileLoading={isFileLoading}
        files={files}
        fileToDelete={fileToDelete}
        fileToUploadVersion={fileToUploadVersion}
        fileToUpdateFileName={fileToUpdateFileName}
        activeUser={activeUser!}
        downloadAs={downloadAs}
        handleUploadNewVersion={handleUploadNewVersion}
        handleChangeFileName={handleChangeFileName}
        handleDelete={handleDelete}
        showModal={showModal}
        handleClose={handleClose}
        uploadFile={uploadFile}
        changeFileName={changeFileName}
        isFileUploading={isFileUploading}
        setShowModal={setShowModal}
        handleOnSelectChange={handleOnSelectChange}
        onSearchChange={onSearchChange}
        handleSearch={handleSearch}
        searchText={searchText}
      />
      {activeUser!.role === "admin" && (
        <div className={styles.upload}>
          <label className={styles["input-file"]}>
            <input type="file" name="file" onChange={handleFileChange} />
            {fileToLoad ? (
              <span>{fileToLoad.name}</span>
            ) : (
              <span>Choose File!</span>
            )}
          </label>
          <button
            className={styles.button}
            onClick={() => uploadFile(fileToLoad)}
          >
            Upload File!
          </button>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default MainPage;
