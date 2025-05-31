import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  ArrowRight
} from 'lucide-react';

const QuickActions = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (path: string) => {
    // router.push(path) - Next.js navigation
    console.log(`Navigating to ${path}`);
  };

  const actions = [
    {
      id: 'leave',
      title: 'Apply for Leave',
      description: 'Submit leave application quickly',
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      color: 'blue',
      path: '/leave',
      buttonText: 'Apply Now'
    },
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Quick check-in or check-out',
      icon: Clock,
      gradient: 'from-emerald-500 to-emerald-600',
      color: 'emerald',
      path: '/attendance',
      buttonText: 'Check In/Out'
    },
    {
      id: 'payroll',
      title: 'View Payslips',
      description: 'Access all payroll documents',
      icon: CreditCard,
      gradient: 'from-purple-500 to-purple-600',
      color: 'purple',
      path: '/payroll',
      buttonText: 'View Payslips'
    }
  ];

  return (
    <div className="px-4 py-6 bg-gray-50  rounded-lg mb-6" style={{ minHeight: 'fit-content' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500 mt-1">Get things done faster</p>
        </div>
        <div className="text-xs text-gray-500 font-medium bg-white px-3 py-2 rounded-lg shadow-sm">
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
      
      {/* Mobile-First Grid */}
      <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {actions.map((action) => (
          <div 
            key={action.id}
            className={`relative bg-gradient-to-br ${action.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden`}
            onClick={() => handleNavigation(action.path)}
          >
            {/* Background decorations - optimized for mobile */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-white/10 w-20 h-20 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 bg-white/10 w-16 h-16 rounded-full blur-lg"></div>
            
            <div className="relative z-10">
              {/* Icon with better mobile sizing */}
              <div className="bg-white/20 p-3 rounded-xl inline-block backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <action.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              
              {/* Content optimized for mobile readability */}
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold leading-tight">{action.title}</h3>
                <p className="text-sm md:text-base opacity-90 leading-relaxed">{action.description}</p>
                
                {/* Button with better mobile touch target */}
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center w-full md:w-auto mt-4 group-hover:shadow-lg border border-white/20">
                  <span>{action.buttonText}</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Mobile-specific touch feedback */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-2xl"></div>
          </div>
        ))}
      </div>

      {/* Additional mobile-friendly spacing */}
      <div className="h-6 md:h-0"></div>
    </div>
  );
};

export default QuickActions;