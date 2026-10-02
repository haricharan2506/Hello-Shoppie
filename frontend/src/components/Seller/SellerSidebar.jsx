import {
  FaHome,
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function SellerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      label: "Dashboard",
      path: "/seller",
      icon: <FaTachometerAlt />,
    },
    {
      label: "My Products",
      path: "/seller/products",
      icon: <FaBoxOpen />,
    },
    {
      label: "Add Product",
      path: "/seller/products/add",
      icon: <FaPlus />,
    },
    {
      label: "Orders",
      path: "/seller/orders",
      icon: <FaShoppingBag />,
    },
    {
      label: "Store Profile",
      path: "/seller/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#0B3D3A] text-white">

      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-extrabold">
          Shoppie
        </h1>

        <p className="mt-1 text-sm text-white/60">
          Seller Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Store Management
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-[#0B3D3A]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SellerSidebar;