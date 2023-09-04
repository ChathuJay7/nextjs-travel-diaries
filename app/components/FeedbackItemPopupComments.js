
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import CommentForm from './CommentForm'
import axios from 'axios'
import Attachment from './Attachment'
import TimeAgo from 'timeago-react'
import { useSession } from 'next-auth/react'
import AttachFilesButton from './AttachFilesButton'

const FeedbackItemPopupComments = ({feedbackId}) => {

  const [ comments, setComments ] = useState([])
  const [ editingComment, setEditingComment ] = useState(null)
  const [ newCommentText, setNewCommentText ] = useState('')
  const [ newCommentImagesUpload, setNewCommentImagesUpload ] = useState([])

  const {data:session} = useSession();

  useEffect(() => {
    fetchComments();
  }, [])

  const fetchComments = () => {
    axios.get('/api/comment?feedbackId=' + feedbackId).then(res => {
      setComments(res.data)
    });
  }

  const handleEditButtonClick = (comment) => {
    setEditingComment(comment)
    setNewCommentText(comment.text)
    setNewCommentImagesUpload(comment.images)
  }

  const handleCancelButtonClick = () => {
    setNewCommentText('')
    setNewCommentImagesUpload([])
    setEditingComment(null)
  }

  const handleRemoveFilesButtonClick = (e, linkToRemove) => {
    e.preventDefault();

    setNewCommentImagesUpload(currentUploads => {
      return currentUploads.filter(val => val !== linkToRemove)
    })
  }

  const addNewCommentUploadImages = (newLinks) => {
    setNewCommentImagesUpload(prevLinks => [...prevLinks, ...newLinks])
  }

  const handleSaveChangesButtonClick = async () => {
    const updateComment = { text: newCommentText, uploadImages: newCommentImagesUpload }
    await axios.put('/api/comment', { id: editingComment._id, ...updateComment });
    // setComments(existingComments => {
    //   return existingComments.map(comment => {
    //     if(comment._id === editingComment._id){
    //       return {...comment, ...updateComment}
    //     } else {
    //       return comment;
    //     }
    //   })
    // })
    fetchComments()
    setEditingComment(null)

  }

  return (
    <div className='p-8'>
      {comments.length > 0 && comments.map(comment => {
        
        const editingthisComment = editingComment?._id === comment._id;
        const isAuthor = !!comment?.user?.email && comment.user.email === session?.user?.email;

        return (
          <div key={comment._id} className='mb-8 bg-[#b2f5d3] hover:bg-[#87e2b4] p-4 rounded-md'>
            <div className='flex gap-4'>
              <Avatar url={comment.user.image}/>
              <div>
                  {editingthisComment && (
                    <textarea value={newCommentText} className='border p-2 block w-full' onChange={(e) => setNewCommentText(e.target.value)}/>
                  )}
                  {!editingthisComment && (
                    <p className='text-gray-600' >
                      {comment.text} 
                    </p>
                  )}
                  
                  <div className='text-gray-400 mt-2 text-sm'>
                    {comment.user.name} 
                    &nbsp; &middot; &nbsp;
                    <TimeAgo datetime={comment.createdAt} locale='en-US' />
                    {!editingthisComment && isAuthor && (
                      <>
                        &nbsp; &middot; &nbsp;
                        <span onClick={() => handleEditButtonClick(comment)} className='cursor-pointer hover:underline'>Edit</span>
                      </>
                    )}
                    {editingthisComment && (
                      <>
                        &nbsp; &middot; &nbsp;
                        <span onClick={handleCancelButtonClick} className='cursor-pointer hover:underline'>Cancel</span>
                        &nbsp; &middot; &nbsp;
                        <span onClick={handleSaveChangesButtonClick} className='cursor-pointer hover:underline'>Save Changes</span>
                      </>
                    )}
                  </div>
                  {(editingthisComment ? newCommentImagesUpload : comment.images).length > 0 && (
                    <div className='flex gap-2 mt-3'>
                      {(editingthisComment ? newCommentImagesUpload : comment.images).map(link => (
                        <Attachment key={link} link={link} showRemoveButton={editingComment?._id === comment?._id} handleRemoveFilesButtonClick={handleRemoveFilesButtonClick}/>
                      ))}
                    </div>
                  )}
                  {editingthisComment && (
                    <div className='mt-2'>
                      <AttachFilesButton onNewFiles={addNewCommentUploadImages}/>
                    </div>
                  )}
              </div>
            </div>
            
          </div>
      )})}
      {!editingComment && (
        <CommentForm feedbackId={feedbackId} onPost={fetchComments}/>
      )}
    </div>
  )
}

export default FeedbackItemPopupComments
