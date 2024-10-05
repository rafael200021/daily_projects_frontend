import { useFormik } from "formik";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../../../hooks/useAxios";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useParams } from "next/navigation";
import { IBoardType } from "@/app/interfaces/IBoardType";
import { Dropdown } from "primereact/dropdown";
import { IDropdownNumber } from "@/app/interfaces/IHelpers";
import { IUser } from "@/app/interfaces/IUser";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../atom/userState";
import { IWorkspace } from "@/app/interfaces/Workspace";
import { IWorkspaceMember } from "@/app/interfaces/IWorkspaceMember";

interface AddBoardProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  init: () => void;
  workspaceMembers: IWorkspaceMember[] | undefined;
}

export default function AddMember({
  workspaceMembers,
  modal,
  setModal,
  init,
}: AddBoardProps) {
  const axios = useAxios();
  const params = useParams();
  const [users, setUsers] = useState<IDropdownNumber[]>([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    axios.get("User").then((res) => {
      setUsers(
        res.data.map((u: IUser) => {
          return {
            name: `${u.name} (${u.email})`,
            code: u.id,
          };
        })
      );
    });
  }, []);

  const formik = useFormik<{
    user: null | IDropdownNumber;
  }>({
    initialValues: {
      user: null,
    },
    onSubmit: async (data) => {

      let flagAlreadyMember = false;

      workspaceMembers?.forEach((w) => {
        if (w.userId === data.user?.code) {
          flagAlreadyMember = true;
        }
      });

      if (flagAlreadyMember) {
        toast.error("This user is already a member");
        return;
      } else {
        let dataWorkspaceMember = {
          workspaceId: params.id_workspace,
          userId: data.user?.code,
          role: "User",
        };

        await axios.post("WorkspaceMember", dataWorkspaceMember);

        toast.success("Member added with success");

        await init();

        setModal(false);
      }
    },
  });

  return (
    <Dialog
      className="w-[80vw] lg:w-[50vw]"
      resizable={false}
      draggable={false}
      visible={modal}
      onHide={() => setModal(false)}
    >
      <form onSubmit={formik.handleSubmit}>
        <h1 className="font-bold text-2xl">Add Member</h1>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="user" className="text-sm font-bold">
            Users
          </label>
          <Dropdown
            value={formik.values.user}
            onChange={formik.handleChange}
            options={users}
            optionLabel="name"
            id="user"
            placeholder="Select user"
          />
        </div>
        <div className="w-full flex mt-4 justify-end items-center">
          <Button type="submit" label="Add Member" />
        </div>
      </form>
    </Dialog>
  );
}
