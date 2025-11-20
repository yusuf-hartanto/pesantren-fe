// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

const DialogConfirmation = ({ ...res }) => {
  return (
    <Fragment>
      <Dialog {...res} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Apakah yakin menghapus data {res.id} ?</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={res.handleClose}>Tidak</Button>
          <Button onClick={res.handleOk} color='error'>
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogConfirmation
