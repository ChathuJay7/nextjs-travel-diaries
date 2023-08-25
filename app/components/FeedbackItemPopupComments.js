

import React, { useState } from 'react'
import Button from './Button'
import Avatar from './Avatar'

const FeedbackItemPopupComments = () => {

    const [ commentText, setCommentText ] = useState("")

  return (
    <div className='p-8'>
      <div className='flex gap-4 mb-8'>
        <Avatar />
        <div>
            <p className='text-gray-600'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <div className='text-gray-400 mt-2 text-sm'>Anonymous &middot; a few seconds ago</div>
        </div>
      </div>
      <form>
        <textarea className='border rounded-md w-full p-2' value={commentText} placeholder='Let usknow what you think...' onChange={e => setCommentText(e.target.value)}></textarea>
        <div className='flex justify-end gap-2 mt-2'>
            <Button>Attach files</Button>
            <Button primary disabled={commentText === ''}>Comments</Button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackItemPopupComments
