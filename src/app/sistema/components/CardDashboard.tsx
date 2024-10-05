import NumberTicker from "@/components/magicui/number-ticker";
import React from "react";

export default function CardDashboard({
  title,
  value,
  color,
  titleValue,
}: {
  title: string;
  value: number;
  titleValue: string;
  color: string;
}) {
  return (
    <div
      className={`px-10 py-6 bg-gradient-to-r  ${color} rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <h1 className="font-extrabold text-white text-2xl mb-2">{title}</h1>
      <p className="text-white text-opacity-80 text-sm">
        {value == 0 ? <label className="text-white text-opacity-80">{value}</label>:<NumberTicker className="text-white text-opacity-80" value={value} />} {titleValue}
      </p>
    </div>
  );
}
