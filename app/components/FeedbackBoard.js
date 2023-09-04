import React, { useRef } from 'react'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { SessionProvider, useSession } from 'next-auth/react'
import Button from './Button'
import FeedbackItem from './FeedbackItem'
import FeedbackFormPopup from './FeedbackFormPopup'
import FeedbackItemPopup from './FeedbackItemPopup'
import Search from './icons/Search'
import { debounce } from 'lodash'
import { MoonLoader } from 'react-spinners'
import hero from '@/app/images/hero.jpg'
import Image from 'next/image'

const FeedbackBoard = () => {

    const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false)
    const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null)
    const [feedbacks, setFeedbacks] = useState([])
    const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [votes, setVotes] = useState([])
    const [voteLoading, setVotesLoading] = useState([])
    const [sort, setSort] = useState('votes')
    const [searchPhrase, setSearchPhrase] = useState("")
    const sortRef = useRef('votes')
    const searchPhraseRef = useRef('')
    const waitingRef = useRef(false);
    const debouncedFetchFeedbacksRef = useRef(
      debounce(fetchFeedbacks, 300)
    );
    const { data: session } = useSession()

    useEffect(() => {
      fetchFeedbacks()
    }, [])

    useEffect(() => {
        fetchVotes()
    }, [feedbacks])

    useEffect(() => {
      searchPhraseRef.current = searchPhrase;
      sortRef.current = sort;
      setWaiting(true);
      waitingRef.current= true
      if(feedbacks?.length > 0){
        setFeedbacks([])
      }
      debouncedFetchFeedbacksRef.current();
    }, [sort, searchPhrase])

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
      setFetchingFeedbacks(true)
      axios.get(`/api/feedback?sort=${sortRef.current}&search=${searchPhraseRef.current}`).then(res => {
        setFeedbacks(res.data.feedbacks)
        console.log(sortRef)
        setFetchingFeedbacks(false)
        waitingRef.current = false
        setWaiting(false)
      })
      
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
    <main className='bg-[#d9ffec] md:max-w-full mx-auto md:shadow-lg md:rounded-lg  overflow-hidden'>
        
        <div className='bg-[#d9ffec] p-8'>
          <h1 className='font-bold text-3xl text-center mb-5 text-teal-700'>Travel Diaries</h1>
          <Image src={hero} alt="hero" className='rounded-md'/>
          
          <p className='text-opacity-90 text-teal-700 font-dancing-script text-center text-xl mt-2'>Take only Pictures. Leave only foot prints.</p>
        </div>

        <div className='bg-gray-100 px-8 py-4 flex items-center border-b'>
          <div className='grow flex items-center gap-4 text-gray-500'>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className='bg-transparent px-1 py-2 '>
              <option value="votes">Most voted</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className='relative'>
              <Search className='h-4 w-4 absolute top-3 left-2 pointer-events-none'/>
              <input type='text' value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value)} placeholder='Search' className='bg-transparent p-2 pl-7'/>
            </div>
          </div>
          
          <div>
            <Button primary onClick={openFeedbackPopupForm} >Add Post</Button>
          </div>
        </div>

        <div className='px-8'>
          {(feedbacks?.length === 0 && (!fetchingFeedbacks && !waiting))  && (
            <div className='py-8 text-4xl text-gray-400'>
              No result Founds
            </div>
          )}
          { feedbacks.map( feedback => (
            <FeedbackItem { ...feedback } key={feedback._id} votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())} onVotesChange={fetchVotes} parentLoadingVotes={voteLoading} onOpenFeedback={() => openFeedbackPopupItem(feedback)} />
          ) ) }
          {(fetchingFeedbacks || waiting) && (
            <div className='p-4'>
              <MoonLoader size={24} />
            </div>
          )}
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
