import React, { useState } from 'react'
import Button from './Button'
import AttachFilesButton from './AttachFilesButton'
import Attachment from './Attachment'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

const CommentForm = ({ feedbackId, onPost }) => {

    const [ commentText, setCommentText ] = useState("")
    const [uploadImages, setUploadImages] = useState([])

    const { data:session } = useSession();

    const addNewUploadImages = (newLinks) => {
        setUploadImages(prevLinks => [...prevLinks, ...newLinks])
    }

    const removeUploadImages = (e, link) => {
        e.preventDefault();

        setUploadImages(currentUploads => {
            return currentUploads.filter(val => val !== link)
        })
    }

    const handleCommentButtonClick = async(e) => {
        e.preventDefault();

        const commentData = {
            text: commentText,
            uploadImages,
            feedbackId
        }

        if(session) {
            await axios.post('/api/comment', commentData)
            onPost();
            setCommentText('');
            setUploadImages([]);
        } else {
            localStorage.setItem('comment after login', JSON.stringify(commentData))
            await signIn('google');
        }
        
    }

  return (
    <form>
        <textarea className='border rounded-md w-full p-2' value={commentText} placeholder='Let usknow what you think...' onChange={e => setCommentText(e.target.value)}></textarea>
        {uploadImages.length > 0 && (
            <div className=''>
                <div className='text-sm text-gray-600 mb-2 mt-3'>Files</div>
                <div className='flex gap-3'>
                    {uploadImages.map(link => (
                        <div key={link}>
                            <Attachment link={link} showRemoveButton={true} handleRemoveFilesButtonClick={(e, link) => removeUploadImages(e, link)}/>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className='flex justify-end gap-2 mt-2'>
            <AttachFilesButton onNewFiles={addNewUploadImages}/>
            <Button onClick={handleCommentButtonClick} primary disabled={commentText === ''}>
                {session ? "Comment" : "Login and Comment"}
            </Button>
        </div>
      </form>
  )
}

export default CommentForm
