import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import useAxios from "../../../../hooks/useAxios";
import { IBoardType } from "@/app/interfaces/IBoardType";
import { IWorkspace } from "@/app/interfaces/Workspace";

interface Data {
  x: string;
  y: number;
}

export default function BoardStatus({
  workspace,
}: {
  workspace: IWorkspace[];
}) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [dataPie, setDataPie] = useState<Data[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const axios = useAxios();

  useEffect(() => {
    init();
  }, [workspace]);

  async function init() {
    let total: Data[] = [];

    await axios.get("BoardType").then((res) => {
      let boardTypes: IBoardType[] = res.data;

      let nomes = boardTypes.map((b) => {
        total.push({ x: b.name[0].toUpperCase() + b.name.slice(1), y: 0 });
        return b.name[0].toUpperCase() + b.name.slice(1);
      });

      setLabels(nomes);
    });

    workspace.forEach((w) => {
      w.boards.forEach((b) => {
        b.lists.forEach((l) => {
          let cardLength = l.cards.length;
          let indexTotal = total.findIndex(
            (t) => t.x.toLowerCase() == l.boardType.name
          );
          if (indexTotal > -1) {
            total[indexTotal].y += cardLength;
          }
        });
      });
    });


    setDataPie(total);
  }

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataPie.map((d) => {
            return d.y;
          }),
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
          ],
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [labels, workspace, dataPie]);

  return (
      <div className="border flex flex-col gap-4  p-10 rounded-lg">
        <h1 className="font-bold">Boards - Status</h1>
        <div className="card flex justify-content-center">
          <Chart
            type="pie"
            data={chartData}
            options={chartOptions}
            className="w-full md:w-30rem"
          />
        </div>
    </div>
  );
}
