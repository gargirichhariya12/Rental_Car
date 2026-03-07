import React from 'react'
import NavbarOwner from '../../components/Owner/NavbarOwner'
import SlideBarOwner from '../../components/Owner/SlideBarOwner'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col glow-bg'>
      <NavbarOwner/>
      <div className='flex'>
        <SlideBarOwner/>
        <Outlet/>

      </div>
      
    </div>
  )
}

export default Layout
