import React, { useState } from 'react'
import Button from './Button'
import Popup from './Popup'
import axios from 'axios'
import PaperClip from './icons/PaperClip'
import Trash from './icons/Trash'
import { MoonLoader } from 'react-spinners'

const FeedbackFormPopup = ({setShowPopup}) => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [uploadImages, setUploadImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    
    const handleCreatePostButtonClick = (e) => {
        e.preventDefault();

        axios.post('/api/feedback', {title: title, description: description})
            .then(() => {
                setShowPopup(false)
            })
    }

    const handleAttachFilesInputChange = async (e) => {
        const files = [...e.target.files]

        setIsUploading(true)

        const data = new FormData();

        for(const file of files) {
            data.append('file', file)
        }

        const res = await axios.post('/api/upload', data)
        setUploadImages((existingUpload) => {
            return [ ...existingUpload, ...res.data ]
        })

        setIsUploading(false)
    }


    const handleRemoveFilesButtonClick = async(e, link) => {
        e.preventDefault();

        setUploadImages(currentUploads => {
            return currentUploads.filter(val => val !== link)
        })
    }


  return (
    <Popup setShowPopup={setShowPopup} title={"Make a suggestion"}>
        <form className='p-8'>
            <label className='block mt-4 mb-1 text-slate-700'>Title</label>
            <input className='w-full border p-2 rounded-md' type='text' placeholder='A short, descriptive title' value={title} onChange={e => setTitle(e.target.value)}/>
            <label className='block mt-4 mb-1 text-slate-700'>Description</label>
            <textarea className='w-full border' placeholder='Please include details according to title' value={description} onChange={e => setDescription(e.target.value)}></textarea>
            {uploadImages?.length > 0 && (
                <div>
                    <label className='block mt-2 mb-1 text-slate-700'>Images</label>
                    <div className='flex gap-3'>
                        {uploadImages.map(link => (
                            <a href={link} target='_blank' className='h-16 relative' key={link}>
                                <button onClick={e => handleRemoveFilesButtonClick(e, link)} className='-right-2 -top-2 absolute bg-red-400 p-1  rounded-md text-white'>
                                    <Trash />
                                </button>
                                {(link.endsWith('.jpg') || link.endsWith('.png') ) ? 
                                    (<img className='h-16 w-auto rounded-md' src={link} alt=''/>) : 
                                    (<div className='bg-gray-200 h-16 p-2 flex items-center rounded-md'>
                                        <PaperClip className='w-4 h-4'/>
                                        {link.split('/')[3].substring(13)}
                                    </div>)}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            <div className='flex gap-2 mt-2 justify-end '>
                <label className={'flex gap-2 py-2 px-4 cursor-pointer'}>
                    {isUploading && (<MoonLoader size={18}/>)}
                    <span className={(isUploading ? 'text-gray-300' : 'text-gray-600')}>
                        {isUploading ? "Uploading..." : "Attach files"}
                    </span>
                    <input multiple onChange={handleAttachFilesInputChange} type='file' className='hidden'/>
                </label>
                <Button primary onClick={handleCreatePostButtonClick}>Create Post</Button>
            </div>
        </form>
    </Popup>
    
  )
}

export default FeedbackFormPopup
