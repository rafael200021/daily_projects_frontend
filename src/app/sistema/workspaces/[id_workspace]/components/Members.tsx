import { IWorkspace } from "@/app/interfaces/Workspace";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { use, useEffect, useState } from "react";
import AddMember from "./AddMember";
import { IWorkspaceMember } from "@/app/interfaces/IWorkspaceMember";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import useAxios from "../../../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../atom/userState";
import { userIsAdmin } from "../../../../../../helpers/helpers";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export default function Members({
  workspace,
  init,
  isAdmin,
  setWorkspace,
}: {
  workspace: IWorkspace | undefined;
  init: () => void;
  isAdmin: boolean;
  setWorkspace: React.Dispatch<React.SetStateAction<IWorkspace | undefined>>;
}) {
  const [modalAddMember, setModalAddMember] = useState(false);
  const axios = useAxios();
  const options = [
    { code: "Admin", name: "Admin" },
    { code: "User", name: "User" },
  ];
  const user = useRecoilValue(userState);
  function actionTemplate(member: IWorkspaceMember) {
    return isAdmin == false ? (
      ""
    ) : (
      <div className="flex gap-2 items-center">
        <Button
          text
          disabled={
            member.role == "Admin"
              ? workspace?.createdBy == user?.id
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
              ? workspace?.createdBy == user?.id
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

  function saveMember(member: IWorkspaceMember) {
    axios
      .put(`WorkspaceMember/${member.id}`, { role: member.role })
      .then((res) => {
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
        axios.delete(`WorkspaceMember/${memberId}`).then((res) => {
          toast.success("Member deleted with success");
          init();
        });
      },
    });
  }

  function roleTemplate(member: IWorkspaceMember) {
    return (
      <div className="flex items-center">
        {isAdmin == true ? (
          <Dropdown
            options={options}
            className="w-full"
            disabled={
              member.role == "Admin"
                ? workspace?.createdBy == user?.id
                  ? member.userId == user?.id
                    ? true
                    : false
                  : true
                : false
            }
            value={{ code: member.role, name: member.role }}
            onChange={(e) => {
              if (workspace) {
                const updatedWorkspace = { ...workspace };

                const updatedMembers = [...updatedWorkspace.workspaceMembers];

                const index = updatedMembers.findIndex(
                  (m) => m.id == member.id
                );

                if (index != -1) {
                  updatedMembers[index] = {
                    ...updatedMembers[index],
                    role: e.value.code,
                  };

                  updatedWorkspace.workspaceMembers = updatedMembers;

                  setWorkspace(updatedWorkspace);
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
      <AddMember
        workspaceMembers={workspace?.workspaceMembers}
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
        <DataTable value={workspace?.workspaceMembers}>
          <Column field="user.name" header="Name" />
          <Column field="user.email" header="Email" />
          <Column field="role" header="Role" body={roleTemplate} />
          <Column field="action" body={actionTemplate} />
        </DataTable>
      </div>
    </>
  );
}
