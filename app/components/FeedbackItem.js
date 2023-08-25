import React from 'react'

const FeedbackItem = () => {
  return (
    <div className='my-8 flex gap-8 items-center'>
          <div>
            <h2 className='font-bold'>Please post more videos</h2>
            <p className='text-gray-600 text-sm'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <div>
            <button className='shadow-sm shadow-gray-200 border rounded-md px-4 py-1 flex items-center gap-1 text-gray-600'>
              <span className='triangle-vote-up'></span>
              80
            </button>
          </div>
    </div>
  )
}

export default FeedbackItem
