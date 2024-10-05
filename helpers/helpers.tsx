import { IBoardMember } from "@/app/interfaces/IBoardMember";
import { IUser } from "@/app/interfaces/IUser";
import { IWorkspaceMember } from "@/app/interfaces/IWorkspaceMember";

export const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export const userIsAdmin = (
  user: IUser | null,
  members: IWorkspaceMember[] | undefined
): boolean => {
  if (!user || !members) {
    return false;
  } else {
    let admin = members?.find((m) => m.userId == user?.id && m.role == "Admin");

    if (admin) {
      return true;
    } else {
      return false;
    }
  }
};

export const userIsAdminBoard = (
  user: IUser | null,
  members: IBoardMember[] | undefined
): boolean => {
  if (!user || !members) {
    return false;
  } else {
    let admin = members?.find((m) => m.userId == user?.id && m.role == "Admin");

    if (admin) {
      return true;
    } else {
      return false;
    }
  }
};
