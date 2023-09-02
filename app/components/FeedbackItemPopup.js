import React, { useState } from 'react'
import Popup from './Popup'
import Button from './Button'
import FeedbackItemPopupComments from './FeedbackItemPopupComments'
import axios from 'axios'
import { MoonLoader } from 'react-spinners'
import { useSession } from 'next-auth/react'
import Tick from './icons/Tick'
import Attachment from './Attachment'
import Edit from './icons/Edit'
import AttachFilesButton from './AttachFilesButton'
import Cancel from './icons/Cancel'

const FeedbackItemPopup = ({_id, title, description, images, votes, onVotesChange, setShowPopup, user, onUpdate}) => {

    const [isVotesLoading, setIsVotesLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [newTitle, setNewTitle] = useState(title)
    const [newDescription, setNewDescription] = useState(description)
    const [newUploadImages, setNewUploadImages] = useState(images)
    const {data:session} = useSession();

    function handleVoteButtonClick() {
        setIsVotesLoading(true)
        axios.post('api/vote', { feedbackId: _id }).then( async () => {
            await onVotesChange();
            setIsVotesLoading(false)
        })
    }

    function handleEditButtonClick() {
        setIsEditMode(true)
    }

    const handleRemoveFilesButtonClick = async(e, linkToRemove) => {
        e.preventDefault();

        setNewUploadImages(currentUploads => {
            return currentUploads.filter(val => val !== linkToRemove)
        })
    }

    const handleCancelButtonClick = () => {
        setIsEditMode(false)
        setNewTitle(title)
        setNewDescription(description)
        setNewUploadImages(images)
    }

    const handleNewUploadImagesButtonClick = (newUploadImageLinks) => {
        setNewUploadImages(currentUploadImageLinks => [...currentUploadImageLinks, ...newUploadImageLinks])
    }

    const handleSaveButtonClick = () => {
        axios.put('/api/feedback', {
            id: _id,
            title: newTitle,
            description: newDescription,
            uploadImages: newUploadImages
        }).then(() => {
            setIsEditMode(false)
            onUpdate({
                title: newTitle,
                description: newDescription,
                images: newUploadImages
            });
        })
    }


    const iVoted = votes.find(v => v.userEmail === session?.user?.email )

  return (
    <Popup title={''} setShowPopup={setShowPopup}>
        <div className='p-8 pb-2'>
            {isEditMode && (
                <input className='block w-full mb-2 p-2 border rounded-md' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            )}
            {!isEditMode && (
                <h2 className='text-lg font-bold mb-2' >{title}</h2>
            )}
            {isEditMode && (
                <textarea className='block w-full mb-2 p-2 border rounded-md' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            )}
            {!isEditMode && (
                <p className='text-gray-600'>{description}</p>
            )}
            
            {images?.length > 0 && (
                <div className='mt-4'>
                    <span className='text-sm text-gray-600'>Attachments:</span>
                    <div className='flex gap-2'>
                        { (isEditMode ? newUploadImages : images).map(link => (
                            <Attachment key={link} link={link} showRemoveButton={isEditMode} handleRemoveFilesButtonClick={handleRemoveFilesButtonClick}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <div className='flex justify-end gap-2 px-8 py-2 border-b'> 
            {isEditMode && (
                <>
                    <AttachFilesButton onNewFiles={handleNewUploadImagesButtonClick}/>
                    <Button onClick={handleCancelButtonClick}><Cancel className='h-5 w-5'/>Cancel</Button>
                    <Button primary onClick={handleSaveButtonClick}>Save Chages</Button>
                </>
            )}
            {!isEditMode && user?.email && session?.user?.email === user?.email && (
                <Button onClick={handleEditButtonClick}>
                    <Edit className='w-5 h-5'/>
                    Edit
                </Button> 
            )}
            
            { !isEditMode && (
                <Button primary onClick={handleVoteButtonClick}>
                    { isVotesLoading && (
                        <MoonLoader size={18}/>
                    )}
                    { !isVotesLoading && (
                        <>
                            {iVoted && (
                                <>
                                    <Tick className='w-5 h-5'/>
                                    Upvoted {votes?.length}
                                </>
                            )}
                            {!iVoted && (
                                <>
                                    <span className='triangle-vote-up'></span>
                                    Upvote {votes?.length || '0'}
                                </>
                            )}
                            
                        </>
                    )}
                    
                </Button>
            ) }
        </div>
        <div>
            <FeedbackItemPopupComments feedbackId={_id}/>
        </div>
    </Popup>
  )
}

export default FeedbackItemPopup
