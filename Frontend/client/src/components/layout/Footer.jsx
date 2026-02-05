import React from 'react';
import { PawPrint, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-sky-600 rounded-xl mr-3">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                PawPerfection
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Professional pet training solutions tailored to your pet's unique needs. 
              Join our community of happy pet parents today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-sky-600 transition-colors group">
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-sky-600 transition-colors group">
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-sky-600 transition-colors group">
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Courses', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                   <Link 
                     to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                     className="text-gray-400 hover:text-sky-400 transition-colors flex items-center group"
                   >
                     <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                     {item}
                   </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Services</h3>
            <ul className="space-y-4">
              {[
                'Puppy Training',
                'Behavior Correction', 
                'Obedience Training',
                'Diet Consultation'
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-sky-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Pet Street, <br />
                  Paw Valley, CA 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">hello@pawperfection.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 PawPerfection. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
};

export default Footer;