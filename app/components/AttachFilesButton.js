import axios from 'axios'
import React, { useState } from 'react'
import { MoonLoader } from 'react-spinners'
import Upload from './icons/Upload'

const AttachFilesButton = ({ onNewFiles }) => {

    const [isUploading, setIsUploading] = useState(false)

    const handleAttachFilesInputChange = async (e) => {
        const files = [...e.target.files]

        setIsUploading(true)

        const data = new FormData();

        for(const file of files) {
            data.append('file', file)
        }

        const res = await axios.post('/api/upload', data)

        onNewFiles(res.data)

        setIsUploading(false)
    }

  return (
    <label className={'flex gap-2 py-2 px-4 cursor-pointer items-center'}>
        {isUploading && (<MoonLoader size={18}/>)}
        {!isUploading && (
            <Upload className='w-4 h-4'/>
        )}
        <span className={(isUploading ? 'text-gray-300' : 'text-gray-600')}>
            {isUploading ? "Uploading..." : "Attach files"}
        </span>
        <input multiple onChange={handleAttachFilesInputChange} type='file' className='hidden'/>
    </label>
  )
}

export default AttachFilesButton
