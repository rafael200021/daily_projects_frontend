"use client";
import { ICard } from "@/app/interfaces/ICard";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";

import React, { useEffect, useState } from "react";
import { IBoardMember } from "@/app/interfaces/IBoardMember";
import toast from "react-hot-toast";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import { addLocale } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import useAxios from "../../../../../../../../hooks/useAxios";
import { formats } from "../../../../../../../../helpers/helpers";
import {
  File,
  FileEarmark,
  FileEarmarkArrowUp,
  Upload,
} from "react-bootstrap-icons";
import CardComment from "./CardComment";
import { IUser } from "@/app/interfaces/IUser";
import ModalCard from "./ModalCard";

export default function CardBoard({
  item,
  members,
  init,
}: {
  item: ICard;
  members: IBoardMember[] | undefined;
  init(): Promise<void>;
}) {
  const [detailModal, setDetailModal] = useState(false);
  const axios = useAxios();

  const formik = useFormik<{
    title: string;
    comment: string;
    description: string;
    hasFinalDate: boolean;
    finalDate: null | Date;
    members: IUser[];
    wasCompleted: boolean;
    dateCompleted: null | Date;
  }>({
    initialValues: {
      comment: "",
      title: "",
      description: "",
      hasFinalDate: false,
      finalDate: null,
      members: [],
      dateCompleted: null,
      wasCompleted: false,
    },
    onSubmit: (data) => {
      let dados = {
        title: data.title,
        description: data.description,
        hasFinalDate: data.hasFinalDate == true ? 1 : 0,
        finalDate: data.finalDate,
        wasCompleted: data.wasCompleted == true ? 1 : 0,
        dateCompleted: data.dateCompleted,
      };

      axios.put(`Card/${item.id}`, dados).then(async (res) => {
        item.cardAssignees.forEach(async (c) => {
          await axios.delete(`CardAssignees/${c.id}`);
        });

        data.members.forEach(async (c) => {
          let dadosMembers = {
            cardId: item.id,
            userId: c.id,
          };

          await axios.post(`CardAssignees`, dadosMembers);
        });

        await init();
        toast.success("Card Atualizado");
        setDetailModal(false);
      });
    },
  });

  function converterData(date: Date) {
    return format(date, "MM/dd/yyyy HH:mm");
  }

  useEffect(() => {
    if (item) {
      formik.setFieldValue("title", item.title);
      formik.setFieldValue("description", item.description);
      formik.setFieldValue(
        "hasFinalDate",
        item.hasFinalDate == 1 ? true : false
      );
      formik.setFieldValue(
        "wasCompleted",
        item.wasCompleted == 1 ? true : false
      );
      if (item.finalDate) {
        formik.setFieldValue("finalDate", new Date(item.finalDate));
      }
      if (item.dateCompleted) {
        formik.setFieldValue("dateCompleted", new Date(item.dateCompleted));
      }
      if (item.cardAssignees.length > 0) {
        formik.setFieldValue(
          "members",
          item.cardAssignees.map((c) => c.user)
        );
      }
    }
  }, []);

  function closeDetailModal() {
    setDetailModal(false);
  }

  return (
    <>
      <ModalCard
        members={members}
        closeDetailModal={closeDetailModal}
        formik={formik}
        detailModal={detailModal}
        init={init}
        item={item}
      />
      <div
        onClick={() => setDetailModal(true)}
        className="bg-white relative rounded p-4 shadow-lg m-1"
      >
        <h1 className="font-bold text-base">{item.title}</h1>
        <div
          className="text-gray-400 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: item.description.slice(0, 150) }}
        />

        {item.hasFinalDate == 1 && item.wasCompleted == 0 ? (
          <div
            className={`${
              new Date(item.finalDate) >= new Date()
                ? "text-green-500"
                : "text-red-500"
            } mt-10 font-bold text-sm absolute right-2 bottom-1 bg-gray-100 p-1 rounded`}
          >
            <i className="pi pi-calendar"></i>{" "}
            {converterData(new Date(item.finalDate))}
          </div>
        ) : (
          ""
        )}
        <AvatarGroup>
          {item?.cardAssignees.slice(0, 2).map((m) => {
            return (
              <Avatar
                key={m.id}
                image=""
                size="normal"
                label={m.user.name[0].toUpperCase()}
                shape="circle"
              />
            );
          })}
          {item?.cardAssignees == null ? (
            ""
          ) : item?.cardAssignees?.length > 2 ? (
            <Avatar
              label={"+" + (item?.cardAssignees.length - 2)}
              shape="circle"
              size="normal"
            />
          ) : (
            ""
          )}
        </AvatarGroup>
      </div>
    </>
  );
}
