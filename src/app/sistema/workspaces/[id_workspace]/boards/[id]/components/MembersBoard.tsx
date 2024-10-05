import { IBoard } from "@/app/interfaces/IBoard";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddMemberBoard from "./AddMemberBoard";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { IBoardMember } from "@/app/interfaces/IBoardMember";
import { Dropdown } from "primereact/dropdown";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../../../atom/userState";

export default function MembersBoard({
  modal,
  setModal,
  board,
  init,
  isAdmin,
  setBoard,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  board: IBoard | null;
  init: () => void;
  isAdmin: boolean;
  setBoard: React.Dispatch<React.SetStateAction<IBoard | null>>;
}) {
  const [modalAddMember, setModalAddMember] = useState(false);
  const axios = useAxios();
  const options = [
    { code: "Admin", name: "Admin" },
    { code: "User", name: "User" },
  ];
  const user = useRecoilValue(userState);
  function actionTemplate(member: IBoardMember) {
    return isAdmin == false ? (
      ""
    ) : (
      <div className="flex gap-2 items-center">
        <Button
          text
          disabled={
            member.role == "Admin"
              ? board?.createdBy == user?.id
                ? member.userId == user?.id
                  ? true
                  : false
                : true
              : false
          }
          icon="pi pi-trash"
          severity="danger"
          rounded
          onClick={() => confirmMessage(member.id)}
        />
        <Button
          text
          disabled={
            member.role == "Admin"
              ? board?.createdBy == user?.id
                ? member.userId == user?.id
                  ? true
                  : false
                : true
              : false
          }
          icon="pi pi-save"
          severity="info"
          rounded
          onClick={() => saveMember(member)}
        />
      </div>
    );
  }

  function saveMember(member: IBoardMember) {
    axios.put(`BoardMember/${member.id}`, { role: member.role }).then((res) => {
      toast.success("Member updated with success");
      init();
    });
  }

  function confirmMessage(memberId: number) {
    confirmDialog({
      message: "Are you sure you want to delete this member?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        axios.delete(`BoardMember/${memberId}`).then((res) => {
          toast.success("Member deleted with success");
          init();
        });
      },
    });
  }

  function roleTemplate(member: IBoardMember) {
    return (
      <div className="flex items-center">
        {isAdmin == true ? (
          <Dropdown
            options={options}
            className="w-full"
            disabled={
              member.role == "Admin"
                ? board?.createdBy == user?.id
                  ? member.userId == user?.id
                    ? true
                    : false
                  : true
                : false
            }
            value={{ code: member.role, name: member.role }}
            onChange={(e) => {
              if (board) {
                const updateBoard = { ...board };

                const updatedMembers = [...updateBoard.boardMembers];

                const index = updatedMembers.findIndex(
                  (m) => m.id == member.id
                );

                if (index != -1) {
                  updatedMembers[index] = {
                    ...updatedMembers[index],
                    role: e.value.code,
                  };

                  updateBoard.boardMembers = updatedMembers;

                  setBoard(updateBoard);
                }
              }
            }}
            optionLabel="name"
            placeholder="Role"
            name="role"
            id="role"
          />
        ) : (
          <div>{member.role}</div>
        )}
      </div>
    );
  }
  return (
    <>
      <Dialog
        className="w-[80vw] text-neutral-900"
        visible={modal}
        onHide={() => setModal(false)}
        draggable={false}
        resizable={false}
        blockScroll={true}
        header="Members Board"
      >
        <AddMemberBoard
          boardMembers={board?.boardMembers}
          init={init}
          modal={modalAddMember}
          setModal={setModalAddMember}
        />
        <ConfirmDialog />
        <div className="flex justify-between items-center mt-10">
          <h2 className="text-lg  font-bold">Members</h2>
          {isAdmin && (
            <Button
              label="Add Member"
              onClick={() => setModalAddMember(true)}
              size="small"
            />
          )}
        </div>
        <div className="mt-2 rounded py-4 ">
          <DataTable value={board?.boardMembers}>
            <Column field="user.name" header="Name" />
            <Column field="user.email" header="Email" />
            <Column field="role" header="Role" body={roleTemplate} />
            <Column field="action" body={actionTemplate} />
          </DataTable>
        </div>
      </Dialog>
    </>
  );
}
