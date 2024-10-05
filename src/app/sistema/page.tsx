"use client";
import React, { useEffect, useState } from "react";
import { IBoard } from "@/app/interfaces/IBoard";
import Card from "@/app/components/Card";
import { IWorkspace } from "../interfaces/Workspace";
import { Button } from "primereact/button";
import Link from "next/link";
import useAxios from "../../../hooks/useAxios";
import { Dropdown } from "primereact/dropdown";
import { IDropdownNumber } from "../interfaces/IHelpers";
import CardDashboard from "./components/CardDashboard";
import TarefasConcluidasMes from "./components/CardsCompletedMonth";
import CardsCompletedMonth from "./components/CardsCompletedMonth";
import BoardStatus from "./components/BoardStatus";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../atom/userState";

export default function Page() {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    code: number;
    name: string;
  }>({ code: 0, name: "All" });
  const [totalBoards, setTotalBoards] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<number>(0);
  const [generalProgress, setGeneralProgress] = useState<number>(0);
  const [wOptions, setWOptions] = useState<IDropdownNumber[]>([]);
  const axios = useAxios();
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user) {
      axios.get("Workspace").then((res) => {
        let workspace: IWorkspace[] = res.data;

        workspace = workspace.filter((w) => {
          let membersId = w.workspaceMembers.map((m) => m.userId);
          if (membersId.includes(user?.id ?? 0) == true) {
            return true;
          }
          return false;
        });

        if (selectedWorkspace.code != 0) {
          workspace = workspace.filter((w) => w.id == selectedWorkspace.code);
        }

        if (workspace.length > 0) {
          setWorkspaces(workspace);

          let tBoards = 0;
          let completedCards = 0;
          let allCards = 0;
          let generalProgress = 0;

          workspace.forEach((w) => {
            tBoards += w.boards.length;

            let boards = w.boards;

            boards = boards.filter((b) => {
              let membersId = b.boardMembers.map((m) => m.userId);

              if (membersId.includes(user?.id ?? 0) == true) {
                return true;
              }
              return false;
            });

            boards.forEach((b) => {
              b.lists
                .filter((l) => l.boardTypeId == 4)
                .forEach((l) => {
                  completedCards += l.cards.length;
                });

              b.lists.forEach((l) => {
                allCards += l.cards.length;
              });
            });
          });

          if (completedCards > 0 && allCards > 0) {
            generalProgress = (completedCards * 100) / allCards;
          }
          setTotalBoards(tBoards);
          setCompletedCards(completedCards);
          setGeneralProgress(generalProgress);
        }
      });
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    axios.get("Workspace").then((res) => {
      let workspace: IWorkspace[] = res.data;

      workspace = workspace.filter((w) => {
        let membersId = w.workspaceMembers.map((m) => m.userId);

        if (membersId.includes(user?.id ?? 0) == true) {
          return true;
        }
        return false;
      });

      let opt = [];

      opt.push({ code: 0, name: "All" });

      workspace.forEach((w) => {
        opt.push({
          code: w.id,
          name: w.name,
        });
      });

      setWOptions(opt);
    });
  }, [user]);

  return (
    <div className="flex flex-col p-20">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex  flex-col gap-2">
          <h1 className="font-bold text-lg lg:text-2xl">Dashboard</h1>
          <p className="text-[12px] lg:text-sm text-gray-500">
            Track Progress and Optimize Your Workflow
          </p>
        </div>
        <Dropdown
          options={wOptions}
          value={selectedWorkspace}
          className="w-24 lg:w-48"
          onChange={(e) => {
            setSelectedWorkspace(e.value);
          }}
          optionLabel="name"
          placeholder="Select the workspace"
        />
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardDashboard
            title="Total Boards"
            titleValue="Boards"
            value={totalBoards}
            color="from-blue-500 to-indigo-600"
          />
          <CardDashboard
            title="Completed Cards"
            titleValue="Cards"
            value={completedCards}
            color="from-red-500 to-rose-600"
          />
          <CardDashboard
            title="General Progress"
            titleValue="%"
            value={generalProgress}
            color="from-green-500 to-lime-600"
          />
        </div>
        <div className="grid gap-4 mt-8 grid-cols-1 lg:grid-cols-3">
          <CardsCompletedMonth workspace={workspaces} />

          <BoardStatus workspace={workspaces} />
        </div>
      </div>
    </div>
  );
}
