"use client";
import React from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

type ChartProps = {
  type: "line" | "bar" | "pie";
  data: any[];
};

export function Chart({ type, data }: ChartProps) {
  if (type === "line") {
    return (
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    );
  }

  if (type === "bar") {
    return (
      <BarChart barSize={20} width={300} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    );
  }

  if (type === "pie") {
    return (
      <PieChart width={400} height={250}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#ffc658" />
        <Tooltip />
      </PieChart>
    );
  }

  return <p>Unsupported chart type</p>;
}
