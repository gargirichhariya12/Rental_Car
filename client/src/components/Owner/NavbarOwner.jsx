import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAppContext } from '../../Context/AppContext'

const NavbarOwner = () => {
  const { user } = useAppContext();

  return (
    <div className='fixed top-0 left-0 right-0 z-30 flex h-[72px] items-center justify-between px-6 md:px-10 text-gray-400 border-b border-gray-800 transition-all bg-black/95 backdrop-blur-md' >
      <Link to = '/'>
      <img src = {logo} alt = "logo" className='h-10'/>
      </Link>
      <p>welcome, {user?.name || "Owner"}</p>
      
    </div>
  )
}

export default NavbarOwner
