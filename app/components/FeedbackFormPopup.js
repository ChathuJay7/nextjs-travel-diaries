import React, { useState } from 'react'
import Button from './Button'
import Popup from './Popup'
import axios from 'axios'
import PaperClip from './icons/PaperClip'
import Trash from './icons/Trash'
import { MoonLoader } from 'react-spinners'
import Attachment from './Attachment'
import AttachFilesButton from './AttachFilesButton'
import { signIn, useSession } from 'next-auth/react'


const FeedbackFormPopup = ({setShowPopup, onCreate}) => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [uploadImages, setUploadImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const { data: session } = useSession();
    
    const handleCreatePostButtonClick = async (e) => {
        e.preventDefault();

        if(session) {
            axios.post('/api/feedback', {title: title, description: description, uploadImages})
            .then(() => {
                setShowPopup(false)
                onCreate()
            })
        } else {
            localStorage.setItem('post after login', JSON.stringify({
                title, description, uploadImages
            }));
            await signIn('google');
        }
    }


    const handleRemoveFilesButtonClick = async(e, link) => {
        e.preventDefault();

        setUploadImages(currentUploads => {
            return currentUploads.filter(val => val !== link)
        })
    }

    const addNewUploadImages = (newLinks) => {
        setUploadImages(prevLinks => [...prevLinks, ...newLinks])
    }

  return (
    <Popup setShowPopup={setShowPopup} title={"Create Post"}>
        <form className='p-8'>
            <label className='block mt-4 mb-1 text-slate-700'>Title</label>
            <input className='w-full border p-2 rounded-md' type='text' placeholder='A short, descriptive title' value={title} onChange={e => setTitle(e.target.value)}/>
            <label className='block mt-4 mb-1 text-slate-700'>Description</label>
            <textarea className='w-full border p-2 rounded-md' placeholder='Please include details according to title' value={description} onChange={e => setDescription(e.target.value)}></textarea>
            {uploadImages?.length > 0 && (
                <div>
                    <label className='block mt-2 mb-1 text-slate-700'>Images</label>
                    <div className='flex gap-3'>
                        {uploadImages.map(link => (
                            <Attachment key={link} link={link} showRemoveButton={true} handleRemoveFilesButtonClick={(e, link) => handleRemoveFilesButtonClick(e, link)}/>
                        ))}
                    </div>
                </div>
            )}
            <div className='flex gap-2 mt-2 justify-end '>
                <AttachFilesButton onNewFiles={addNewUploadImages} />
                <Button primary onClick={handleCreatePostButtonClick} disabled={title === '' || description === ''}>
                    { session ? "Create post" : "Login and Post" }
                </Button>
            </div>
        </form>
    </Popup>
    
  )
}

export default FeedbackFormPopup
