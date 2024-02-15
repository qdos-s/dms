import { sortByOptions } from "../commons";
import { FileProps } from "../types";

export const setFilesBySortOptions = (
  sortBy: keyof typeof sortByOptions,
  files: FileProps[],
) => {
  switch (sortBy) {
    case sortByOptions.ASC:
      return files.sort((a: FileProps, b: FileProps) =>
        a.name.localeCompare(b.name),
      );
    case sortByOptions.DESC:
      return files.sort((a: FileProps, b: FileProps) =>
        b.name.localeCompare(a.name),
      );
    case sortByOptions.IDLE:
    default:
      return [];
  }
};
