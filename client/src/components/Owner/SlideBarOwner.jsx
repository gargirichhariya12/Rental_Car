import React from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../../Context/AppContext'
import { Camera, CarFront, LayoutDashboard, List, Plus } from 'lucide-react'


const SlideBarOwner = () => {
  const { user, setUser } = useAppContext();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageChange = async (event) => {
    const image = event.target.files?.[0];
    if (!image || isUploading) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setIsUploading(true);
      const { data } = await axios.patch('/api/owner/update-image', formData);

      if (data.status === 'success') {
        setUser(data.data.user);
        toast.success('Profile photo updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile photo');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const ownerMenuLinks = [
    { name: "Dashboard", path: "/owner", icon: <LayoutDashboard/> },
    { name: "Add car", path: "/owner/add-car", icon: <Plus/> },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: <CarFront/>},
    { name: "Manage Bookings", path: "/owner/manage-bookings", icon: <List/> },
  ]

  return (
    <aside className='fixed left-0 top-[72px] z-20 flex h-[calc(100vh-72px)] w-20 flex-col items-center overflow-y-auto border-r border-white/10 bg-[#181C2E] pt-8 text-sm md:w-60'>

      <label className='group relative cursor-pointer' title='Update profile photo'>
        <img
          src={user?.image || "https://www.w3schools.com/howto/img_avatar.png"}
          alt="user"
          className='h-9 w-9 rounded-full mx-auto md:h-14 md:w-14 object-cover'
        />
        <span className='absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100'>
          <Camera className='h-4 w-4' />
        </span>
        {isUploading && (
          <span className='absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white'>
            ...
          </span>
        )}
        <input
          type='file'
          accept='image/*'
          className='hidden'
          disabled={isUploading}
          onChange={handleImageChange}
        />
      </label>

      <p className='mt-2 text text-base max-md:hidden'>{user?.name || 'Owner'}</p>
      <p className='max-md:hidden text-xs uppercase tracking-[0.2em] text-gray-500'>Manage fleet</p>

      <div className='mt-4 w-full px-2 md:px-3'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === '/owner'}
            className={({ isActive }) => `relative flex items-center gap-3 w-full py-3 pl-4 pr-4 first:mt-6 
            rounded-2xl ${isActive ? 'bg-[#DFEAFF] text-blue-700 font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            {({ isActive }) => (
              <>
                <span className="w-5 h-5">{link.icon}</span>
                <span className='max-md:hidden'>{link.name}</span>

                {isActive && (
                  <div className="absolute right-0 h-8 w-1.5 rounded-l bg-blue-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default SlideBarOwner
