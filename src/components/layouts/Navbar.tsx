import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50 shadow-sm shadow-amber-100/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🐾</span>
          <span className="text-2xl font-bold bg-linear-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            PawPal
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-200 ${isActive ? "text-amber-600" : "text-gray-600 hover:text-amber-600"
              }`
            }
          >
            Browse Pets
          </NavLink>

          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200 font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-linear-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative">

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2.5 rounded-xl hover:bg-amber-100 transition-all duration-200 border border-amber-200/50 cursor-pointer"
              >
                <div className="w-7 h-7 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className={`text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl shadow-amber-100/50 py-2 border border-amber-100/50 animate-in fade-in zoom-in duration-200">

                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🛡️</span> Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>📊</span> My Dashboard
                    </Link>
                  )}

                  <div className="mx-3 my-1 h-px bg-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 pb-5 pt-2 space-y-3 border-t border-amber-100/50 shadow-lg">

          <NavLink
            to="/"
            className="block py-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            🐾 Browse Pets
          </NavLink>

          {!user && (
            <>
              <Link
                to="/login"
                className="block py-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                🔑 Login
              </Link>

              <Link
                to="/register"
                className="block text-center text-white bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 rounded-xl font-semibold"
                onClick={() => setIsOpen(false)}
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
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  🛡️ Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  📊 My Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-600 font-medium cursor-pointer"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
