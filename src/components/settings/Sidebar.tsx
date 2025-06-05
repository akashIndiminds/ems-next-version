import React from 'react';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setCurrentSection }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'privacy', label: 'Privacy', icon: 'fas fa-user-shield' }
  ];

  return (
    <div className="lg:w-1/4">
      <div className="floating-card bg-white rounded-2xl p-6 sticky top-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Settings Menu</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`nav-item w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all ${
                currentSection === item.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <style jsx>{`
        .floating-card {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        .floating-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08);
        }
        
        .nav-item {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .nav-item:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;