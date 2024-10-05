import React from "react";
import { IBoard } from "../interfaces/IBoard";
import Link from "next/link";
import { ArrowDownLeftSquareFill } from "react-bootstrap-icons";

export default function Card({ board }: { board: IBoard }) {
  return (
    <div className="shadow-lg bg-white rounded-lg w-full h-80">
      <div className="h-40 relative">
        <img
          className="h-40 w-full object-cover"
          src="/assets/images/card.png"
        />
        <Link
          href={`/sistema/workspaces/${board.workspaceId}/boards/${board.id}`}
          className="h-14 flex justify-center items-center w-14 absolute text-white font-bold -bottom-5 right-[45%] bg-neutral-900 duration-200 hover:bg-neutral-950 rounded-full"
        >
          <ArrowDownLeftSquareFill
            className="text-white font-bold group-hover:text-neutral-900"
            size={18}
          />
        </Link>
      </div>
      <div className="p-4">
        <h1 className="text-base font-bold">{board.name}</h1>
        <p className="text-sm text-neutral-500">
          {board.description.slice(0, 100)}
        </p>
      </div>
    </div>
  );
}
