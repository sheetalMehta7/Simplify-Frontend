import { Button, Navbar } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand href="#">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Simplify Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Simplify
          </span>
        </Navbar.Brand>
        <div className="flex gap-2 md:order-2">
          <Button onClick={() => navigate('/register')}>Sign up</Button>
          <Button onClick={() => navigate('/login')}>Log in</Button>
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
    </div>
  )
}

export default Header
