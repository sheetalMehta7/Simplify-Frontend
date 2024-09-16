import React from 'react'
import { Modal, Button } from 'flowbite-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Confirm Action</Modal.Header>
      <Modal.Body>
        <p className="text-gray-900 dark:text-white">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="red" onClick={onConfirm}>
          Yes
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
