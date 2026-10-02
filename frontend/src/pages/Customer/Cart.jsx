import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";

function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
      .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      @keyframes shimmerSweep {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .skeleton {
        background: linear-gradient(
          100deg,
          rgba(11,61,58,0.07) 30%,
          rgba(11,61,58,0.14) 45%,
          rgba(11,61,58,0.07) 60%
        );
        background-size: 300% 100%;
        animation: shimmerSweep 1.6s ease-in-out infinite;
      }
    `}</style>
  );
}

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);

  const loadCart = async () => {
    try {
      const data = await getCart();

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);

      const message =
        error.response?.data?.message ||
        "Unable to load cart";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingItem(itemId);

      const data = await updateCartItem(itemId, quantity);

      if (data.success) {
        await loadCart();
      }
    } catch (error) {
      console.error("Failed to update cart:", error);

      const message =
        error.response?.data?.message ||
        "Unable to update quantity";

      toast.error(message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setUpdatingItem(itemId);

      const data = await removeCartItem(itemId);

      if (data.success) {
        await loadCart();
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);

      const message =
        error.response?.data?.message ||
        "Unable to remove item";

      toast.error(message);
    } finally {
      setUpdatingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
        <BrandStyles />

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center gap-3 mb-8">
            <div className="skeleton w-7 h-7 rounded-md" />
            <div className="skeleton h-7 w-48 rounded-md" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                >
                  <div className="skeleton w-full sm:w-32 h-32 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="skeleton h-3 w-20 rounded-md" />
                    <div className="skeleton h-5 w-2/3 rounded-md" />
                    <div className="skeleton h-3 w-full rounded-md" />
                    <div className="skeleton h-5 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="skeleton h-6 w-32 rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-10 w-full rounded-lg mt-4" />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F7EFE3] flex items-center justify-center px-6 font-body">
        <BrandStyles />

        <div className="text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#F3E4DC] text-[#C97B65] flex items-center justify-center">
            <FaShoppingCart className="text-3xl" />
          </div>

          <h1 className="font-display text-3xl font-bold text-[#0B3D3A] mt-6">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 mt-7 bg-[#C97B65] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B96A54] transition"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
      <BrandStyles />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">

          <FaShoppingCart className="text-[#C97B65] text-2xl" />

          <h1 className="font-display text-3xl font-bold text-[#0B3D3A]">
            Shopping Cart
          </h1>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {items.map((item) => {

              const product = item.product;

              const image =
                product.images?.length > 0
                  ? product.images[0]
                  : null;

              const itemTotal =
                Number(product.price) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                >

                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">

                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FaShoppingCart className="text-gray-300 text-3xl" />
                    )}

                  </div>

                  {/* Product Details */}
                  <div className="flex-1">

                    <p className="text-sm text-[#C97B65] font-medium">
                      {product.category?.name || "Product"}
                    </p>

                    <h2 className="font-display text-xl font-bold text-[#0B3D3A] mt-1">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <p className="text-lg font-bold text-[#0B3D3A] mt-3">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>

                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">

                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                      <button
                        type="button"
                        disabled={
                          updatingItem === item.id ||
                          item.quantity <= 1
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="w-10 text-center font-semibold">
                        {updatingItem === item.id ? (
                          <FaSpinner className="animate-spin mx-auto text-[#C97B65]" />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <button
                        type="button"
                        disabled={
                          updatingItem === item.id ||
                          item.quantity >= product.stock
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FaPlus size={12} />
                      </button>

                    </div>

                    <div className="flex items-center gap-5">

                      <span className="font-bold text-[#0B3D3A]">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        disabled={updatingItem === item.id}
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-40"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">

              <h2 className="font-display text-xl font-bold text-[#0B3D3A]">
                Order Summary
              </h2>

              <div className="border-t border-gray-200 mt-5 pt-5">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 mt-3">
                  <span>Delivery</span>

                  <span className="text-green-600 font-medium">
                    Free
                  </span>
                </div>

              </div>

              <div className="border-t border-gray-200 mt-5 pt-5 flex justify-between">

                <span className="text-lg font-bold text-[#0B3D3A]">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#0B3D3A]">
                  ₹{total.toLocaleString("en-IN")}
                </span>

              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full flex items-center justify-center bg-[#C97B65] text-white py-3 rounded-lg font-bold hover:bg-[#B96A54] transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="mt-4 w-full flex items-center justify-center gap-2 text-[#C97B65] font-semibold hover:text-[#B96A54]"
              >
                <FaArrowLeft size={13} />
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;