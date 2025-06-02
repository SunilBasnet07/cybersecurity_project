'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { DASHBOARD_ROUTE, HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@/routes/route';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/auth/authSlice';
import { useRouter } from 'next/navigation';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()
  const {user} = useSelector((state)=>state.auth);
function handleLogout(){
   dispatch(logout())
   router.push(LOGIN_ROUTE)
   
}
  const navLinks = [
    user ? ({ name:"Dashboard", href:DASHBOARD_ROUTE}) : {name:"login",href:LOGIN_ROUTE } ,
 
  ];

  return (
    <nav className="bg-white shadow-md fixed z-50 top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-Nunito-ExtraBold text-indigo-600 hover:text-indigo-700">
              CyberSecurity
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link,index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-Nunito-SemiBold transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          {user ? (<button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >logout</button>) : (    <Link
           
            href={REGISTER_ROUTE}
            className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-Nunito-SemiBold transition-colors duration-200"
          >
          Register
          </Link>)}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;