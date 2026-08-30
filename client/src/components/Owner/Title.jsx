import React from 'react'

const Title = ({ title, subTitle, className = '', subTitleClassName = '' }) => {
  return (
    <div className={className}>
      <h1 className='text-3xl text font-medium'>{title}</h1>
      <p className={`text-sm text-gray-400 md:text-base ${subTitleClassName}`.trim()}>{subTitle}</p>
    </div>
  )
}

export default Title
