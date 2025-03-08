import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg shadow-purple-900/10' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* <img 
                src="https://cfi.iitm.ac.in/assets/IITMadrasLogo-23dbf76e.png" 
                alt="IIT Madras Logo" 
                className="h-12 w-auto"
              /> */}
              <img 
                src="https://cfi.iitm.ac.in/assets/CFI%20Logo%20-%20White-6966b7c8.png" 
                alt="CFI Logo" 
                className="h-12 w-auto"
              />
            </div>
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Open House
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <a href="/#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <Link 
              to="/register" 
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Register
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden absolute left-0 right-0 bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'top-full opacity-100 visible' 
              : 'top-[calc(100%-10px)] opacity-0 invisible'
          }`}
        >
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors py-2">Home</Link>
            <a href="/#about" className="text-gray-300 hover:text-white transition-colors py-2">About</a>
            <a href="/#features" className="text-gray-300 hover:text-white transition-colors py-2">Features</a>
            <Link 
              to="/register" 
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 inline-block text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;