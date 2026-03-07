import React, { useState } from 'react'
import { dummyUserData, ownerMenuLinks } from '../../assets/dummyCarData'
import { NavLink, useLocation } from 'react-router-dom'
import { Pencil, SquareCheck } from 'lucide-react'

const SlideBarOwner = () => {
  const user = dummyUserData
  const location = useLocation()
  const [image, setImage] = useState(null)

  const updateImage = () => {
    user.image = URL.createObjectURL(image)
    setImage(null)
  }

  return (
    <div className='bg-[#181C2E] text relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 fixed top-0 w-full text-sm'>

      <div className='group relative'>
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : user?.image || "https://www.w3schools.com/howto/img_avatar.png"}
            alt="user"
            className='h-9 md:h-14 md:w-14 rounded-full mx-auto cursor-pointer'
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={e => setImage(e.target.files[0])}
          />

          <div className='absolute hidden top-0 right-0 left-0 bottom-0 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <Pencil />
          </div>
        </label>
      </div>

      {image && (
        <button onClick={updateImage}> Save <SquareCheck /> </button>
      )}

      <p className='mt-2 text text-base max-md:hidden'>{user?.name}</p>

      <div className='w-full'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-3 w-full py-3 pl-4 first:mt-6 
            ${link.path === location.pathname ? 'bg-[#DFEAFF] text-blue-700 font-semibold' : 'text-gray-400'}`}
          >
            <span className="w-5 h-5">{link.icon}</span>
            <span className='max-md:hidden'>{link.name}</span>

            {link.path === location.pathname && (
              <div className="bg-blue-400 w-1.5 h-8 rounded-l right-0 absolute" />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default SlideBarOwner
