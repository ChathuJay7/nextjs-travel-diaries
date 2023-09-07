import React, { useState } from 'react'
import Popup from './Popup'
import Button from './Button'
import FeedbackItemPopupComments from './FeedbackItemPopupComments'
import axios from 'axios'
import { MoonLoader } from 'react-spinners'
import { signIn, useSession } from 'next-auth/react'
import Tick from './icons/Tick'
import Attachment from './Attachment'
import Edit from './icons/Edit'
import AttachFilesButton from './AttachFilesButton'
import Cancel from './icons/Cancel'
import Like from './icons/Like'
import LikeOutlined from './icons/LikeOutlined'
import Trash from './icons/Trash'
import TimeAgo from 'timeago-react'

const FeedbackItemPopup = ({_id, title, description, images, createdAt, votes, onVotesChange, setShowPopup, user, onUpdate, onDelete}) => {

    const [isVotesLoading, setIsVotesLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [newTitle, setNewTitle] = useState(title)
    const [newDescription, setNewDescription] = useState(description)
    const [newUploadImages, setNewUploadImages] = useState(images)

    const {data:session} = useSession();
    const isLoggedIn = !!session?.user?.email;

    async function handleVoteButtonClick() {
        if(!isLoggedIn) {
            localStorage.setItem('vote after login post open', _id)
            console.log(_id)
            await signIn('google');
        } else {
            setIsVotesLoading(true);
            axios.post('api/vote', {feedbackId: _id}).then( async() => {
                await onVotesChange()
                setIsVotesLoading(false);
            });
            
        }
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

    // const handleDeletePostButtonClick = () => {
    //     axios.delete('/api/feedback', {
    //         id: _id,
    //     }).then(() => {
    //         onDelete()
    //         setShowPopup(false)
            
    //     })
    // }
    const handleDeletePostButtonClick = () => {
        axios
          .delete('/api/feedback', {
            data: { id: _id }
          })
          .then((response) => {
            // Check if the response contains a message
            if (response.data && response.data.message) {
              setShowPopup(false);
              onDelete();
              alert(response.data.message);
            }
          })
    };
      
console.log(user)

    const iVoted = votes.find(v => v.userEmail === session?.user?.email )

  return (
    <Popup title={''} setShowPopup={setShowPopup}>
        <div className='p-8 pb-2'>
            {isEditMode && (
                <input className='block w-full mb-2 p-2 border rounded-md' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            )}
            {/* {!isEditMode && (
                <h2 className='text-lg font-bold mb-2' >{title}</h2>
            )} */}

            {(!isEditMode && user?.email && session?.user?.email === user?.email) ? (
                <div className='flex justify-between mb-2'>
                    <h2 className='text-lg font-bold mb-2' >{title}</h2>
                    <span className='text-red-400 flex items-center gap-1 border-solid border-2 border-red-400 rounded-md px-2 hover:bg-red-400 hover:text-white hover:cursor-pointer font-bold' onClick={handleDeletePostButtonClick}>
                        <Trash className='h-4 w-4'/> Delete
                    </span >
                </div>
            ) : <h2 className='text-lg font-bold mb-2' >{title}</h2>}  

            {/* {!isEditMode && user?.email && session?.user?.email === user?.email && (
                <div className='flex justify-between'>
                    <h2 className='text-lg font-bold mb-2' >{title}</h2>
                    <p>Delete</p>
                </div>
            )} */}
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
            <div className='mt-5'>
                <div className='flex gap-1 items-center'>    
                    <p className='text-gray-600 text-xs'>Posted By: </p>
                    <div className='rounded-full bg-blue-300 w-3 h-3 overflow-hidden'>
                        <img src={user.image} alt='avatar' />
                    </div>
                    <p className='text-gray-600 text-xs'>{user.name}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <p className='text-gray-600 text-xs'>Posted At:  </p>
                    <TimeAgo className='text-gray-600 text-xs' datetime={createdAt} locale='en-US' />
                </div>
            </div>
        </div>
        <div className='flex justify-end gap-2 px-8 py-2 border-b border-slate-500'> 
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
                                    <Like className='w-5 h-5'/>
                                    Liked {votes?.length}
                                </>
                            )}
                            {!iVoted && (
                                <>
                                    <LikeOutlined />
                                    Like {votes?.length || '0'}
                                </>
                            )}
                            
                        </>
                    )}
                    
                </Button>
            ) }
        </div>
        <p className='px-8 py-2'>Comments</p>
        <div>
            <FeedbackItemPopupComments feedbackId={_id}/>
        </div>
    </Popup>
  )
}

export default FeedbackItemPopup
