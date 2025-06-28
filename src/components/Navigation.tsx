
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Target, AlertTriangle, Cpu, Network, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Use Cases', path: '/use-cases', icon: Target },
    { name: 'Risk Indicators', path: '/risk-indicators', icon: AlertTriangle },
    { name: 'Features', path: '/features', icon: Cpu },
    { name: 'Relationships', path: '/relationships', icon: Network },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-4 text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md mr-3">
                <Compass className="h-6 w-6 text-white" />
              </div>
              Compliance Compass
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'inline-flex items-center px-4 py-2 mx-1 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 hover:shadow-sm'
                    )}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
