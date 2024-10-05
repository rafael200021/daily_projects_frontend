import { IUser } from "@/app/interfaces/IUser";
import { atom } from "recoil";

export const userState = atom<IUser | null>({
  default: null,
  key: "userState",
});
