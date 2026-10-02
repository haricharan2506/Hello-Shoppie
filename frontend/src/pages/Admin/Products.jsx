import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaBoxOpen,
  FaStore,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import { getAllProducts } from "../../services/adminService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getAllProducts();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("PRODUCTS PAGE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const inStockCount = products.filter(
    (product) => Number(product.stock) > 0
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0
  ).length;

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Product Management
          </h1>

          <p className="mt-2 text-gray-600">
            View all products listed by sellers on the platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          {/* Total Products */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaBoxOpen />
            </div>

            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : products.length}
            </p>
          </div>

          {/* In Stock */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaCheckCircle />
            </div>

            <p className="text-sm text-gray-500">
              In Stock
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : inStockCount}
            </p>
          </div>

          {/* Out of Stock */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B5B] text-white">
              <FaExclamationTriangle />
            </div>

            <p className="text-sm text-gray-500">
              Out of Stock
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : outOfStockCount}
            </p>
          </div>

        </div>

        {/* Product Table */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B3D3A]">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products currently available on the marketplace.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>
                  <tr className="border-b border-gray-200 text-left">

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Product
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Seller
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Category
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Price
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Stock
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 last:border-0"
                    >

                      {/* Product */}
                      <td className="px-4 py-4">

                        <div>
                          <p className="font-semibold text-[#0B3D3A]">
                            {product.name}
                          </p>

                          {product.description && (
                            <p className="mt-1 max-w-[280px] truncate text-xs text-gray-400">
                              {product.description}
                            </p>
                          )}
                        </div>

                      </td>

                      {/* Seller */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B3D3A] text-white">
                            <FaStore className="text-sm" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {product.seller?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {product.seller?.email || ""}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {product.category?.name ||
                          "Uncategorized"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-sm font-bold text-[#0B3D3A]">
                        ₹
                        {Number(product.price).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {product.stock}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">

                        {Number(product.stock) > 0 ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            In Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Out of Stock
                          </span>
                        )}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Products;