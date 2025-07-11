import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CurrencySelector from './CurrencySelector';
import UserProfile from './UserProfile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleAuthClick = () => {
    navigate('/signin');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force logout even if there's an error
      setIsMenuOpen(false);
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/images/standardtime.png" 
                alt="StandardTime Logo" 
                className="h-24 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/watches" className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium">
                Watches
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium">
                About
              </Link>
              <Link to="/trust" className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium">
                Why Choose Us
              </Link>
              <Link to="/payment" className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium">
                Payment
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Right side items */}
            <div className="hidden md:flex items-center space-x-4">
              <CurrencySelector />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 bg-burgundy-100 text-burgundy-900 px-4 py-2 rounded-lg hover:bg-burgundy-200 transition-colors font-medium"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>
                  </Link>
                  
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-burgundy-900 transition-colors"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAuthClick}
                    className="text-gray-700 hover:text-burgundy-900 px-4 py-2 rounded-lg font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleAuthClick}
                    className="bg-burgundy-900 text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <CurrencySelector />
                </div>
                
                <Link 
                  to="/watches" 
                  className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Watches
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/trust" 
                  className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Why Choose Us
                </Link>
                <Link 
                  to="/payment" 
                  className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Payment
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-burgundy-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {user ? (
                  <>
                    <Link
                      to="/cart"
                      className="flex items-center space-x-2 bg-burgundy-100 text-burgundy-900 px-4 py-3 rounded-lg hover:bg-burgundy-200 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Cart</span>
                    </Link>
                    
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsProfileOpen(true);
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-burgundy-900 transition-colors"
                    >
                      <UserCircle className="h-6 w-6" />
                      <span className="text-sm font-medium">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-700 hover:text-burgundy-900 px-4 py-3 rounded-lg font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-burgundy-900 text-white px-4 py-3 rounded-lg hover:bg-burgundy-800 transition-colors font-medium text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Header;