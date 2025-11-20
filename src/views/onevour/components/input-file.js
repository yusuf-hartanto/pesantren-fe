import React, { useState } from 'react'
import { Button, Input, Box, Typography } from '@mui/material'

const FileUpload = props => {
  // ** Props
  const { data, name, selected, gridProps, handleChange, handleClear } = props

  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (selectedFile) {
      // Perform PDF file upload logic here
      console.log('Uploading file: ', selectedFile)
      handleChange(selectedFile)
    } else {
      console.log('No file selected')
    }
  }

  const handleUrl = () => {
    window.open(props.url, '_blank')
  }

  return (
    <Box item {...gridProps}>
      {selected ? (
        <>
          <Button size='small' onClick={handleUrl} sx={{ mt: 2 }}>
            <Typography variant='body2' sx={{ mt: 1 }}>
              Upload file: {selected}
            </Typography>
          </Button>
          <Button size='small' onClick={handleClear} sx={{ mt: 2 }}>
            Hapus
          </Button>
        </>
      ) : (
        <>
          <Input
            type='file'
            onChange={handleFileChange}
            inputProps={{ accept: 'application/pdf' }} // Only PDF files
          />
          <Button variant='contained' color='primary' onClick={handleUpload} disabled={!selectedFile} sx={{ mt: 2 }}>
            Upload
          </Button>
        </>
      )}
    </Box>
  )
}

export default FileUpload
