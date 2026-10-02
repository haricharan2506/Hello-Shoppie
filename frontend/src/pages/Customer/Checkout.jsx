import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getCart } from "../../services/cartService";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";

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

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    deliveryAddress: user?.address || "",
    deliveryCity: "",
    deliveryState: "",
    deliveryPincode: "",
  });

  useEffect(() => {
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
        setLoadingCart(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      customerName: user?.name || prev.customerName,
      customerPhone: user?.phone || prev.customerPhone,
      deliveryAddress: user?.address || prev.deliveryAddress,
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryPincode,
    } = formData;

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryAddress.trim() ||
      !deliveryCity.trim() ||
      !deliveryState.trim() ||
      !deliveryPincode.trim()
    ) {
      toast.error("Please fill in all delivery details");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return false;
    }

    if (!/^\d{6}$/.test(deliveryPincode)) {
      toast.error("Please enter a valid 6-digit PIN code");
      return false;
    }

    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setProcessingPayment(true);

      // 1. Load Razorpay
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        toast.error("Unable to load payment gateway");
        return;
      }

      // 2. Create Razorpay order
      const paymentData = await createPaymentOrder();

      if (!paymentData.success) {
        toast.error(
          paymentData.message || "Unable to create payment"
        );
        return;
      }

      const payment = paymentData.payment;

      // 3. Open Razorpay
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "SmartStore",
        description: "SmartStore Purchase",
        order_id: payment.orderId,

        prefill: {
          name: formData.customerName,
          email: user?.email || "",
          contact: formData.customerPhone,
        },

        theme: {
          color: "#C97B65",
        },

        handler: async function (response) {
          try {
            const verificationData = {
              customerName: formData.customerName,
              customerPhone: formData.customerPhone,
              deliveryAddress: formData.deliveryAddress,
              deliveryCity: formData.deliveryCity,
              deliveryState: formData.deliveryState,
              deliveryPincode: formData.deliveryPincode,

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            };

            const verifyData =
              await verifyPayment(verificationData);

            if (verifyData.success) {
              toast.success(
                "Payment successful! Order placed."
              );

              navigate("/orders");
            } else {
              toast.error(
                verifyData.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            const message =
              error.response?.data?.message ||
              "Payment verification failed";

            toast.error(message);
          } finally {
            setProcessingPayment(false);
          }
        },

        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          toast.error(
            response.error?.description ||
              "Payment failed"
          );

          setProcessingPayment(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to start payment:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to start payment";

      toast.error(message);
      setProcessingPayment(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
        <BrandStyles />

        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-8 space-y-3">
            <div className="skeleton h-4 w-28 rounded-md" />
            <div className="skeleton h-8 w-40 rounded-md" />
            <div className="skeleton h-4 w-72 rounded-md" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                <div className="skeleton h-5 w-48 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="skeleton h-5 w-36 rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-11 w-full rounded-lg mt-4" />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F7EFE3] flex items-center justify-center px-6 font-body">
        <BrandStyles />

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-[#0B3D3A]">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 bg-[#C97B65] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B96A54] transition"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
      <BrandStyles />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[#C97B65] font-semibold hover:text-[#B96A54] mb-4"
          >
            <FaArrowLeft size={13} />
            Back to Cart
          </Link>

          <h1 className="font-display text-3xl font-bold text-[#0B3D3A]">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your delivery details and complete your payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Delivery Form */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">
                <FaMapMarkerAlt className="text-[#C97B65]" />

                <h2 className="font-display text-xl font-bold text-[#0B3D3A]">
                  Delivery Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>

                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-[#C97B65]">
                    <FaUser className="text-gray-400" />

                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>

                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-[#C97B65]">
                    <FaPhone className="text-gray-400" />

                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className="w-full px-3 py-3 outline-none"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Required for delivery contact.
                  </p>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>

                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#C97B65] resize-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>

                  <input
                    type="text"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#C97B65]"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>

                  <input
                    type="text"
                    name="deliveryState"
                    value={formData.deliveryState}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#C97B65]"
                  />
                </div>

                {/* PIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code *
                  </label>

                  <input
                    type="text"
                    name="deliveryPincode"
                    value={formData.deliveryPincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#C97B65]"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Order Summary */}
          <div>

            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">

              <h2 className="font-display text-xl font-bold text-[#0B3D3A] mb-5">
                Order Summary
              </h2>

              <div className="space-y-4">

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0B3D3A] line-clamp-1">
                        {item.product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="font-semibold text-[#0B3D3A]">
                      ₹
                      {(
                        Number(item.product.price) *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

              </div>

              <div className="border-t border-gray-200 mt-6 pt-5">

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

              <button
                type="button"
                onClick={handlePayment}
                disabled={processingPayment}
                className="mt-6 w-full flex items-center justify-center gap-3 bg-[#C97B65] text-white py-3 rounded-lg font-bold hover:bg-[#B96A54] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment will be securely processed by Razorpay.
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;