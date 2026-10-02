import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AdminLayout from "../components/Admin/AdminLayout";
import Sellers from "../pages/Admin/Sellers";
import Customers from "../pages/Admin/Customers";
import Profile from "../pages/Customer/Profile";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";
import Payments from "../pages/Admin/Payments";
import Analytics from "../pages/Admin/Analytics";
import Categories from "../pages/Admin/Categories";


import Home from "../pages/Customer/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Products from "../pages/Customer/Products";
import ProductDetails from "../pages/Customer/ProductDetails";
import Cart from "../pages/Customer/Cart";
import Checkout from "../pages/Customer/Checkout";
import Orders from "../pages/Customer/Orders";

import AdminDashboard from "../pages/Admin/Dashboard";
import SellerDashboard from "../pages/Seller/Dashboard";
import SellerRegister from "../pages/Seller/Register";
import SellerLayout from "../components/Seller/SellerLayout";
import SellerProducts from "../pages/Seller/Products";
import AddProduct from "../pages/Seller/AddProduct";
import EditProduct from "../pages/Seller/EditProduct";
import SellerOrders from "../pages/Seller/Orders";
import SellerOrderDetails from "../pages/Seller/OrderDetails";
import StoreProfile from "../pages/Seller/StoreProfile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller/register" element={<SellerRegister />} />

        {/* Authenticated Customer Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <MainLayout>
                <Checkout />
              </MainLayout>
            }
          />

          <Route
            path="/orders"
            element={
              <MainLayout>
                <Orders />
              </MainLayout>
            }
          />

        </Route>

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/sellers"
            element={
              <AdminLayout>
                <Sellers />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <AdminLayout>
                <Payments />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminLayout>
                <Categories />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/customers"
            element={
              <AdminLayout>
                <Customers />
              </AdminLayout>
            }
          />

        </Route>


        {/* Seller Routes */}
        <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
          <Route
            path="/seller"
            element={
              <SellerLayout>
                <SellerDashboard />
              </SellerLayout>
            }
          />

          <Route
            path="/seller/products"
            element={
              <SellerLayout>
                <SellerProducts />
              </SellerLayout>
            }
          />

          <Route
            path="/seller/products/add"
            element={
              <SellerLayout>
                <AddProduct />
              </SellerLayout>
            }
          />
          <Route
            path="/seller/products/edit/:id"
            element={<EditProduct />}
          />
          <Route
            path="/seller/orders"
            element={
              <SellerLayout>
                <SellerOrders />
              </SellerLayout>
            }
          />
          <Route
            path="/seller/orders/:id"
            element={
              <SellerLayout>
                <SellerOrderDetails />
              </SellerLayout>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <SellerLayout>
                <StoreProfile />
              </SellerLayout>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;