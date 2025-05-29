

// File: components/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  FileText,
  Calendar,
  User,
  Bell,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  adminOnly?: boolean;
}

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [employeeCode, setEmployeeCode] = useState<string>('');

  useEffect(() => {
    const code = localStorage.getItem('employeeCode') || '';
    setEmployeeCode(code);
  }, []);

  const isAdmin = ['ITL-KOL-1001', 'ITL-KOL-1007', 'ITL-KOL-1017', 'ITL-KOL-1012'].includes(employeeCode);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Clock className="w-5 h-5" />,
      href: '/attendance'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      children: [
        {
          id: 'monthly-report',
          label: 'Monthly Reports',
          icon: <Calendar className="w-4 h-4" />,
          href: '/reports/monthly'
        },
        {
          id: 'team-report',
          label: 'Team Reports',
          icon: <Users className="w-4 h-4" />,
          href: '/reports/team'
        }
      ]
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: <Shield className="w-5 h-5" />,
      href: '/admin',
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      children: [
        {
          id: 'profile',
          label: 'Profile',
          icon: <User className="w-4 h-4" />,
          href: '/settings/profile'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="w-4 h-4" />,
          href: '/settings/notifications'
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('employeeCode');
    router.push('/login');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (item.adminOnly && !isAdmin) return null;

    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              handleNavigation(item.href);
            }
          }}
          className={`
            flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
            ${level > 0 ? 'ml-4 py-2' : ''}
            ${isActive 
              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-r-2 border-purple-500 text-white' 
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }
            ${!isOpen && !isMobile ? 'justify-center' : ''}
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`${isActive ? 'text-purple-400' : ''}`}>
              {item.icon}
            </div>
            {(isOpen || isMobile) && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </div>
          
          {hasChildren && (isOpen || isMobile) && (
            <ChevronRight 
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          )}
        </div>

        {/* Submenu */}
        {hasChildren && isExpanded && (isOpen || isMobile) && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`
        fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700 z-50 transition-all duration-300 shadow-xl
        ${isOpen || isMobile ? 'w-64' : 'w-16'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {(isOpen || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EMS</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Employee Portal</h2>
                <p className="text-slate-400 text-xs">{employeeCode}</p>
              </div>
            </div>
          )}
          
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`
              flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200
              ${!isOpen && !isMobile ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {(isOpen || isMobile) && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}