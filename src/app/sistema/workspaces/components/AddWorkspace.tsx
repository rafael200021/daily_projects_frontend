import { useFormik } from "formik";
import { Dialog } from "primereact/dialog";
import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useParams } from "next/navigation";
import useAxios from "../../../../../hooks/useAxios";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../atom/userState";

interface AddWorkspaceProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  init: () => void;
}

export default function AddWorkspace({ modal, setModal, init }: AddWorkspaceProps) {
  const axios = useAxios();
  const params = useParams();
  const user = useRecoilValue(userState);

  const formik = useFormik<{
    name: string;
    description: string;
  }>({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (data) => {

      let dataWorkspace = {
        name: data.name,
        description: data.description,
        createdBy: user?.id,
      };

      axios.post("Workspace", dataWorkspace).then(async (res) => {
        let dataWorkspaceMember = {
          WorkspaceId: res.data.id,
          userId: user?.id,
          role: "Admin",
        };

        await axios.post("WorkspaceMember", dataWorkspaceMember);

        await init();
        
        setModal(false);
      });
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
        <h1 className="font-bold text-2xl">Creating Workspace</h1>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="name" className="text-sm font-bold">
            Name
          </label>
          <InputText
            value={formik.values.name}
            onChange={formik.handleChange}
            id="name"
            placeholder="Name"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description" className="text-sm font-bold">
            Description
          </label>
          <InputTextarea
            value={formik.values.description}
            onChange={formik.handleChange}
            id="description"
            placeholder="Description"
            rows={6}
          />
        </div>
        <div className="w-full flex mt-4 justify-end items-center">
          <Button type="submit" label="Create" />
        </div>
      </form>
    </Dialog>
  );
}
