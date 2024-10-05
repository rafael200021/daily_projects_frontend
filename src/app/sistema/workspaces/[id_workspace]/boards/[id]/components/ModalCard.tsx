import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import CardComment from "./CardComment";
import { ICard } from "@/app/interfaces/ICard";
import useAxios from "../../../../../../../../hooks/useAxios";
import { FormikProps } from "formik";
import { Button } from "primereact/button";
import { IBoardMember } from "@/app/interfaces/IBoardMember";
import { IUser } from "@/app/interfaces/IUser";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { formats } from "../../../../../../../../helpers/helpers";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import {
  Download,
  FileEarmark,
  FileEarmarkArrowUp,
  Folder,
  Upload,
} from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../../../../atom/userState";

interface ModalCardProps {
  item: ICard;
  formik: FormikProps<any>;
  init(): Promise<void>;
  closeDetailModal(): void;
  detailModal: boolean;
  members: IBoardMember[] | undefined;
}

export default function ModalCard({
  item,
  formik,
  init,
  closeDetailModal,
  detailModal,
  members,
}: ModalCardProps) {
  const axios = useAxios();
  const [file, setFile] = useState<File | null>();
  const user = useRecoilValue(userState);

  async function deleteCard() {
    await axios.delete(`Card/${item.id}`).then((r) => {
      init();
    });
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function sendComment() {
    if (formik.values.comment) {
      let data = {
        comment: formik.values.comment,
        userId: user?.id,
        cardId: item.id,
      };

      await axios.post("CardComment", data).then((res) => {
        formik.setFieldValue("comment", "");
        init();
      });
    } else {
      toast.error("Please write a comment first!");
    }
  }

  function uploadFile() {
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    axios.post("CardAttachment/Upload", formData).then((res) => {
      let filename = res.data.fileName;

      let data = {
        cardId: item.id,
        filePath: filename,
        fileName: filename,
      };

      axios.post("CardAttachment", data).then((res) => {
        toast("File uploaded with sucess");
        setFile(undefined);
        init();
      });
    });
  }

  function downloadFile(fileName: string) {
    window.open(`http://localhost:5041/api/CardAttachment/Upload/${fileName}`);
  }

  function addRemoveMember(user: IUser) {
    let membersA = [...formik.values.members];

    let exist = membersA.findIndex((m) => m.id == user.id);

    if (exist == -1) {
      membersA.push(user);
    } else {
      membersA.splice(exist, 1);
    }

    formik.setFieldValue("members", membersA);
  }

  function existMember(boardMember: IBoardMember) {
    let res = formik.values.members.find(
      (m: any) => m.id == boardMember.user.id
    );

    if (res) {
      return true;
    }

    return false;
  }

  return (
    <Dialog
      onHide={closeDetailModal}
      blockScroll={true}
      className="w-[80vw] lg:w-[50vw]"
      resizable={false}
      draggable={false}
      visible={detailModal}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="p-4 lg:p-10 text-neutral-900 flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Card #{item.id}</h1>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={deleteCard}
              size="small"
              severity="danger"
              icon="pi pi-trash"
            />

            <Button type="submit" size="small" icon="pi pi-save" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold">Members</label>
          <div className="flex gap-2">
            {members?.map((m) => {
              return (
                <div
                  key={m.id}
                  className={`${
                    existMember(m) == true ? "bg-neutral-900" : ""
                  } flex justify-center items-center h-16 w-16 rounded-full duration-300`}
                >
                  <button
                    type="button"
                    onClick={() => addRemoveMember(m.user)}
                    className="bg-neutral-600 hover:bg-neutral-700 transition-all text-white flex justify-center items-center font-extrabold h-14 w-14 rounded-full"
                  >
                    {m.user.name[0].toUpperCase()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold">Title</label>
          <InputText
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 mb-10 lg:mb-0">
          <label className="font-bold">Description</label>
          <ReactQuill
            value={formik.values.description}
            className="h-60"
            onChange={(e) => formik.setFieldValue("description", e)}
            formats={formats}
          />
        </div>
        <div className="flex gap-2 items-center mt-14">
          <Checkbox
            checked={formik.values.hasFinalDate}
            onChange={() =>
              formik.setFieldValue("hasFinalDate", !formik.values.hasFinalDate)
            }
          />
          <label>Is there a Final Date ?</label>
        </div>
        {formik.values.hasFinalDate == true ? (
          <>
            <div className="flex flex-col gap-2 ">
              <label className="font-bold">Final Date</label>
              <div className="flex lg:flex-row flex-col gap-2">
                <Calendar
                  id="finalDate"
                  className="w-full lg:w-10/12"
                  minDate={new Date()}
                  value={formik.values.finalDate}
                  onChange={(e) => formik.setFieldValue("finalDate", e.value)}
                  dateFormat="mm/dd/yy"
                  showIcon
                  placeholder="mm/dd/aaaa"
                />
                <Calendar
                  id="finalDate"
                  className="w-full lg:w-2/12"
                  value={formik.values.finalDate}
                  showIcon
                  onChange={(e) => formik.setFieldValue("finalDate", e.value)}
                  timeOnly
                />
              </div>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <Checkbox
                checked={formik.values.wasCompleted}
                onChange={() =>
                  formik.setFieldValue(
                    "wasCompleted",
                    !formik.values.wasCompleted
                  )
                }
              />
              <label>Has it been completed?</label>
            </div>
            {formik.values.wasCompleted == true ? (
              <div className="flex flex-col gap-2 ">
                <label className="font-bold">Date Completed</label>
                <div className="flex gap-2">
                  <Calendar
                    id="finalDate"
                    className="w-full"
                    value={formik.values.dateCompleted}
                    onChange={(e) =>
                      formik.setFieldValue("dateCompleted", e.value)
                    }
                    dateFormat="mm/dd/yy"
                    showIcon
                    placeholder="mm/dd/aaaa"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
        <div>
          <h1 className="font-bold text-2xl mt-4">Attachments</h1>
          <label
            htmlFor="file"
            className="p-10 mt-2 border bg-gray-200 flex-col flex justify-center items-center rounded border-dashed border-gray-300"
          >
            <FileEarmarkArrowUp size={40} color="#6b7280" />
            <p className="font-bold text-gray-500 text-lg">
              Choose ur File Here
            </p>
            <input
              onChange={handleUpload}
              type="file"
              className="hidden"
              name=""
              id="file"
            />
          </label>
          {file ? (
            <div className="mt-4 rounded border justify-between items-center flex">
              <div className="bg-neutral-900 flex items-center justify-center w-2/12 h-32 text-white p-4">
                <Folder size={40} />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="font-bold">{file.name}</p>
                  <p className="text-sm">
                    {(file.size / 1000000).toFixed(2)} Mb
                  </p>
                </div>
              </div>
              <div
                onClick={uploadFile}
                className="bg-neutral-900 hover:bg-neutral-950 duration-300 flex cursor-pointer items-center justify-center w-2/12 h-32 text-white p-4"
              >
                <Upload size={40} />
              </div>
            </div>
          ) : (
            ""
          )}

          <h1 className="font-bold text-2xl mt-4">Uploaded Files</h1>
          {item.cardAttachments?.map((c) => {
            return (
              <div
                key={c.id}
                className="mt-4 rounded border justify-between items-center flex"
              >
                <div className="bg-neutral-950 flex items-center justify-center w-2/12 h-32 text-white p-4">
                  <Folder size={40} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <p className="font-bold">{c.fileName}</p>
                  </div>
                </div>
                <div
                  onClick={() => downloadFile(c.fileName)}
                  className="bg-neutral-900 hover:bg-neutral-950 duration-300 flex cursor-pointer items-center justify-center w-2/12 h-32 text-white p-4"
                >
                  <Download size={40} />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h1 className="font-bold text-2xl mb-4">Comments</h1>
          <InputTextarea
            className="w-full mt-4"
            rows={4}
            value={formik.values.comment}
            name="comment"
            id="comment"
            onChange={formik.handleChange}
          />
          <div className="w-full mt-4 flex justify-end">
            <Button
              onClick={sendComment}
              type="button"
              label="Send"
              size="small"
            />
          </div>
          <div>
            {item.cardComments
              .sort((a, b) => b.id - a.id)
              .map((c) => {
                return <CardComment key={c.cardId} comment={c} />;
              })}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
