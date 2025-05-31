'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AttendanceChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
              {
                label: 'Present',
                data: [5, 5, 4, 4, 0],
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
              },
              {
                label: 'Absent',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
              },
              {
                label: 'Half-day',
                data: [0, 0, 1, 0, 0],
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1
              },
              {
                label: 'Leave',
                data: [0, 0, 0, 1, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                border: {
                  dash: [2, 2]
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="text-xs text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-600">Absent</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-gray-600">Half-day</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-xs text-gray-600">Leave</span>
          </div>
        </div>
      </div>
      <div className="h-[240px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default AttendanceChart;