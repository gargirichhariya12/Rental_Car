import React from 'react'

const Title = ({title, subTitle}) => {
  return (
    <div>
      <h1 className='text-3xl text font-medium'>{title}</h1>
      <p className='text-gray-400 text-sm md:text-base'>{subTitle}</p>
    </div>
  )
}

export default Title
