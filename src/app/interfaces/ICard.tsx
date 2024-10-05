import { ICardAssignees } from "./ICardAssignees";
import { ICardAttachment } from "./ICardAttachment";
import { ICardComment } from "./ICardComment";
import { IList } from "./IList";

export interface ICard {
  id: number;
  title: string;
  description: string;
  listId: number;
  position: number;
  finalDate: string;
  dateCompleted: string;
  hasFinalDate: number;
  createdAt: string;
  updatedAt: string;
  cardAssignees: ICardAssignees[];
  cardAttachments?: ICardAttachment[];
  cardComments: ICardComment[];
  list: IList;
  wasCompleted: number;
}
