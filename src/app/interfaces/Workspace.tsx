import { IBoard } from "./IBoard";
import { IWorkspaceMember } from "./IWorkspaceMember";

export interface IWorkspace {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    boards: IBoard[];
    workspaceMembers: IWorkspaceMember[];
}