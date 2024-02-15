export type FileProps = {
  fileId: string;
  name: string;
  createdBy: string;
};

export type ChangeFileNameTypes = {
  oldFileName: string;
  newFileName: string;
  fileId: string;
};

export type ActiveUserType = {
  role: "admin" | "simple";
  username: string;
};
