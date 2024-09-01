// src/components/SearchModal.tsx
import React from 'react'
import { Modal, TextInput, Kbd } from 'flowbite-react'
import { IoMdSearch } from 'react-icons/io'

interface SearchModalProps {
  show: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ show, onClose }) => {
  return (
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Header>
        Search
        <div className="ml-auto flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>K</Kbd>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoMdSearch className="text-gray-400 text-xl" />
          </span>
          <TextInput
            type="text"
            placeholder="Search people, projects or tasks"
            className="pl-10 w-full"
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SearchModal
