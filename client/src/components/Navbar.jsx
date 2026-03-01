import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">
              G Drive Express
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-white text-black font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800`}
      >
        <div className="px-6 py-4 space-y-4">
          <Link
            to="/features"
            className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <Link
              to="/login"
              className="block text-center text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block text-center px-6 py-3 bg-white text-black font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
