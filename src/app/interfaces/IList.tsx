import { IBoard } from "./IBoard";
import { IBoardType } from "./IBoardType";
import { ICard } from "./ICard";

export interface IList {
    id: number;
    boardTypeId: number;
    boardId: number;
    createdAt: string;
    updatedAt: string;
    boardType: IBoardType;
    cards: ICard[],
    board:IBoard
}