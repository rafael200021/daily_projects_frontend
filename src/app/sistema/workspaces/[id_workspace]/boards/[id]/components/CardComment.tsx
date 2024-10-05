import { ICardComment } from "@/app/interfaces/ICardComment";
import { Avatar } from "primereact/avatar";
import React from "react";

export default function CardComment({ comment }: { comment: ICardComment }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Avatar
          size="normal"
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
          label={comment.user.name[0].toUpperCase()}
          shape="circle"
        />
        <p className="font-bold text-sm">{comment.user.name}</p>
      </div>
      <p className="text-gray-500 text-[14px]">{comment.comment}</p>
      <hr className="mt-4 mb-4" />
    </div>
  );
}
