import React from 'react'
import Trash from './icons/Trash'
import PaperClip from './icons/PaperClip'

const Attachment = ({ link, showRemoveButton=false, handleRemoveFilesButtonClick }) => {
  return (
    <a href={link} target='_blank' className='h-16 relative' key={link}>
        {showRemoveButton && (
            <button onClick={e => handleRemoveFilesButtonClick(e, link)} className='-right-2 -top-2 absolute bg-red-400 p-1  rounded-md text-white'>
                <Trash />
            </button>
        )}
        
        {(link.endsWith('.jpg') || link.endsWith('.png') ) ? 
            (<img className='h-16 w-auto rounded-md border-solid border-2 border-[#218b56] ' src={link} alt=''/>) : 
            (<div className='bg-gray-200 h-16 p-2 flex items-center rounded-md'>
                <PaperClip className='w-4 h-4'/>
                {link.split('/')[3].substring(13)}
            </div>)
        }
    </a>
  )
}

export default Attachment
