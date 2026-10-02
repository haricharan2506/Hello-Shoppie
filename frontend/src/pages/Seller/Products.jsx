import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../api/api";
import { deleteProduct } from "../../services/productService";


function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/seller");

      setProducts(response.data?.products || []);
    } catch (error) {
      console.error("SELLER PRODUCTS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);

      await deleteProduct(product.id);

      setProducts((prevProducts) =>
        prevProducts.filter(
          (item) => item.id !== product.id
        )
      );

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">
              My Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage the products you sell on Shoppie.
            </p>
          </div>

          <button
            onClick={() => navigate("/seller/products/add")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0B3D3A] px-5 py-3 font-bold text-white shadow-md transition hover:bg-[#145C52]"
          >
            <FaPlus />
            Add Product
          </button>

        </div>

        {/* Product count */}
        {!loading && (
          <div className="mb-5 text-sm font-semibold text-gray-600">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <p className="font-semibold text-gray-500">
              Loading your products...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B3D3A] text-white">
              <FaBoxOpen size={26} />
            </div>

            <h2 className="font-display mt-5 text-2xl font-bold text-[#0B3D3A]">
              No products yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You haven't added any products to your store yet.
              Add your first product to start selling.
            </p>

            <button
              onClick={() => navigate("/seller/products/add")}
              className="mt-6 rounded-xl bg-[#C97B65] px-6 py-3 font-bold text-white transition hover:bg-[#B96A54]"
            >
              Add Your First Product
            </button>

          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">

                <thead className="bg-[#0B3D3A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-[#F7EFE3]"
                    >

                      {/* Product */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gray-100">

                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FaBoxOpen className="text-gray-400" />
                            )}

                          </div>

                          <div>
                            <p className="font-bold text-[#0B3D3A]">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {product.description || "No description"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {product.category?.name || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5 text-sm font-bold text-[#0B3D3A]">
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/seller/products/edit/${product.id}`
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B3D3A] text-white transition hover:bg-[#145C52]"
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product)
                            }
                            disabled={deletingId === product.id}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C97B65] text-white transition hover:bg-[#B96A54] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete product"
                          >
                            {deletingId === product.id ? (
                              "..."
                            ) : (
                              <FaTrash />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Products;