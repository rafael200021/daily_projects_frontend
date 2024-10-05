import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import { IBoardType } from "@/app/interfaces/IBoardType";
import { IWorkspace } from "@/app/interfaces/Workspace";

interface Data {
  x: string;
  y: number;
}

export default function CardsCompletedMonth({
  workspace,
}: {
  workspace: IWorkspace[];
}) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [dataBar, setDataBar] = useState<Data[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const meses = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const axios = useAxios();

  useEffect(() => {
    init();
  }, [workspace]);

  async function init() {
    let total: Data[] = [];

    meses.forEach((m, index) => {
      total.push({
        x: m,
        y: 0,
      });
    }); 

    let year = new Date().getFullYear();

    workspace.forEach((w) => {
      w.boards.forEach((b) => {
        b.lists.forEach((l) => {
          l.cards
            .filter((c) => c.wasCompleted == 1 && new Date(c.dateCompleted).getFullYear() == year)
            .forEach((c) => {
              let indexTotal = total.findIndex((t) => t.x == meses[new Date(c.dateCompleted).getMonth()]);
              if (indexTotal > -1) {
                total[indexTotal].y += 1;
              }
            });
        });
      });
    });

    setDataBar(total);
  }

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: meses,
      datasets: [
        {
          label: "",
          data: dataBar.map((d) => {
            return d.y;
          }),
          backgroundColor: [documentStyle.getPropertyValue("--blue-500")],
          hoverBackgroundColor: [documentStyle.getPropertyValue("--blue-400")],
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            usePointStyle: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [labels, workspace, dataBar]);

  return (
    <div className="border col-span-2 flex flex-col gap-4  p-10 rounded-lg">
      <h1 className="font-bold">Cards Completed - Month</h1>
      <div className="card flex justify-content-center">
        <Chart
          type="bar"
          data={chartData}
          options={chartOptions}
          className="w-full md:w-30rem"
        />
      </div>
    </div>
  );
}
