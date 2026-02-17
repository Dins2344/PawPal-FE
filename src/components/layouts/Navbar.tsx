import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  user?: {
    name: string;
    role: "admin" | "user";
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-700">
          🐾 PawPal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Browse Pets
          </NavLink>

          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative">
              
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
              >
                {user.name}
                <span>▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-2">
                  
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                  )}

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 shadow-md">
          
          <NavLink
            to="/"
            className="block text-gray-600 hover:text-blue-600"
          >
            Browse Pets
          </NavLink>

          {!user && (
            <>
              <Link
                to="/login"
                className="block text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-white bg-blue-600 px-4 py-2 rounded-xl"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  My Dashboard
                </Link>
              )}

              <button className="block text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
