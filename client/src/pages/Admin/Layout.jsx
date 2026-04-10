import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Car, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../Context/AppContext';

const AdminLayout = () => {
  const { user, logout } = useAppContext();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Global Car Inventory', path: '/admin/cars', icon: <Car size={20} /> },
  ];

  return (
    <div className='flex min-h-screen bg-gray-950 text-white'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-900 border-r border-gray-800 flex flex-col'>
        <div className='p-6 flex items-center gap-3'>
          <div className='w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl'>A</div>
          <h2 className='text-xl font-bold tracking-tight'>AdminPanel</h2>
        </div>
        
        <nav className='flex-1 px-4 py-6 space-y-2'>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <div className='flex items-center gap-3'>
                {item.icon}
                <span className='font-medium'>{item.name}</span>
              </div>
              <ChevronRight size={14} className='opacity-50' />
            </NavLink>
          ))}
        </nav>

        <div className='p-6 border-t border-gray-800'>
          <button 
            onClick={logout}
            className='flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-3 py-2'
          >
            <LogOut size={20} />
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto bg-gray-950 px-8 py-10'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
