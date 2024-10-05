import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import React, { Dispatch, SetStateAction, useState } from "react";
import EditBoard from "./EditBoard";
import { IBoard } from "@/app/interfaces/IBoard";
import Members from "../../../components/Members";
import MembersBoard from "./MembersBoard";
import useAxios from "../../../../../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

interface SidebardProps {
  setSidebarRight: Dispatch<SetStateAction<boolean>>;
  sidebarRight: boolean;
  board: IBoard | null;
  init: () => void;
  isAdmin: boolean;
  setBoard: React.Dispatch<React.SetStateAction<IBoard | null>>;
}
export default function SidebardBoard({
  setSidebarRight,
  sidebarRight,
  board,
  init,
  isAdmin,
  setBoard,
}: SidebardProps) {
  const [editModal, setEditModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const axios = useAxios();
  const navigate = useRouter();
  function deleteBoard(boardId: number | undefined) {
    if (boardId) {
      axios.delete(`Board/${boardId}`).then((res) => {
        toast.success("Board deleted with success !");
        setSidebarRight(false);
        navigate.push(`/sistema/workspaces/${board?.workspaceId}`);
      });
    }
  }

  function confirm(boardId: number | undefined) {
    confirmDialog({
      header: "Confirm",
      message: "Are you sure you want to delete this board?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        deleteBoard(boardId);
      },
      reject: () => {},
    });
  }

  return (
    <>
      <ConfirmDialog />
      <EditBoard
        init={init}
        board={board}
        modal={editModal}
        setModal={setEditModal}
      />
      <MembersBoard
        isAdmin={isAdmin}
        setBoard={setBoard}
        init={init}
        board={board}
        modal={memberModal}
        setModal={setMemberModal}
      />
      <Sidebar
        visible={sidebarRight}
        position="right"
        onHide={() => setSidebarRight(false)}
        className="p-4 bg-gray-50 shadow-lg"
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="font-bold text-3xl mb-8 text-gray-800">
              Board Settings
            </h1>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setEditModal(true)}
                className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 transition"
              >
                <i className="pi pi-pencil text-blue-500 text-xl"></i>
                <span className="text-lg font-medium text-gray-700">
                  Change Board Name
                </span>
              </button>

              <button
                onClick={() => setMemberModal(true)}
                className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 transition"
              >
                <i className="pi pi-user text-green-500 text-xl"></i>
                <span className="text-lg font-medium text-gray-700">
                  Setting Up Members
                </span>
              </button>

              {/* <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 transition">
                <i className="pi pi-download text-yellow-500 text-xl"></i>
                <span className="text-lg font-medium text-gray-700">
                  Export Board
                </span>
              </div> */}
            </div>
          </div>

          <Button
            onClick={() => confirm(board?.id)}
            severity="danger"
            label="Delete Board"
            className="w-full mt-6 p-3 text-lg"
            icon="pi pi-trash"
          />
        </div>
      </Sidebar>
    </>
  );
}
