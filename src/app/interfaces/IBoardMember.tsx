import { IUser } from "./IUser";

export interface IBoardMember {
    id: number;
    boardId: number;
    userId: number;
    role: string;
    addedAt: string;
    user: IUser;
}