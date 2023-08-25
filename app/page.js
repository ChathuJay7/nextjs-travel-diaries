"use client"

import FeedbackItem from './components/FeedbackItem'
import { useState } from 'react'
import FeedbackFormPopup from './components/FeedbackFormPopup'
import Button from './components/Button'
import FeedbackItemPopup from './components/FeedbackItemPopup'

export default function Home() {

  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false)
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null)

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true)
  }

  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback)
  }

  const feedbacks = [
    { 
      title: 'Please more vides', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      votesCount: 80
    },
    { 
      title: 'Youtube vides', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborums.',
      votesCount: 50
    }
  ]

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
          <Button primary onClick={openFeedbackPopupForm} >Make a suggestion</Button>
        </div>
      </div>

      <div className='px-8'>
        { feedbacks.map( feedback => (
          <FeedbackItem { ...feedback } key={feedback.title} onOpenFeedback={() => openFeedbackPopupItem(feedback)} />
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
