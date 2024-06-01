import { Button, Fade, Modal, TextField } from '@mui/material'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'

const DeleteAccountModal = ({
  openDelete,
  setOpenDelete,
  confirmationMessage,
  confirm,
  isBtnLoading,
  windowWidth,
}) => {
  const [deleteInput, setDeleteInput] = useState('')

  const onConfirm = () => {
    if (deleteInput !== 'delete') return
    confirm()
  }

  return (
    <Modal
      open={openDelete}
      onClose={() => setOpenDelete(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openDelete}>
        <div className="text-primary flex flex-col rounded-lg items-center justify-center gap-10 bg-background p-14  max-lg:w-4/5 max-lg:h-4/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center">
          <h1 className="text-3xl max-md:text-xl max-lg:text-center">
            {confirmationMessage}
          </h1>
          <h2 className="text-2xl max-md:text-lg max-lg:text-center">
            To confirm your action, write delete in the input.
          </h2>

          <TextField
            required
            value={deleteInput}
            placeholder="Delete your account"
            onChange={e => setDeleteInput(e.target.value)}
          />

          <div className="flex gap-7">
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#333329',
                textTransform: 'none',
                color: '#fff',
                padding: '15px 35px',
                '&:hover': {
                  color: '#333329',
                  background: '#fff',
                },
              }}
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#333329',
                textTransform: 'none',
                color: '#fff',
                padding: '15px 35px',
                '&:hover': {
                  color: '#333329',
                  background: '#fff',
                },
              }}
              disabled={deleteInput !== 'delete' || isBtnLoading}
              onClick={onConfirm}
            >
              {isBtnLoading ? <ClipLoader size={20} /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default DeleteAccountModal
