import React, { useRef, useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Users, Car, LogOut, ChevronRight, Camera, LoaderCircle } from 'lucide-react';
import { useAppContext } from '../../Context/AppContext';
import { toast } from 'react-hot-toast';

const AdminLayout = () => {
  const { user, logout, setUser, setIsOwner } = useAppContext();
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleImagePick = () => {
    if (isUploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploadingImage(true);
      const { data } = await axios.patch('/api/admin/update-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.data?.user) {
        setUser(data.data.user);
        setIsOwner(data.data.user.role === 'owner' || data.data.user.role === 'admin');
      }

      toast.success('Profile image updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile image');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Global Car Inventory', path: '/admin/cars', icon: <Car size={20} /> },
  ];

  return (
    <div className='flex min-h-screen bg-gray-950 text-white'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-900 border-r border-gray-800 flex flex-col'>
        <div className='p-6'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl'>A</div>
            <h2 className='text-xl font-bold tracking-tight'>AdminPanel</h2>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-4'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageUpload}
            />
            <div className='relative mx-auto mb-4 h-24 w-24'>
              <img
                src={user.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                alt={user.name || 'Admin'}
                className='h-full w-full rounded-full object-cover ring-4 ring-white/5'
              />
              <button
                type='button'
                onClick={handleImagePick}
                disabled={isUploadingImage}
                className='absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {isUploadingImage ? <LoaderCircle size={16} className='animate-spin' /> : <Camera size={16} />}
              </button>
            </div>
            <div className='text-center'>
              <p className='text-sm font-semibold text-white'>{user.name || 'Admin'}</p>
              <p className='mt-1 text-xs text-gray-400'>{user.email}</p>
              <p className='mt-3 text-[11px] uppercase tracking-[0.24em] text-gray-500'>Administrator</p>
            </div>
          </div>
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
