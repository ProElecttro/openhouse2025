import { Link } from 'react-router-dom';
import { MapPin, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-purple-900/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 inline-block">
              CFI Open House
            </Link>
            <p className="text-gray-400 mb-6">
              Showcasing student innovation and technological breakthroughs at IIT Madras.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/cfi.iitm" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/CFI_IITM/" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/cfi_iitm_/?hl=en" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/centre-for-innovation-cfi/posts/?feedView=all" className="text-gray-400 hover:text-purple-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors">Home</Link></li>
              <li><a href="/#about" className="text-gray-400 hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="/#features" className="text-gray-400 hover:text-purple-400 transition-colors">Features</a></li>
              <li><Link to="/register" className="text-gray-400 hover:text-purple-400 transition-colors">Register</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">Centre for Innovation, IIT Madras, Chennai, Tamil Nadu 600036</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-purple-500 mr-2 flex-shrink-0" />
                <a href="mailto:cfi@iitm.ac.in" className="text-gray-400 hover:text-purple-400 transition-colors">cfi@iitm.ac.in</a>
              </li>
              {/* <li className="flex items-center">
                <Phone size={18} className="text-purple-500 mr-2 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-purple-400 transition-colors">+91 98765 43210</a>
              </li> */}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">Stay updated with the latest news and announcements.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Centre for Innovation, IIT Madras. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;