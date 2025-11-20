// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

const DialogInformation = ({ ...res }) => {
  return (
    <Fragment>
      <Dialog {...res} maxWidth='md' fullWidth={true} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{res.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{res.content}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={res.handleOk} color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogInformation
