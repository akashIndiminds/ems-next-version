import React from 'react';
import { Calendar, Clock, Timer, Percent } from 'lucide-react';

interface StatsProps {
  stats: {
    present: number;
    absent: number;
    leave: number;
    halfDay: number;
    overtime: number;
    workHours: number;
    punchInRate: number;
    onTimeRate: number;
  };
}

const StatCard = ({ title, value, icon, color }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`bg-white p-5 rounded-xl shadow-sm border border-${color}-100 hover:shadow-md transition-all`}>
    <div className="flex justify-between items-center">
      <div>
        <p className={`text-${color}-600 text-sm font-medium mb-1`}>{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatsSummary: React.FC<StatsProps> = ({ stats }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {currentMonth} Summary
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Present Days"
          value={stats.present}
          icon={<Calendar className={`h-6 w-6 text-green-600`} />}
          color="green"
        />
        
        <StatCard 
          title="Total Hours"
          value={`${stats.workHours}h`}
          icon={<Clock className={`h-6 w-6 text-blue-600`} />}
          color="blue"
        />
        
        <StatCard 
          title="Overtime"
          value={`${stats.overtime}h`}
          icon={<Timer className={`h-6 w-6 text-purple-600`} />}
          color="purple"
        />
        
        <StatCard 
          title="On-Time Rate"
          value={`${stats.onTimeRate}%`}
          icon={<Percent className={`h-6 w-6 text-indigo-600`} />}
          color="indigo"
        />
      </div>
    </div>
  );
};

export default StatsSummary;
