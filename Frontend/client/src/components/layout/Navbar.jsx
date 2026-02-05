import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Info, FileType, Mail, PawPrint, User, Heart } from 'lucide-react';
import Avatar from '../Avatar';
import { useSelector  } from 'react-redux';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
              <PawPrint className="h-8 w-8 text-sky-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">PawPerfection</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {user ? (
              <>
                <NavLink href='/' icon={<Home size={18} />} text="Home" />
                <NavLink href="/course" icon={<FileType size={18} />} text="Courses" />
                <NavLink href="/contact" icon={<Mail size={18} />} text="Contact" />
                <NavLink href="/pets" icon={<Heart size={18} />} text="My Pets" />
                <Avatar />
              </>
            ) : (
              <>
                <NavLink href="/login" icon={<User size={18} />} text="Login" />
                <a 
                  href="/signup" 
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
          {user ? (
            <>
              <MobileNavLink href="/" icon={<Home size={18} />} text="Home" />
              <MobileNavLink href="/contact" icon={<Mail size={18} />} text="Contact" />
              <MobileNavLink href="/course" icon={<FileType size={18} />} text="Courses" />
              <MobileNavLink href="/pets" icon={<Heart size={18} />} text="My Pets" />
              <div className="mt-4 px-4 pb-4">
                <Avatar />
              </div>
            </>
          ) : (
            <div className="px-3 space-y-3 mt-2 pb-4">
              <a href="/login" className="block">
                <button className="w-full px-4 py-2.5 text-sm font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                  Login
                </button>
              </a>
              <a href="/signup" className="block">
                <button className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black transition duration-200 shadow-md">
                  Sign Up
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop Nav Link
const NavLink = ({ href, icon, text }) => (
  <a
    href={href}
    className="inline-flex items-center px-1 pt-1 pb-2 text-sm font-medium text-gray-600 hover:text-sky-600 transition duration-200 group relative"
  >
    <span className="mr-1.5 text-gray-400 group-hover:text-sky-600 transition-colors">{icon}</span>
    {text}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
  </a>
);

// Mobile Nav Link
const MobileNavLink = ({ href, icon, text }) => (
  <a
    href={href}
    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition duration-200"
  >
    <span className="mr-3 text-gray-500 group-hover:text-sky-600">{icon}</span>
    {text}
  </a>
);

export default Navbar;
