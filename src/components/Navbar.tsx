import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Image } from "lucide-react";
import { useFirebase } from '../context/FirebaseContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, currentUser } = useFirebase();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('token');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Image className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">PixFlow</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/explore" className="text-gray-600 hover:text-blue-600 transition-colors">
              Explore
            </Link>
            <Link to="/editor" className="text-gray-600 hover:text-blue-600 transition-colors">
              Editor
            </Link>
          </nav>

          {/* Authentication Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {currentUser.displayName || currentUser.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-5 border-t border-gray-200">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/editor"
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Editor
            </Link>
            <div className="flex flex-col space-y-3 mt-3 pt-3 border-t border-gray-200">
              {currentUser ? (
                <>
                  <span className="text-gray-600 py-2">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;