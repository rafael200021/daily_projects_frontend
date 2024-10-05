"use client";
import { IWorkspace } from "@/app/interfaces/Workspace";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../../hooks/useAxios";
import { useParams } from "next/navigation";
import Card from "@/app/components/Card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Steps } from "primereact/steps";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import TarefasWorkspace from "./components/CardsWorkspace";
import CardsWorkspace from "./components/CardsWorkspace";
import AddBoard from "./components/AddBoard";
import AddMember from "./components/AddMember";
import Members from "./components/Members";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../atom/userState";
import { userIsAdmin } from "../../../../../helpers/helpers";

export default function Page() {
  const [workspace, setWorkspace] = useState<IWorkspace | undefined>();
  const [modalAddBoard, setModalAddBoard] = useState(false);
  const axios = useAxios();
  const params = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useRecoilValue(userState);

  useEffect(() => {
    init();
  }, [user]);

  useEffect(() => {
    if (user && workspace?.workspaceMembers) {
      setIsAdmin(userIsAdmin(user, workspace?.workspaceMembers));
    }
  }, [user, workspace]);

  async function init() {
    await axios.get(`Workspace/${params.id_workspace}`).then((res) => {
      let workspace: IWorkspace = res.data;

      workspace.boards = workspace.boards.filter((b) => {
        let membersId = b.boardMembers.map((m) => m.userId);

        if (membersId.includes(user?.id ?? 0) == true) {
          return true;
        }
        return false;
      });

      setWorkspace(res.data);
    });
  }

  return (
    <div className="px-20 py-10">
      {modalAddBoard && <AddBoard init={init} modal={modalAddBoard} setModal={setModalAddBoard} />} 
      <div className="bg-gray-800 text-white p-10 rounded mb-10">
        <h1 className="font-bold text-2xl mb-2">{workspace?.name} </h1>
        <h2 className="text-[12px] text-gray-300 mb-4">
          {workspace?.description}
        </h2>
      </div>

      <TabView>
        <TabPanel header="General">
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-lg  font-bold">Boards</h2>
            {isAdmin && (
              <Button
                onClick={() => setModalAddBoard(true)}
                label="Add Board"
                size="small"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {workspace?.boards.length == 0 ? (
              <div className="w-full flex justify-start items-center">
                <h2 className="text-sm">No Boards Assigned to You</h2>
              </div>
            ) : (
              workspace?.boards.map((q) => {
                return <Card key={q.id} board={q} />;
              })
            )}
          </div>
          <Members isAdmin={isAdmin} setWorkspace={setWorkspace} workspace={workspace} init={init} />
        </TabPanel>
        <TabPanel header="Cards">
          <CardsWorkspace isAdmin={isAdmin} workspace={workspace} />
        </TabPanel>
      </TabView>
    </div>
  );
}
