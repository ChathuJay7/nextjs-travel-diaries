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
    const [voteLoading, setVotesLoading] = useState([])
    const [sort, setSort] = useState('votes')
    
    const { data: session } = useSession()

    useEffect(() => {
      fetchFeedbacks()
    }, [])

    useEffect(() => {
        fetchVotes()
    }, [feedbacks])

    useEffect(() => {
      fetchFeedbacks();
    }, [sort])

    useEffect(() => {
        if(session?.user?.email){
            const feedbackIdToVote = localStorage.getItem('vote after login')
            if(feedbackIdToVote) { 
                axios.post('/api/vote', {feedbackId: feedbackIdToVote}).then(() => {
                  localStorage.removeItem('vote after login')
                  fetchVotes()
                })  
            }

            const feedbackToPost = localStorage.getItem('post after login')
            if(feedbackToPost) { 
              const feedbackData = JSON.parse(feedbackToPost)
              axios.post('/api/feedback', feedbackData).then(async (res) => {
                await fetchFeedbacks()
                setShowFeedbackPopupItem(res.data)
                localStorage.removeItem('post after login')
              })  
            }

            const commentToPost = localStorage.getItem('comment after login')
            if(commentToPost) { 
              const commentData = JSON.parse(commentToPost)
              axios.post('/api/comment', commentData).then(async (res) => {
                axios.get('/api/feedback?id=' + commentData.feedbackId).then(res => {
                  setShowFeedbackPopupItem(res.data)
                  localStorage.removeItem('comment after login')
                })
              })  
            }
        }
    }, [session?.user?.email])

    function fetchFeedbacks() {
      axios.get("/api/feedback?sort=" + sort).then(res => {
        console.log("Data fetched")
        setFeedbacks(res.data.feedbacks)
        
      })
      console.log(feedbacks)
    }

    async function fetchVotes() {
        setVotesLoading(true)
        const ids = feedbacks.map(f => f._id)
        const res = await axios.get("/api/vote?feedbackIds=" + ids.join(','))
        setVotes(res.data)
        setVotesLoading(false)
    }

    function openFeedbackPopupForm() {
        setShowFeedbackPopupForm(true)
    }

    function openFeedbackPopupItem(feedback) {
        setShowFeedbackPopupItem(feedback)
    }

    async function handleFeedbackUpdate(updateDate) {
        setShowFeedbackPopupItem(currentData => {
          return { ...currentData, ...updateDate }
        })
        await fetchFeedbacks()
    }

  return (
    <main className='bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden'>
        { session?.user?.email || 'not logged in' }
        <div className='bg-gradient-to-r from-cyan-400 to-blue-400 p-8'>
          <h1 className='font-bold text-xl'>Feedback Board</h1>
          <p className='text-opacity-90 text-slate-700'>Help me decide what should I build next or how can I improve</p>
        </div>

        <div className='bg-gray-100 px-8 py-4 flex border-b'>
          <div className='grow flex items-center'>
            <span className='text-gray-400 text-sm'>Sort by: </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className='bg-transparent px-1 py-2 text-gray-600'>
              <option value="votes">Most voted</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <Button primary onClick={openFeedbackPopupForm} >Make a suggestion</Button>
          </div>
        </div>

        <div className='px-8'>
          { feedbacks.map( feedback => (
            <FeedbackItem { ...feedback } key={feedback._id} votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())} onVotesChange={fetchVotes} parentLoadingVotes={voteLoading} onOpenFeedback={() => openFeedbackPopupItem(feedback)} />
          ) ) }
          
        </div>

        {showFeedbackPopupForm && (
          <FeedbackFormPopup onCreate={fetchFeedbacks} setShowPopup={setShowFeedbackPopupForm}/>
        )}

        { showFeedbackPopupItem && (
          <FeedbackItemPopup {...showFeedbackPopupItem} votes={votes.filter(v => v.feedbackId.toString() === showFeedbackPopupItem._id )} onVotesChange={fetchVotes} setShowPopup={setShowFeedbackPopupItem} onUpdate={handleFeedbackUpdate}/>
        ) }
    </main>
  )
}

export default FeedbackBoard
