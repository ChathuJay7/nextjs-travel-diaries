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

    const handleAttachFilesInputChange = async (e) => {
        const files = [...e.target.files]

        const data = new FormData();

        for(const file of files) {
            data.append('file', file)
        }

        const res = await axios.post('/api/upload', data)
        console.log(res)  
    }


  return (
    <Popup setShowPopup={setShowPopup} title={"Make a suggestion"}>
        <form className='p-8'>
            <label className='block mt-4 mb-1 text-slate-700'>Title</label>
            <input className='w-full border p-2 rounded-md' type='text' placeholder='A short, descriptive title' value={title} onChange={e => setTitle(e.target.value)}/>
            <label className='block mt-4 mb-1 text-slate-700'>Description</label>
            <textarea className='w-full border' placeholder='Please include details according to title' value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <div className='flex gap-2 mt-2 justify-end '>
                <label className='py-2 px-4 text-gray-600 cursor-pointer'>
                    <span>Attach files</span>
                    <input multiple onChange={handleAttachFilesInputChange} type='file' className='hidden'/>
                </label>
                <Button primary onClick={handleCreatePostButtonClick}>Create Post</Button>
            </div>
        </form>
    </Popup>
    
  )
}

export default FeedbackFormPopup
