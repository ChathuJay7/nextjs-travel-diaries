import React, { useState } from 'react'
import Popup from './Popup';
import Button from './Button';
import { signIn } from 'next-auth/react';

const FeedbackItem = ({ onOpenFeedback, _id, title, description, votes }) => {

    const [showLoginPopup, setShowLoginPopup] = useState(false)

    const isLoggedIn = false

    const handleVoteButtonClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(!isLoggedIn) {
            localStorage.setItem('vote after login', _id)
            setShowLoginPopup(true)
        }
    }

    const handleGoogleLoginButtonClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        await signIn('google')
    }

    

  return (
    <a href='' onClick={ (e) => { e.preventDefault(); onOpenFeedback(); } } className='my-8 flex gap-8 items-center'>
          <div className='flex-grow'>
            <h2 className='font-bold'>{title}</h2>
            <p className='text-gray-600 text-sm'>{description}</p>
          </div>
          <div>
            {showLoginPopup && (
                <Popup title={'Confirm your vote!'} narrow setShowPopup={setShowLoginPopup}>
                    <div className='p-4'>
                        <Button primary onClick={handleGoogleLoginButtonClick}>Login</Button>
                    </div>
                </Popup>
            )}
            <button onClick={handleVoteButtonClick} className='shadow-sm shadow-gray-200 border rounded-md px-4 py-1 flex items-center gap-1 text-gray-600'>
              <span className='triangle-vote-up'></span>
              { votes?.length || '0' }
            </button>
          </div>
    </a>
  )
}

export default FeedbackItem
