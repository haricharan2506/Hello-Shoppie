import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaSignOutAlt,
  FaClipboardList,
  FaTachometerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
      .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

      /* ===== Logo animation: bouncing ball + squash & stretch letters ===== */

      @keyframes ballTravel {
        0%   { left: 0; opacity: 1; }
        92%  { opacity: 1; }
        100% { left: calc(100% - 14px); opacity: 0; }
      }

      @keyframes ballHop {
        0%   { transform: translateY(0) scale(1.35, 0.6);      animation-timing-function: ease-out; }
        20%  { transform: translateY(-22px) scale(0.85, 1.2);  animation-timing-function: ease-out; }
        50%  { transform: translateY(-34px) scale(1, 1);       animation-timing-function: ease-in; }
        80%  { transform: translateY(-12px) scale(0.9, 1.15);  animation-timing-function: ease-in; }
        100% { transform: translateY(0) scale(1.35, 0.6); }
      }

      @keyframes letterDrop {
        0%   { opacity: 0; transform: translateY(-26px) scale(0.8, 1.3); }
        45%  { opacity: 1; transform: translateY(0) scale(1.25, 0.7); }
        70%  { transform: translateY(-6px) scale(0.92, 1.1); }
        100% { opacity: 1; transform: translateY(0) scale(1, 1); }
      }

      @keyframes logoShimmer {
        0%   { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      .logo-link {
        display: inline-block;
        transition: transform 0.25s ease;
      }

      .logo-link:hover {
        transform: scale(1.04);
      }

      .logo-title {
        position: relative;
        display: inline-block;
        white-space: nowrap;
      }

      .logo-letter {
        display: inline-block;
        transform-origin: bottom center;
        background: linear-gradient(90deg, #0B3D3A 0%, #C97B65 50%, #0B3D3A 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation:
          letterDrop 0.55s cubic-bezier(0.3, 0.7, 0.4, 1) backwards,
          logoShimmer 3s linear infinite;
        animation-delay:
          calc(var(--i) * 0.11s),
          calc(var(--i) * -0.12s);
      }

      .logo-ball-track {
        position: absolute;
        left: 0;
        bottom: -3px;
        width: 14px;
        height: 14px;
        z-index: 2;
        pointer-events: none;
        animation: ballTravel 1.7s linear both;
      }

      .logo-ball {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 30%, #E9A48F, #C97B65 60%, #A85E4A);
        box-shadow: 0 2px 4px rgba(11, 61, 58, 0.25);
        transform-origin: bottom center;
        animation: ballHop 0.425s 4 both;
      }

      @media (prefers-reduced-motion: reduce) {
        .logo-letter { animation: none; background: none; -webkit-text-fill-color: #0B3D3A; color: #0B3D3A; }
        .logo-ball-track { display: none; }
      }
    `}</style>
  );
}

const LOGO_TEXT = "Hello, Shoppie!";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-body">
      <BrandStyles />

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="logo-link font-display text-3xl font-bold text-[#0B3D3A] leading-none"
        >
          <span className="logo-title" aria-label={LOGO_TEXT}>
            <span className="logo-ball-track" aria-hidden="true">
              <span className="logo-ball" />
            </span>

            {LOGO_TEXT.split("").map((char, i) => (
              <span
                key={i}
                className="logo-letter"
                style={{ "--i": i }}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="block font-body text-xs font-medium text-gray-500 mt-1">
            Your smarter way to shop
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-[#F7EFE3] rounded-lg px-3 py-2 w-96 border border-transparent focus-within:border-[#C97B65]/40 transition"
        >
          <FaSearch className="text-[#0B3D3A]/50" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent outline-none px-2 w-full text-[#0B3D3A] placeholder:text-gray-400"
          />
        </form>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-[#0B3D3A] hover:text-[#C97B65] font-medium transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-[#0B3D3A] hover:text-[#C97B65] font-medium transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-[#0B3D3A] hover:text-[#C97B65] font-medium transition"
          >
            <FaShoppingCart />
            Cart
          </Link>

          {isAuthenticated ? (
            <div className="relative group">

              {/* User Button */}
              <button className="flex items-center gap-2 text-[#0B3D3A] font-medium">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-[#C97B65] text-xl" />
                )}
                <span>{user?.name}</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">

                {/* Customer */}
                {(user?.role === "CUSTOMER" || user?.role === "SELLER") && (
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-[#0B3D3A] hover:bg-[#F7EFE3]"
                  >
                    <FaClipboardList className="text-[#C97B65]" />
                    My Orders
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-[#0B3D3A] hover:bg-[#F7EFE3]"
                >
                  <FaUserCircle className="text-[#C97B65]" />
                  My Profile
                </Link>

                {/* Seller */}
                {user?.role === "SELLER" && (
                  <Link
                    to="/seller"
                    className="flex items-center gap-3 px-4 py-3 text-[#0B3D3A] hover:bg-[#F7EFE3]"
                  >
                    <FaTachometerAlt className="text-[#C97B65]" />
                    Seller Dashboard
                  </Link>
                )}

                {/* Admin */}
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-[#0B3D3A] hover:bg-[#F7EFE3]"
                  >
                    <FaTachometerAlt className="text-[#C97B65]" />
                    Admin Dashboard
                  </Link>
                )}

                <div className="border-t border-gray-100 my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>

              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#C97B65] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#B96A54] transition"
            >
              <FaUserCircle />
              Login
            </Link>
          )}

        </div>
      </nav>
    </header>
  );
}

export default Navbar;