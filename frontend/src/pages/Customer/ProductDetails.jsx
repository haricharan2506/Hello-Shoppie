import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { recordProductView } from "../../services/recommendationService";
import SimilarProducts from "../../components/Customer/SimilarProducts";

import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";

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

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageViewer, setShowImageViewer] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await getProductById(id);

        if (data.success) {
          setProduct(data.product);

          // Record product as recently viewed
          try {
            await recordProductView(id);
          } catch (error) {
            // Recommendation tracking should never break
            // the product details page.
            console.error(
              "Failed to record product view:",
              error
            );
          }
        } else {
          toast.error(data.message || "Product not found");
        }
      } catch (error) {
        console.error("Failed to load product:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7EFE3] font-body">
        <BrandStyles />

        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="skeleton h-4 w-20 rounded-md" />
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              <div className="p-6 md:p-10">
                <div className="skeleton h-[450px] rounded-xl" />
                <div className="flex gap-3 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton w-20 h-20 rounded-lg flex-shrink-0" />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-5">
                <div className="skeleton h-6 w-28 rounded-full" />
                <div className="skeleton h-9 w-3/4 rounded-md" />
                <div className="skeleton h-9 w-40 rounded-md" />
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-4 w-2/3 rounded-md" />
                </div>
                <div className="skeleton h-14 w-full rounded-xl mt-6" />
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // ================= PRODUCT NOT FOUND =================

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7EFE3] flex items-center justify-center px-6 font-body">
        <BrandStyles />

        <div className="text-center">

          <FaTimesCircle className="mx-auto text-red-400 text-6xl" />

          <h1 className="font-display text-3xl font-bold text-[#0B3D3A] mt-5">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The product you're looking for doesn't exist.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#C97B65] text-white rounded-lg font-semibold hover:bg-[#B96A54] transition"
          >
            <FaArrowLeft />
            Back to Products
          </Link>

        </div>
      </div>
    );
  }

  const images = product.images || [];

  const stock = Number(product.stock ?? 0);

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((previous) => previous + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);

      const message =
        error.response?.data?.message ||
        "Unable to add product to cart. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7EFE3] font-body">
      <BrandStyles />

      {/* ================= BACK ================= */}

      <div className="max-w-7xl mx-auto px-6 pt-6">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C97B65] font-medium transition"
        >
          <FaArrowLeft />
          Back
        </button>

      </div>

      {/* ================= PRODUCT ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ================= IMAGE GALLERY ================= */}

            <div className="p-6 md:p-10">

              {/* Main Image */}

              <div className="relative h-[450px] bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden group">

                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    onClick={() => setShowImageViewer(true)}
                    className="w-full h-full object-contain p-6 cursor-zoom-in transition duration-300"
                  />
                ) : (
                  <div className="text-gray-300 text-center">
                    <FaShoppingCart className="mx-auto text-7xl" />

                    <p className="mt-3">
                      No image available
                    </p>
                  </div>
                )}

                {/* Previous Button */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === 0
                          ? images.length - 1
                          : selectedImage - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               w-11 h-11 rounded-full
                               bg-white/95 shadow-lg
                               flex items-center justify-center
                               text-gray-700
                               hover:bg-[#C97B65] hover:text-white
                               transition
                               opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <FaArrowLeft />
                  </button>
                )}

                {/* Next Button */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === images.length - 1
                          ? 0
                          : selectedImage + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               w-11 h-11 rounded-full
                               bg-white/95 shadow-lg
                               flex items-center justify-center
                               text-gray-700
                               hover:bg-[#C97B65] hover:text-white
                               transition
                               opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <FaArrowRight />
                  </button>
                )}

                {/* Image Counter */}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                                  bg-black/70 text-white
                                  px-3 py-1 rounded-full
                                  text-sm font-medium">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}

              </div>


              {/* Thumbnail Navigation */}

              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-4">

                  {/* Thumbnail Left */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === 0
                          ? images.length - 1
                          : selectedImage - 1
                      )
                    }
                    className="flex-shrink-0 w-9 h-9 rounded-full
                               border border-gray-200
                               flex items-center justify-center
                               hover:border-[#C97B65]
                               hover:text-[#C97B65]
                               transition"
                  >
                    <FaArrowLeft size={13} />
                  </button>


                  {/* Thumbnails */}

                  <div className="flex gap-3 overflow-x-auto pb-2 flex-1">

                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 flex-shrink-0 rounded-lg
                                    overflow-hidden border-2 transition
                                    ${
                                      selectedImage === index
                                        ? "border-[#C97B65] shadow-sm"
                                        : "border-gray-200 hover:border-[#D9A85B]"
                                    }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}

                  </div>


                  {/* Thumbnail Right */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === images.length - 1
                          ? 0
                          : selectedImage + 1
                      )
                    }
                    className="flex-shrink-0 w-9 h-9 rounded-full
                               border border-gray-200
                               flex items-center justify-center
                               hover:border-[#C97B65]
                               hover:text-[#C97B65]
                               transition"
                  >
                    <FaArrowRight size={13} />
                  </button>

                </div>
              )}

            </div>

            {/* ================= PRODUCT INFORMATION ================= */}

            <div className="p-6 md:p-10 flex flex-col">

              {/* Category */}

              <div>

                <span className="inline-block px-3 py-1 bg-[#F3E4DC] text-[#B96A54] text-sm font-semibold rounded-full">
                  {product.category?.name || "Product"}
                </span>

              </div>

              {/* Name */}

              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#0B3D3A] mt-4">
                {product.name}
              </h1>

              {/* Price */}

              <div className="mt-6">

                <span className="text-4xl font-extrabold text-[#0B3D3A]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>

              </div>

              {/* Description */}

              <div className="mt-6">

                <h2 className="font-display text-lg font-bold text-[#0B3D3A]">
                  Description
                </h2>

                <p className="text-gray-600 mt-2 leading-relaxed">
                  {product.description}
                </p>

              </div>

              {/* Seller */}

              {product.seller && (
                <div className="mt-6 p-4 bg-[#F3E4DC] rounded-xl">

                  <p className="text-sm text-gray-500">
                    Sold by
                  </p>

                  <p className="font-bold text-[#0B3D3A] mt-1">
                    {product.seller.name || "Seller"}
                  </p>

                </div>
              )}

              {/* Stock */}

              <div className="mt-6">

                {stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <FaCheckCircle />
                    In Stock ({stock} available)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <FaTimesCircle />
                    Out of Stock
                  </div>
                )}

              </div>

              {/* Quantity */}

              {stock > 0 && (
                <div className="mt-6">

                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </p>

                  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="w-14 text-center font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <FaPlus size={12} />
                    </button>

                  </div>

                </div>
              )}

              {/* Add To Cart */}

              <div className="mt-8">

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C97B65] text-white rounded-xl font-bold text-lg hover:bg-[#B96A54] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <FaShoppingCart />
                  {stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>
            {/* ================= FULL SCREEN IMAGE VIEWER ================= */}

            {showImageViewer && images.length > 0 && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setShowImageViewer(false)}
              >

                {/* Close Button */}

                <button
                  type="button"
                  onClick={() => setShowImageViewer(false)}
                  className="absolute top-5 right-5 z-50
                            w-11 h-11 rounded-full
                            bg-white/10 text-white
                            flex items-center justify-center
                            hover:bg-white/20
                            transition text-2xl"
                  aria-label="Close image viewer"
                >
                  ×
                </button>


                {/* Previous Image */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedImage(
                        selectedImage === 0
                          ? images.length - 1
                          : selectedImage - 1
                      );
                    }}
                    className="absolute left-5 top-1/2 -translate-y-1/2
                              z-50
                              w-12 h-12 rounded-full
                              bg-white/10 text-white
                              flex items-center justify-center
                              hover:bg-white/20
                              transition"
                    aria-label="Previous image"
                  >
                    <FaArrowLeft />
                  </button>
                )}


                {/* Large Image */}

                <div
                  className="max-w-6xl max-h-[90vh] w-full h-full
                            flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >

                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />

                </div>


                {/* Next Image */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedImage(
                        selectedImage === images.length - 1
                          ? 0
                          : selectedImage + 1
                      );
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2
                              z-50
                              w-12 h-12 rounded-full
                              bg-white/10 text-white
                              flex items-center justify-center
                              hover:bg-white/20
                              transition"
                    aria-label="Next image"
                  >
                    <FaArrowRight />
                  </button>
                )}


                {/* Image Counter */}

                {images.length > 1 && (
                  <div
                    className="absolute bottom-6 left-1/2
                              -translate-x-1/2
                              bg-black/60 text-white
                              px-4 py-2 rounded-full
                              text-sm font-medium"
                  >
                    {selectedImage + 1} / {images.length}
                  </div>
                )}

              </div>
              
            )}

      <SimilarProducts productId={product.id} />
            
    </div>
  );
}

export default ProductDetails;