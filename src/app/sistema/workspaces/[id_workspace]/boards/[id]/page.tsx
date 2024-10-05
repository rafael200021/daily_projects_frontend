"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ICard } from "@/app/interfaces/ICard";
import { useParams } from "next/navigation";
import { IBoard } from "@/app/interfaces/IBoard";
import CardBoard from "./components/CardBoard";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { IList } from "@/app/interfaces/IList";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import useAxios from "../../../../../../../hooks/useAxios";
import CreateCard from "./components/CreateCard";
import SidebardBoard from "./components/SidebardBoard";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../../atom/userState";
import { userIsAdminBoard } from "../../../../../../../helpers/helpers";

interface IItemsState {
  todo: ICard[];
  doing: ICard[];
  test: ICard[];
  completed: ICard[];
}

const initialItemsState: IItemsState = {
  todo: [],
  doing: [],
  test: [],
  completed: [],
};

export default function Home() {
  const axios = useAxios();
  const params = useParams();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [modal, setModal] = useState(false);
  const [currentList, setCurrentList] = useState<number | null>(null);
  const [sidebarRight, setSidebarRight] = useState(false);
  const [items, setItems] = useState<IItemsState>(initialItemsState);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useRecoilValue(userState);

  const boardTypes = [
    { nome: "todo", id: 1 },
    { nome: "doing", id: 2 },
    { nome: "test", id: 3 },
    { nome: "completed", id: 4 },
  ];

  useEffect(() => {
    init();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (data) => {
      const BoardType = boardTypes.find((b) => b.id === currentList);

      if (BoardType) {
        let lenght = items[BoardType.nome as keyof IItemsState].length;

        let list = board?.lists.find(
          (l) => l.boardTypeId == (currentList ?? 1)
        );

        const postData = {
          title: data.title,
          description: data.description,
          listId: list?.id,
          position: lenght,
        };

        try {
          await axios.post("Card", postData);
          await init();
          setModal(false);
        } catch (error) {
          console.error("Error creating card:", error);
        }
      }
    },
  });

  useEffect(() => {
    if (user && board) {
      setIsAdmin(userIsAdminBoard(user, board.boardMembers));
    }
  }, [user, board]);

  async function init() {
    try {
      const response = await axios.get<IBoard>(`Board/${params.id}`);
      const boardData = response.data;
      setBoard(boardData);

      const itemsTemp: IItemsState = { ...initialItemsState };

      boardData.lists.forEach((list: IList) => {
        itemsTemp[list.boardType.name as keyof IItemsState] = list.cards.sort(
          (a, b) => a.position - b.position
        );
      });

      setItems(itemsTemp);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const addCard = (listId: number) => {
    formik.resetForm();
    setCurrentList(listId);
    setModal(true);
  };

  const updateCardPosition = async (
    sourceIndex: number,
    destinationIndex: number,
    sourceDroppableId: string,
    destinationDroppableId: string
  ) => {
    const sourceListId = boardTypes.find(
      (b) => b.nome === sourceDroppableId
    )?.id;
    const destinationListId = boardTypes.find(
      (b) => b.nome === destinationDroppableId
    )?.id;

    if (!sourceListId || !destinationListId) return;

    const updatedItems = { ...items };

    const [movedCard] = updatedItems[
      sourceDroppableId as keyof IItemsState
    ].splice(sourceIndex, 1);
    updatedItems[destinationDroppableId as keyof IItemsState].splice(
      destinationIndex,
      0,
      movedCard
    );

    const updatedCards = updatedItems[
      destinationDroppableId as keyof IItemsState
    ].map((card, index) => ({
      id: card.id,
      listId: destinationListId,
      position: index,
    }));

    if (sourceDroppableId !== destinationDroppableId) {
      const sourceUpdatedCards = updatedItems[
        sourceDroppableId as keyof IItemsState
      ].map((card, index) => ({
        id: card.id,
        listId: sourceListId,
        position: index,
      }));
      updatedCards.push(...sourceUpdatedCards);
    }

    setItems(updatedItems);

    try {
      await Promise.all(
        updatedCards.map(async (card) => {
          let list = board?.lists.find((l) => l.boardTypeId == card.listId);
          if (list) {
            await axios.put(`Card/${card.id}`, {
              listId: list?.id,
              position: card.position,
            });
          }
        })
      );
    } catch (error) {
      console.error("Error updating card positions:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    updateCardPosition(
      source.index,
      destination.index,
      source.droppableId,
      destination.droppableId
    );
  };

  return (
    <main className="min-w-[1280px] w-full p-10">
      <SidebardBoard
        setBoard={setBoard}
        isAdmin={isAdmin}
        init={init}
        board={board}
        setSidebarRight={setSidebarRight}
        sidebarRight={sidebarRight}
      />
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">{board?.name}</h1>
          <Button
            type="button"
            onClick={() => setSidebarRight(true)}
            icon="pi pi-cog"
            text
            rounded
          />
        </div>
      </div>
      {modal && (
        <CreateCard formik={formik} modal={modal} setModal={setModal} />
      )}

      <div className="grid grid-cols-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {boardTypes.map((boardType) => (
            <Droppable
              key={boardType.nome}
              droppableId={boardType.nome}
              direction="vertical"
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="bg-neutral-900 text-white rounded p-4 m-2">
                    <h1 className="font-bold text-lg">
                      {boardType.nome.charAt(0).toUpperCase() +
                        boardType.nome.slice(1)}
                    </h1>
                  </div>
                  {items[boardType.nome as keyof IItemsState].map(
                    (item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className=""
                          >
                            <CardBoard
                              init={init}
                              key={item.id}
                              item={item}
                              members={board?.boardMembers}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                  <button
                    onClick={() => addCard(boardType.id)}
                    className="bg-gray-200 w-full p-4 text-sm mt-4 shadow-lg hover:bg-gray-300 font-bold"
                  >
                    Add Card
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </main>
  );
}
