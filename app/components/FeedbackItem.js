import React from 'react'

const FeedbackItem = ({ onOpenFeedback, title, description, votesCount }) => {
  return (
    <a href='' onClick={ (e) => { e.preventDefault(); onOpenFeedback(); } } className='my-8 flex gap-8 items-center'>
          <div>
            <h2 className='font-bold'>{title}</h2>
            <p className='text-gray-600 text-sm'>{description}</p>
          </div>
          <div>
            <button className='shadow-sm shadow-gray-200 border rounded-md px-4 py-1 flex items-center gap-1 text-gray-600'>
              <span className='triangle-vote-up'></span>
              { votesCount }
            </button>
          </div>
    </a>
  )
}

export default FeedbackItem
