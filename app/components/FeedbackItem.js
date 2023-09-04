import React, { useState } from 'react'
import Popup from './Popup';
import Button from './Button';
import { signIn, useSession } from 'next-auth/react';
import axios from 'axios';
import { MoonLoader } from 'react-spinners'
import Attachment from './Attachment';
import TimeAgo from 'timeago-react';
import Like from './icons/Like';
import LikeOutlined from './icons/LikeOutlined';

const FeedbackItem = ({ onOpenFeedback, _id, title, description, images, user, createdAt, votes, onVotesChange, parentLoadingVotes=true }) => {

    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const [isVotesLoading, setIsVotesLoading] = useState(false)

    const { data: session } = useSession()
    const isLoggedIn = !!session?.user?.email;

    const handleVoteButtonClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(!isLoggedIn) {
            localStorage.setItem('vote after login', _id)
            setShowLoginPopup(true)
        } else {
            setIsVotesLoading(true);

            axios.post('api/vote', {feedbackId: _id}).then( async() => {
                await onVotesChange()
                setIsVotesLoading(false);
            });
            
        }

    }

    const handleGoogleLoginButtonClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        await signIn('google')
    }

    const iVoted = !!votes.find(v => v.userEmail === session?.user?.email)

  return (
    <a href='' onClick={ (e) => { e.preventDefault(); onOpenFeedback(); } } className='my-8 flex gap-8 items-center bg-[#b2f5d3] hover:bg-[#87e2b4] bg-opacity-1 p-4 rounded-md'>
          <div className='flex-grow'>
            <h2 className='font-bold text-gray-800'>{title}</h2>
            {images?.length > 0 && (
                <div className='mt-4'>
                    <span className='text-sm text-gray-600'>Attachments:</span>
                    <div className='flex gap-2'>
                        { images.map(link => (
                            <Attachment key={link} link={link} />
                        ))}
                    </div>
                </div>
            )}
            <p className='text-gray-700 text-sm mt-2'>{description}</p>
            <div className='mt-5'>
                <div className='flex gap-1 items-center'>    
                    <p className='text-gray-600 text-xs'>Posted By:  </p>
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
          <div>
            {showLoginPopup && (
                <Popup title={'Confirm your vote!'} narrow setShowPopup={setShowLoginPopup}>
                    <div className='p-4'>
                        <Button primary onClick={handleGoogleLoginButtonClick}>Login</Button>
                    </div>
                </Popup>
            )}
            
            <Button primary={iVoted} onClick={handleVoteButtonClick} className="shadow-md border ">
                    { !isVotesLoading && (
                        <>
                            {iVoted ? <Like className='hover:text-[#218b56] w-6 h-6'/> : <LikeOutlined />}
                            { votes?.length || '0' }
                        </>
                    )}
                    { isVotesLoading && (
                        <MoonLoader size={18}/>
                    )}
    
            </Button>

          </div>
    </a>
  )
}

export default FeedbackItem
