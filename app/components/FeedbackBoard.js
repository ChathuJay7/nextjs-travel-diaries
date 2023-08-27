import React from 'react'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { SessionProvider, useSession } from 'next-auth/react'
import Button from './Button'
import FeedbackItem from './FeedbackItem'
import FeedbackFormPopup from './FeedbackFormPopup'
import FeedbackItemPopup from './FeedbackItemPopup'

const FeedbackBoard = () => {

    const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false)
    const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null)
    const [feedbacks, setFeedbacks] = useState([])
    const [votes, setVotes] = useState([])
    
    const { data: session } = useSession()

    useEffect(() => {
        axios.get("/api/feedback").then(res => {
            setFeedbacks(res.data.feedbacks)
        })
    }, [])

    useEffect(() => {
        const ids = feedbacks.map(f => f._id)
        axios.get("/api/vote?feedbackIds=" + ids.join(',')).then(res => {
            setVotes(res.data)
        })
    }, [feedbacks])

    useEffect(() => {
        if(session?.user?.email){
            const feedbackId = localStorage.getItem('vote after login')

            if(feedbackId) {
                axios.post('/api/vote', {
                    feedbackId
                })
            }
        }
    }, [session?.user?.email])

    function openFeedbackPopupForm() {
        setShowFeedbackPopupForm(true)
    }

    function openFeedbackPopupItem(feedback) {
        setShowFeedbackPopupItem(feedback)
    }

  return (
    <main className='bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden'>
        {votes?.map(v => v.feedbackId).join(',')}
        { session?.user?.email || 'not logged in' }
        <div className='bg-gradient-to-r from-cyan-400 to-blue-400 p-8'>
          <h1 className='font-bold text-xl'>Feedback Board</h1>
          <p className='text-opacity-90 text-slate-700'>Help me decide what should I build next or how can I improve</p>
        </div>

        <div className='bg-gray-100 px-8 py-4 flex border-b'>
          <div className='grow'>

          </div>
          <div>
            <Button primary onClick={openFeedbackPopupForm} >Make a suggestion</Button>
          </div>
        </div>

        <div className='px-8'>
          { feedbacks.map( feedback => (
            <FeedbackItem { ...feedback } key={feedback._id} votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())} onOpenFeedback={() => openFeedbackPopupItem(feedback)} />
          ) ) }
          
        </div>

        {showFeedbackPopupForm && (
          <FeedbackFormPopup setShowPopup={setShowFeedbackPopupForm}/>
        )}

        { showFeedbackPopupItem && (
          <FeedbackItemPopup {...showFeedbackPopupItem} setShowPopup={setShowFeedbackPopupItem}/>
        ) }
    </main>
  )
}

export default FeedbackBoard
