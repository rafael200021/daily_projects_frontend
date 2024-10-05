"use client";
import React, { useState } from "react";
import MenuItem from "./MenuItem";
import {
  Dash,
  BarChart,
  Person,
  PersonDash,
  PersonWorkspace,
  Gear,
  DoorClosed,
} from "react-bootstrap-icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../../atom/userState";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userState);

  return (
    <div
      className={`${
        isOpen == false ? "w-16 p-4 items-center" : "w-[250px] p-4 items-start"
      } flex   flex-col justify-between duration-300    bg-neutral-900 text-white`}
    >
      <div className="w-full">
        <button
          className="flex  w-full items-center gap-2 font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            className=""
            src="/assets/images/Logo.png"
            width={40}
            alt="logo"
          />
          {isOpen == true ? user?.name : ""}
        </button>
        <ul className="flex gap-4 flex-col   w-full mt-10">
          <MenuItem
            Icon={BarChart}
            isOpen={isOpen}
            rota="/"
            texto="Dashboard"
          />
          <MenuItem
            Icon={PersonWorkspace}
            isOpen={isOpen}
            rota="/workspaces"
            texto="Workspace"
          />
          <MenuItem
            Icon={Person}
            isOpen={isOpen}
            rota="/profile"
            texto="Profile"
          />
          <MenuItem
            Icon={DoorClosed}
            isOpen={isOpen}
            rota="/logout"
            texto="Logout"
          />
        </ul>
      </div>
    </div>
  );
}
