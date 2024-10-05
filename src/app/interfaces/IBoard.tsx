import { IBoardMember } from "./IBoardMember";
import { IList } from "./IList";
import { IUser } from "./IUser";

export interface IBoard {
    id: number;
    name: string;
    description: string;
    workspaceId: number;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    boardMembers: IBoardMember[];
    createdByNavigation: IUser;
    lists: IList[]
}