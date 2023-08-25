import React, { useState } from 'react'
import Button from './Button'
import Popup from './Popup'
import axios from 'axios'

const FeedbackFormPopup = ({setShowPopup}) => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    const handleCreatePostButtonClick = (e) => {
        e.preventDefault();

        axios.post('/api/feedback', {title: title, description: description})
            .then(() => {
                setShowPopup(false)
            })
    }

  return (
    <Popup setShowPopup={setShowPopup} title={"Make a suggestion"}>
        <form className='p-8'>
            <label className='block mt-4 mb-1 text-slate-700'>Title</label>
            <input className='w-full border p-2 rounded-md' type='text' placeholder='A short, descriptive title' value={title} onChange={e => setTitle(e.target.value)}/>
            <label className='block mt-4 mb-1 text-slate-700'>Description</label>
            <textarea className='w-full border' placeholder='Please include details according to title' value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <div className='flex gap-2 mt-2 justify-end '>
                <Button>Attach  files</Button>
                <Button primary onClick={handleCreatePostButtonClick}>Create Post</Button>
            </div>
        </form>
    </Popup>
    
  )
}

export default FeedbackFormPopup
