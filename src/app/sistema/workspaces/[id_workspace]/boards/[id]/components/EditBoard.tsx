import { IBoard } from "@/app/interfaces/IBoard";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect } from "react";
import useAxios from "../../../../../../../../hooks/useAxios";
import toast from "react-hot-toast";

export default function EditBoard({
  modal,
  setModal,
  board,
  init,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  board: IBoard | null;
  init: () => void;
}) {
  const axios = useAxios();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      let data = {
        name: values.name,
      };

      axios.put(`Board/${board?.id}`, data).then(() => {
        toast.success("Board updated with success !");
        init();
        setModal(false);
      });
    },
  });

  useEffect(() => {
    if (board) {
      formik.setFieldValue("name", board.name);
    }
  }, [board]);

  return (
    <>
      <Dialog
        className="w-[80vw] lg:w-[50vw] text-neutral-900"
        visible={modal}
        onHide={() => setModal(false)}
        draggable={false}
        resizable={false}
        blockScroll={true}
        header="Change Board Name"
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-neutral-900">
              Board Name
            </label>
            <InputText
              value={formik.values.name}
              onChange={formik.handleChange}
              id="name"
              name="name"
              placeholder="Board Name"
            />
          </div>
          <div className="w-full flex justify-end items-center">
            <Button type="submit" label="Save" />
          </div>
        </form>
      </Dialog>
    </>
  );
}
