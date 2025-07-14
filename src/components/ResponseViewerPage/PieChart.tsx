"use client"
import React from 'react'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChart({answers}:{answers:
    ({
    userName: string;
    answer_ID: string;
    question_ID: string;
    value: string;
    isCorrect?: boolean;
    updatedAt: Date;
} | null)[]
 }) {
   const countMap = new Map<string, number>();

  answers.forEach((ans) => {
    if (ans) {
      const val = ans.value.trim();
      countMap.set(val, (countMap.get(val) || 0) + 1);
    }
  });

  const labels = Array.from(countMap.keys());
  const data = Array.from(countMap.values());

  const chartData = {
    labels,
    datasets: [
      {
        label: "Responses",
        data,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#9966FF", "#FF9F40", "#00C49F", "#C0C0C0", "#8B0000",  "#1E90FF", "#FFD700", "#008080",  "#DC143C", "#7FFF00", "#8A2BE2",  "#FF69B4","#00CED1",  "#B22222", "#228B22", "#FF4500",
        ],
      },
    ],
  };

  return(
    <div className='flex flex-row items-center justify-center xl:h-100'>
        <Pie data={chartData} options={{
        plugins: {
          legend: {
            labels: {
              color: "#A1A1AA",
            },
          },
        },
      }}/>
    </div>
  ); 
}
