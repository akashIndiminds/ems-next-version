import React from 'react';
import { 
  Calendar, 
  Clock, 
  CreditCard,
  FileText,
  Briefcase,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickActions: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-indigo-100 mb-8 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ActionCard
            icon={<Calendar className="w-8 h-8" />}
            title="Apply Leave"
            color="blue"
            onClick={() => handleNavigation('/leave')}
          />
          
          <ActionCard
            icon={<Clock className="w-8 h-8" />}
            title="Mark Attendance"
            color="green"
            onClick={() => handleNavigation('/attendance')}
          />
          
          <ActionCard
            icon={<CreditCard className="w-8 h-8" />}
            title="View Payslip"
            color="purple"
            onClick={() => handleNavigation('/payroll')}
          />
          
          <ActionCard
            icon={<FileText className="w-8 h-8" />}
            title="Reports"
            color="amber"
            onClick={() => handleNavigation('/reports')}
          />
          
          <ActionCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Projects"
            color="rose"
            onClick={() => handleNavigation('/projects')}
          />
          
          <ActionCard
            icon={<Users className="w-8 h-8" />}
            title="Team"
            color="indigo"
            onClick={() => handleNavigation('/team')}
          />
        </div>
      </div>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ReactElement<{ className?: string }>; // Updated typing
  title: string;
  color: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, color, onClick }) => {
  const colorMap: Record<string, { bg: string, text: string, hover: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:bg-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'hover:bg-rose-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:bg-indigo-100' },
  };

  const { bg, text, hover } = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`${bg} ${text} ${hover} p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:shadow-md`}
    >
      <div className="mb-2">
        {React.cloneElement(icon, { className: `w-6 h-6 ${text}` })}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
};

export default QuickActions;