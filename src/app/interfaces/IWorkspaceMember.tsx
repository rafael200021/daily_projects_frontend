import { IUser } from "./IUser";

export interface IWorkspaceMember {
    id: number;
    workspaceId: number;
    userId: number;
    role: string;
    createdAt: string;
    user: IUser;
}