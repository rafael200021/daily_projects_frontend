import { IWorkspace } from "@/app/interfaces/Workspace";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../../../hooks/useAxios";
import { ICard } from "@/app/interfaces/ICard";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "primereact/avatar";
import { useParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../atom/userState";

interface CardsWorkspaceProps {
  workspace: IWorkspace | undefined;
  isAdmin: boolean;
}

export default function CardsWorkspace({
  workspace,
  isAdmin,
}: CardsWorkspaceProps) {
  const axios = useAxios();
  const [cards, setCards] = useState<ICard[]>([]);
  const params = useParams();
  const user = useRecoilValue(userState);

  useEffect(() => {
    axios.get(`Card`).then((res) => {
      let cardsData: ICard[] = res.data;

      cardsData = cardsData
        .filter((c) => c.list.board.workspaceId == Number(params.id_workspace))
        .filter((c) => {
          if (isAdmin == true) {
            return true;
          } else {
            return c.cardAssignees.map((m) => m.userId).includes(user?.id ?? 0);
          }
        });

      setCards(res.data);
    });
  }, []);

  function possuiDataTemplate(card: ICard) {
    return <p>{card.hasFinalDate == 1 ? "Yes" : "No"}</p>;
  }

  function entregaRealizadaTemplate(card: ICard) {
    return <p>{card.wasCompleted == 1 ? "Yes" : "No"}</p>;
  }

  function descriptionTemplate(card: ICard) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: card.description.slice(0, 200) }}
      ></div>
    );
  }

  function membersTemplate(card: ICard) {
    return (
      <AvatarGroup>
        {card?.cardAssignees.map((m) => {
          return (
            <Avatar
              image=""
              key={m.id}
              size="normal"
              label={m.user.name[0].toUpperCase()}
              shape="circle"
            />
          );
        })}
      </AvatarGroup>
    );
  }

  function statusTemplate(card: ICard) {
    let color: "success" | "info" | "warning" | "danger" | null | undefined =
      "success";

    if (card.list.boardTypeId == 1) {
      color = "warning";
    }
    if (card.list.boardTypeId == 2) {
      color = "info";
    }
    if (card.list.boardTypeId == 3) {
      color = "info";
    }
    if (card.list.boardTypeId == 4) {
      color = "success";
    }

    return (
      <Tag
        className="w-full text-full capitalize"
        value={card.list.boardType.name}
        severity={color}
      />
    );
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Cards</h1>
      <div className="mt-2 rounded py-4 ">
        <DataTable rows={10} paginator={true} value={cards}>
          <Column field="title" header="Title" />
          <Column
            field="description"
            header="Description"
            body={descriptionTemplate}
          />
          <Column
            field="list.boardType.name"
            header="Status"
            body={statusTemplate}
          />
          <Column
            field="hasFinalDate"
            header="Is There Final Date"
            body={possuiDataTemplate}
          />
          <Column
            field="hasFinalDate"
            header="Assigned To"
            body={membersTemplate}
          />
          <Column field="finalDate" header="Final Date" />
          <Column
            field="wasCompleted"
            header="Has it been completed?"
            body={entregaRealizadaTemplate}
          />
          <Column field="list.board.name" header="Board" />
        </DataTable>
      </div>
    </div>
  );
}
