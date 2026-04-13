import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAppContext } from '../../Context/AppContext'

const NavbarOwner = () => {
  const { user } = useAppContext();

  return (
    <div className='fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-800 bg-black/95 px-6 text-gray-300 backdrop-blur-md md:px-10'>
      <Link to='/'>
        <img src={logo} alt="logo" className='h-10' />
      </Link>
      <div className='flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2'>
        <img
          src={user?.image || "https://www.w3schools.com/howto/img_avatar.png"}
          alt={user?.name || "Owner"}
          className='h-9 w-9 rounded-full object-cover'
        />
        <div className='hidden text-right md:block'>
          <p className='text-xs uppercase tracking-[0.2em] text-gray-500'>Owner Panel</p>
          <p className='text-sm font-medium text-white'>Welcome, {user?.name || "Owner"}</p>
        </div>
      </div>
    </div>
  )
}

export default NavbarOwner
