import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaTags,
  FaCreditCard,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: FaHome,
    },
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaTachometerAlt,
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
      icon: FaStore,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: FaUsers,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FaBoxOpen,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FaTags,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FaShoppingCart,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: FaCreditCard,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: FaChartBar,
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#0B3D3A] text-white">

      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-extrabold">
          Shoppie
        </h1>

        <p className="mt-1 text-sm text-white/60">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Management
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-[#0B3D3A] shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default AdminSidebar;