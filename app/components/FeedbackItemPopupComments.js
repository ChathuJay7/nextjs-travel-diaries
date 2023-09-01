
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import CommentForm from './CommentForm'
import axios from 'axios'
import Attachment from './Attachment'
import TimeAgo from 'timeago-react'

const FeedbackItemPopupComments = ({feedbackId}) => {

  const [ comments, setComments ] = useState([])

  useEffect(() => {
    fetchComments();
  }, [comments])

  const fetchComments = () => {
    axios.get('/api/comment?feedbackId=' + feedbackId).then(res => {
      setComments(res.data)
    })
  }

  return (
    <div className='p-8'>
      {comments.length > 0 && comments.map(comment => (
        <div key={comment._id} className='mb-8'>
          <div className='flex gap-4'>
            <Avatar url={comment.user.image}/>
            <div>
                <p className='text-gray-600'>
                    {comment.text} 
                </p>
                <div className='text-gray-400 mt-2 text-sm'>
                  {comment.user.name} &middot;
                  <TimeAgo datetime={comment.createdAt} locale='en-US' />
                </div>
                {comment.images.length > 0 && (
                  <div className='flex gap-2 mt-3'>
                    {comment.images.map(link => (
                      <Attachment key={link} link={link}/>
                    ))}
                  </div>
                )}
            </div>
          </div>
          
        </div>
      ))}
      
      <CommentForm feedbackId={feedbackId} onPost={fetchComments}/>
    </div>
  )
}

export default FeedbackItemPopupComments
