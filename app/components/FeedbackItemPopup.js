import React from 'react'
import Popup from './Popup'
import Button from './Button'
import FeedbackItemPopupComments from './FeedbackItemPopupComments'

const FeedbackItemPopup = ({title, description, votesCount, setShowPopup}) => {
  return (
    <Popup title={''} setShowPopup={setShowPopup}>
        <div className='p-8 pb-2'>
            <h2 className='text-lg font-bold mb-2'>{title}</h2>
            <p className='text-gray-600'>{description}</p>
        </div>
        <div className='flex justify-end px-8 py-2 border-b'>
            <Button primary>
                <span className='triangle-vote-up'></span>
                Upvote {votesCount}
            </Button>
        </div>
        <div>
            <FeedbackItemPopupComments />
        </div>
    </Popup>
  )
}

export default FeedbackItemPopup
