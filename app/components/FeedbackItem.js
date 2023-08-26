import React, { useState } from 'react'
import Popup from './Popup';

const FeedbackItem = ({ onOpenFeedback, title, description, votesCount }) => {

    const [showLoginPopup, setShowLoginPopup] = useState(false)

    const handleVoteButtonClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        setShowLoginPopup(true)
    }

    const isLoggedIn = false

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
                        Login page
                    </div>
                </Popup>
            )}
            <button onClick={handleVoteButtonClick} className='shadow-sm shadow-gray-200 border rounded-md px-4 py-1 flex items-center gap-1 text-gray-600'>
              <span className='triangle-vote-up'></span>
              { votesCount || '0' }
            </button>
          </div>
    </a>
  )
}

export default FeedbackItem
