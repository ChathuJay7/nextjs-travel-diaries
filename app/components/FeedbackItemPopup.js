import React, { useState } from 'react'
import Popup from './Popup'
import Button from './Button'
import FeedbackItemPopupComments from './FeedbackItemPopupComments'
import axios from 'axios'
import { MoonLoader } from 'react-spinners'
import { useSession } from 'next-auth/react'
import Tick from './icons/Tick'

const FeedbackItemPopup = ({_id ,title, description, votes, onVotesChange, setShowPopup}) => {

    const [isVotesLoading, setIsVotesLoading] = useState(false)
    const {data:session} = useSession();

    function handleVoteButtonClick() {
        setIsVotesLoading(true)
        axios.post('api/vote', { feedbackId: _id }).then( async () => {
            await onVotesChange();
            setIsVotesLoading(false)
        })
    }

    const iVoted = votes.find(v => v.userEmail === session?.user?.email )

  return (
    <Popup title={''} setShowPopup={setShowPopup}>
        <div className='p-8 pb-2'>
            <h2 className='text-lg font-bold mb-2'>{title}</h2>
            <p className='text-gray-600'>{description}</p>
        </div>
        <div className='flex justify-end px-8 py-2 border-b'>  
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
        </div>
        <div>
            <FeedbackItemPopupComments />
        </div>
    </Popup>
  )
}

export default FeedbackItemPopup
