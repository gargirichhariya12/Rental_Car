import React from 'react'

function Loader() {
  return (
    <div className='flex min-h-[40vh] items-center justify-center'>
      <div className='h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500' />
    </div>
  )
}

export default Loader
