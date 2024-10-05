import { IUser } from "./IUser";

export interface ICardAssignees {
    id: number;
    cardId: number;
    userId: number;
    assignedAt: string;
    card: null;
    user: IUser; 
}