import React from 'react'

function ResponsiveWidth({children}) {
  return (
    <div className='max-w-11/12 lg:px-4 lg:max-w-360 mx-auto'>
        {children}
    </div>
  )
}

export default ResponsiveWidth