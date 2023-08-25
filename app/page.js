"use client"

import Image from 'next/image'
import FeedbackItem from './components/FeedbackItem'
import { useState } from 'react'
import FeedbackFormPopup from './components/FeedbackFormPopup'
import Button from './components/Button'

export default function Home() {

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)

  function openFeedbackPopUp() {
    setShowFeedbackPopup(true)
  }

  return (
    <main className='bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden'>
      <div className='bg-gradient-to-r from-cyan-400 to-blue-400 p-8'>
        <h1 className='font-bold text-xl'>Feedback Board</h1>
        <p className='text-opacity-90 text-slate-700'>Help me decide what should I build next or how can I improve</p>
      </div>

      <div className='bg-gray-100 px-8 py-4 flex border-b'>
        <div className='grow'>

        </div>
        <div>
          <Button primary onClick={openFeedbackPopUp} >Make a suggestion</Button>
        </div>
      </div>

      <div className='px-8'>
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
      </div>

      {showFeedbackPopup && (
        <FeedbackFormPopup setShowPopup={setShowFeedbackPopup}/>
      )}
    </main>
  )
}
