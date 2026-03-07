import React from 'react'
import { dummyUserData } from '../../assets/dummyCarData'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

const NavbarOwner = () => {
  const user = dummyUserData

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-borderColor relative transition-all text bg-black' >
      <Link to = '/'>
      <img src = {logo} alt = "logo" className='h-10'/>
      </Link>
      <p>welcome, {user.name || "Owner"}</p>
      
    </div>
  )
}

export default NavbarOwner
