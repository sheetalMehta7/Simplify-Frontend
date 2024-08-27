import { Button, Navbar, Modal } from 'flowbite-react'
import { useState } from 'react'
import { DarkThemeToggle } from 'flowbite-react'
import logo from '../assets/logo.svg'
import LoginModal from '../components/Modals/LoginModal'
import SignUpModal from '../components/Modals/SignupModal'

const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(
    null,
  )

  const openLoginModal = () => setActiveModal('login')
  const openSignUpModal = () => setActiveModal('signup')
  const closeModal = () => setActiveModal(null)

  // Switch modals
  const switchToSignUp = () => setActiveModal('signup')
  const switchToLogin = () => setActiveModal('login')

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
          <Button onClick={openSignUpModal}>Sign up</Button>
          <Button onClick={openLoginModal}>Log in</Button>
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

      {/* Login Modal */}
      {activeModal === 'login' && (
        <Modal
          show={true}
          onClose={closeModal}
          size="md"
          className="fixed inset-0 flex items-center justify-center"
        >
          <LoginModal
            onClose={closeModal}
            onSwitch={switchToSignUp} // Pass switch handler
          />
        </Modal>
      )}

      {/* Sign Up Modal */}
      {activeModal === 'signup' && (
        <Modal
          show={true}
          onClose={closeModal}
          size="md"
          className="fixed inset-0 flex items-center justify-center"
        >
          <SignUpModal
            onClose={closeModal}
            onSwitch={switchToLogin} // Pass switch handler
          />
        </Modal>
      )}
    </div>
  )
}

export default Header
