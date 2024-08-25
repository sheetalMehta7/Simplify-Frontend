import { Button, Navbar, Modal } from 'flowbite-react'
import { useState } from 'react'
import { DarkThemeToggle } from 'flowbite-react'
import logo from '../assets/logo.svg'
import LoginModal from '../components/LoginModal'
import SignUpModal from '../components/SignupModal'

const Header: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const handleLoginOpen = () => {
    setIsLoginOpen(true)
    setIsSignUpOpen(false)
  }
  const handleLoginClose = () => setIsLoginOpen(false)

  const handleSignUpOpen = () => {
    setIsSignUpOpen(true)
    setIsLoginOpen(false)
  }
  const handleSignUpClose = () => setIsSignUpOpen(false)

  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand href="#">
          <img src={logo} className="h-10 w-auto sm:h-12" alt="Simplify Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white ml-3 font-cursive">
            Simplify
          </span>
        </Navbar.Brand>
        <div className="flex items-center gap-2 md:order-2">
          <Button onClick={handleSignUpOpen}>Sign up</Button>
          <Button onClick={handleLoginOpen}>Log in</Button>
          <DarkThemeToggle />
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      {isLoginOpen && (
        <Modal
          show={true}
          onClose={handleLoginClose}
          size="md"
          className="fixed inset-0 flex items-center justify-center"
        >
          <LoginModal onClose={handleLoginClose} />
        </Modal>
      )}

      {isSignUpOpen && (
        <Modal
          show={true}
          onClose={handleSignUpClose}
          size="md"
          className="fixed inset-0 flex items-center justify-center"
        >
          <SignUpModal onClose={handleSignUpClose} />
        </Modal>
      )}
    </div>
  )
}

export default Header
