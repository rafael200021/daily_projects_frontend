import { FormikProps } from "formik";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { Dispatch, SetStateAction } from "react";

interface CreateCardProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  modal: boolean;
  formik: FormikProps<any>;
}

export default function CreateCard({
  setModal,
  modal,
  formik,
}: CreateCardProps) {
  return (
    <Dialog
      className="w-[80vw] lg:w-[50vw] text-neutral-900"
      onHide={() => {
        setModal(false);
      }}
      visible={modal}
      resizable={false}
      blockScroll={true}
      draggable={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <h1 className="font-bold text-neutral-900  text-2xl">Creating Card</h1>
        <div className="flex flex-col gap-2 mt-10">
          <label className="font-bold text-sm text-neutral-900">Title</label>
          <InputText
            placeholder="Title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </div>
        <div className="flex  flex-col gap-2 mt-4">
          <label className="font-bold text-neutral-900 text-sm">Description</label>
          <InputTextarea
            placeholder="Description"
            rows={6}
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-neutral-900 hover:bg-neutral-950 duration-300 text-white rounded mt-4 p-3 font-bold"
          >
            Add Card
          </button>
        </div>
      </form>
    </Dialog>
  );
}
