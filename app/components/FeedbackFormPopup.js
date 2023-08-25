import React from 'react'
import Button from './Button'
import Popup from './Popup'

const FeedbackFormPopup = ({setShowPopup}) => {
  return (
    <Popup setShowPopup={setShowPopup} title={"Make a suggestion"}>
        <form className='p-8'>
            <label className='block mt-4 mb-1 text-slate-700'>Title</label>
            <input className='w-full border p-2 rounded-md' type='text' placeholder='A short, descriptive title'/>
            <label className='block mt-4 mb-1 text-slate-700'>Description</label>
            <textarea className='w-full border' placeholder='Please include details according to title'></textarea>
            <div className='flex gap-2 mt-2 justify-end '>
                <Button>Attach  files</Button>
                <Button primary>Create Post</Button>
            </div>
        </form>
    </Popup>
    
  )
}

export default FeedbackFormPopup
