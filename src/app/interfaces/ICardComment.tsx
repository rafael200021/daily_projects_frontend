import { IUser } from "./IUser";

export interface ICardComment {
  id: number;
  cardId: number;
  comment: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}
