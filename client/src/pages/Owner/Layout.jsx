import React from 'react'
import NavbarOwner from '../../components/Owner/NavbarOwner'
import SlideBarOwner from '../../components/Owner/SlideBarOwner'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='min-h-screen glow-bg'>
      <NavbarOwner/>
      <div className='flex pt-[72px]'>
        <SlideBarOwner/>
        <main className='min-w-0 flex-1 pl-20 md:pl-60'>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Layout
