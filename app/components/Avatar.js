import React from 'react'

const Avatar = ({url=null}) => {
  return (
    <div>
        <div className='rounded-full bg-blue-300 w-12 h-12 overflow-hidden'>
          {!!url && (
            <img src={url} alt='avatar' />
          )}
        </div>
    </div>
  )
}

export default Avatar
