"use client";
import { IWorkspace } from "@/app/interfaces/Workspace";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import Card from "@/app/components/Card";
import { Button } from "primereact/button";
import AddWorkspace from "./components/AddWorkspace";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../atom/userState";

export default function Page() {
  const axios = useAxios();
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [modalAddWorkspace, setModalAddWorkspace] = useState(false);
  const user = useRecoilValue(userState);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    axios.get("Workspace").then((res) => {
      let workspace: IWorkspace[] = res.data;

      workspace = workspace.filter((w, index) => {
        let membersId = w.workspaceMembers.map((m) => m.userId);

        if (membersId.includes(user?.id ?? 0) == true) {
          return true;
        }
        return false;
      });

      workspace.forEach((w) => {
        w.boards = w.boards.filter((b) => {
          let membersId = b.boardMembers.map((m) => m.userId);

          if (membersId.includes(user?.id ?? 0) == true) {
            return true;
          }
          return false;
        });
      });

      if (workspace.length > 0) {
        setWorkspaces(workspace);
      }
    });
  };

  return (
    <div className="p-20">
      {modalAddWorkspace && (
        <AddWorkspace
          modal={modalAddWorkspace}
          setModal={setModalAddWorkspace}
          init={init}
        />
      )}
      <div className="justify-between flex lg:flex-row flex-col gap-4 items-center mb-10">
        <h1 className="font-bold text-2xl">Workspaces</h1>
        <Button
          label="Add Workspace"
          onClick={() => setModalAddWorkspace(true)}
        />
      </div>
      <div className="flex flex-col gap-4">
        {workspaces.map((w) => {
          return (
            <div key={w.id}>
              <Link
                href={`/sistema/workspaces/${w.id}`}
                className="text-lg font-bold mb-10 hover:underline"
              >
                {w.name}
              </Link>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {w.boards.length == 0 ? (
                  <div>
                    <p className="text-sm ">No Boards Assigned to You</p>
                  </div>
                ) : (
                  w.boards.map((q) => {
                    return <Card key={q.id} board={q} />;
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
