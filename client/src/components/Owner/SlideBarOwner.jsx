import React from 'react'
import { ownerMenuLinks } from '../../assets/dummyCarData'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../Context/AppContext'

const SlideBarOwner = () => {
  const { user } = useAppContext();

  return (
    <aside className='fixed top-[72px] left-0 z-20 flex h-[calc(100vh-72px)] w-20 flex-col items-center overflow-y-auto bg-[#181C2E] pt-8 text-sm md:w-60'>

      <div className='group relative'>
        <img
          src={user?.image || "https://www.w3schools.com/howto/img_avatar.png"}
          alt="user"
          className='h-9 w-9 rounded-full mx-auto md:h-14 md:w-14 object-cover'
        />
      </div>

      <p className='mt-2 text text-base max-md:hidden'>{user?.name}</p>

      <div className='w-full'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === '/owner'}
            className={({ isActive }) => `relative flex items-center gap-3 w-full py-3 pl-4 pr-4 first:mt-6 
            ${isActive ? 'bg-[#DFEAFF] text-blue-700 font-semibold' : 'text-gray-400'}`}
          >
            {({ isActive }) => (
              <>
                <span className="w-5 h-5">{link.icon}</span>
                <span className='max-md:hidden'>{link.name}</span>

                {isActive && (
                  <div className="bg-blue-400 w-1.5 h-8 rounded-l right-0 absolute" />
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
