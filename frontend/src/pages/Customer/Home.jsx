import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";
import RecentlyViewed from "../../components/Customer/RecentlyViewed";
import RecommendedForYou from "../../components/Customer/RecommendedForYou";
import PersonalizedProducts from "../../components/Customer/PersonalizedProducts";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Page-wide cursor glow
  const [pageSpot, setPageSpot] = useState({ x: 50, y: 20 });

  const handlePageMouseMove = (e) => {
    setPageSpot({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  // ================= CATEGORIES =================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Unable to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // ================= PRODUCTS =================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({
          sort: "newest",
          limit: 12,
        });

        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Unable to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div
      onMouseMove={handlePageMouseMove}
      className="relative overflow-hidden bg-[#F7EFE3] font-[Jakarta]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .font-display {
          font-family: 'Baloo 2', system-ui, sans-serif;
        }

        .font-body {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        @keyframes riseIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rise-in {
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .dot-grid {
          background-image: radial-gradient(
            rgba(11, 61, 58, 0.12) 1px,
            transparent 1px
          );

          background-size: 24px 24px;
        }

        /* Shimmer skeleton loader */
        @keyframes shimmerSweep {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }

        .skeleton {
          background: linear-gradient(
            100deg,
            rgba(11, 61, 58, 0.07) 30%,
            rgba(11, 61, 58, 0.14) 45%,
            rgba(11, 61, 58, 0.07) 60%
          );

          background-size: 300% 100%;
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%,
          80%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }

          40% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .pulse-dot {
          animation: pulseDot 1.1s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Base texture */}
        <div className="absolute inset-0 dot-grid opacity-[0.3]" />

        {/* Large soft color fields */}
        <div
          className="absolute -left-32 -top-40 h-[36rem] w-[36rem] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg,#C97B65,#D9A85B)",
            opacity: 0.16,
          }}
        />

        <div
          className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg,#145C52,#0B3D3A)",
            opacity: 0.14,
          }}
        />

        <div
          className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg,#D9A85B,#C97B65)",
            opacity: 0.14,
          }}
        />

        {/* Cursor glow */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              560px circle at ${pageSpot.x}% ${pageSpot.y}%,
              rgba(201,123,101,0.10),
              transparent 70%
            )`,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,61,58,0.05) 0%, transparent 12%, transparent 88%, rgba(11,61,58,0.06) 100%)",
          }}
        />
      </div>

      <div className="relative z-10">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="rounded-b-[2.5rem] text-white shadow-xl shadow-black/10 md:rounded-b-[3.5rem]"
          style={{
            background:
              "radial-gradient(120% 140% at 10% 0%, #145C52 0%, #0B3D3A 55%, #082B28 100%)",
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">

            <div className="rise-in max-w-3xl">

              <p className="font-body mb-4 text-sm font-bold uppercase tracking-wider text-[#E0BE7E]">
                Smart Shopping Starts Here
              </p>

              <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
                Discover Products
                <br />
                You'll Love
              </h1>

              <p className="font-body mt-6 max-w-2xl text-lg text-[#BFEDE4] md:text-xl">
                Explore products from multiple sellers and discover smarter
                recommendations designed around your shopping needs.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#C97B65] px-6 py-3 font-body font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-[#B96A54] active:scale-[0.98]"
                >
                  Shop Now
                  <FaArrowRight />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 rounded-xl border-2 border-white/60 px-6 py-3 font-body font-semibold transition hover:bg-white/10"
                >
                  <FaShoppingBag />
                  Browse Products
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORIES
        ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="font-body text-sm font-bold uppercase tracking-wide text-[#C97B65]">
                Explore
              </p>

              <h2 className="font-display mt-1 text-3xl font-bold text-[#0B3D3A]">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 font-body font-semibold text-[#0B3D3A] transition hover:text-[#C97B65] sm:flex"
            >
              View All
              <FaArrowRight size={14} />
            </Link>

          </div>

          {/* Category Loading */}
          {loadingCategories ? (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">

              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white bg-white/90 p-4 shadow-md sm:p-5 md:p-6"
                >
                  <div className="skeleton mb-4 h-10 w-10 rounded-xl sm:h-12 sm:w-12" />

                  <div className="skeleton mb-3 h-4 w-2/3 rounded-md" />

                  <div className="skeleton h-3 w-full rounded-md" />
                </div>
              ))}

            </div>

          ) : categories.length === 0 ? (

            <div className="rounded-2xl border border-white bg-white/80 p-8 text-center font-body text-gray-500 shadow-sm backdrop-blur-sm">
              No categories available yet.
            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">

              {categories.map((category) => (

                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group rounded-2xl border border-white bg-white/90 p-4 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-5 md:p-6"
                >

                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md sm:mb-4 sm:h-12 sm:w-12"
                    style={{
                      background:
                        "linear-gradient(160deg, #D9A85B 0%, #C97B65 100%)",
                    }}
                  >
                    <FaShoppingBag />
                  </div>

                  <h3 className="font-display text-base font-bold text-[#0B3D3A] transition group-hover:text-[#C97B65] sm:text-lg">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="font-body mt-2 line-clamp-2 text-xs text-gray-500 sm:text-sm">
                      {category.description}
                    </p>
                  )}

                </Link>

              ))}

            </div>

          )}

        </section>

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        <section className="relative py-12 sm:py-16">

          {/* Background panel */}
          <div className="absolute inset-0 border-y border-white bg-white/70 backdrop-blur-sm" />

          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6">

            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between sm:mb-8">

              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wide text-[#C97B65] sm:text-sm">
                  Fresh Arrivals
                </p>

                <h2 className="font-display mt-1 text-2xl font-bold text-[#0B3D3A] sm:text-3xl">
                  Latest Products
                </h2>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 font-body font-semibold text-[#0B3D3A] transition hover:text-[#C97B65] sm:flex"
              >
                View All
                <FaArrowRight size={14} />
              </Link>

            </div>

            {/* =================================================
                LOADING SKELETON
            ================================================== */}

            {loadingProducts ? (

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6 xl:gap-6">

                {Array.from({ length: 12 }).map((_, i) => (

                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                  >

                    <div className="skeleton h-40 border-b border-gray-100 sm:h-44 md:h-48 lg:h-52 xl:h-56" />

                    <div className="p-3 sm:p-4">

                      <div className="skeleton mb-2 h-3 w-1/3 rounded-md" />

                      <div className="skeleton mb-3 h-4 w-3/4 rounded-md" />

                      <div className="skeleton mb-2 h-3 w-full rounded-md" />

                      <div className="skeleton mb-3 h-3 w-2/3 rounded-md" />

                      <div className="flex items-center justify-between">

                        <div className="skeleton h-5 w-16 rounded-md" />

                        <div className="skeleton h-4 w-10 rounded-md" />

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            ) : products.length === 0 ? (

              <div className="rounded-2xl bg-[#F7EFE3] p-10 text-center font-body text-gray-500">
                No products available yet.
              </div>

            ) : (

              /* =================================================
                 RESPONSIVE PRODUCT GRID

                 Mobile       = 2
                 Small         = 3
                 Tablet        = 4
                 Large         = 5
                 Desktop       = 6
              ================================================== */

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6 xl:gap-6">

                {products.slice(0, 12).map((product) => (

                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* ================= PRODUCT IMAGE ================= */}

                    <div className="flex h-40 items-center justify-center overflow-hidden border-b border-gray-100 bg-[#F7EFE3] p-3 sm:h-44 sm:p-4 md:h-48 lg:h-52 xl:h-56">

                      {product.images?.length > 0 ? (

                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />

                      ) : (

                        <FaShoppingBag className="text-4xl text-gray-300 sm:text-5xl" />

                      )}

                    </div>

                    {/* ================= PRODUCT INFORMATION ================= */}

                    <div className="p-3 sm:p-4">

                      {/* Category */}
                      <p className="font-body mb-1 line-clamp-1 text-xs font-semibold text-[#C97B65] sm:text-sm">
                        {product.category?.name || "Product"}
                      </p>

                      {/* Product Name */}
                      <h3 className="font-display line-clamp-2 text-sm font-bold leading-snug text-[#0B3D3A] sm:text-base">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="font-body mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                        {product.description}
                      </p>

                      {/* Price + View */}
                      <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">

                        <span className="font-display text-base font-bold text-[#0B3D3A] sm:text-lg">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>

                        <span className="shrink-0 font-body text-xs font-semibold text-[#C97B65] sm:text-sm">
                          View →
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* =====================================================
            RECENTLY VIEWED
        ====================================================== */}
        
        <RecentlyViewed />

        {/* =====================================================
            PERSONALIZED PRODUCTS
        ====================================================== */}

        <PersonalizedProducts />

        {/* =====================================================
            RECOMMENDED FOR YOU
        ====================================================== */}
        
        <RecommendedForYou />

        {/* =====================================================
            AI SECTION
        ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">

          <div
            className="rounded-[2rem] p-8 text-white shadow-xl shadow-black/10 md:p-12"
            style={{
              background:
                "linear-gradient(120deg, #0B3D3A 0%, #145C52 55%, #8A5142 140%)",
            }}
          >

            <div className="max-w-3xl">

              <p className="font-body text-sm font-bold uppercase tracking-wider text-[#E0BE7E]">
                AI Powered
              </p>

              <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
                Personalized Recommendations
              </h2>

              <p className="font-body mt-4 text-lg text-[#BFEDE4]">
                SmartStore will learn from your shopping activity and help
                you discover products that match your interests.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-body font-bold text-[#0B3D3A] transition-all hover:bg-gray-100 active:scale-[0.98]"
              >
                Explore Products
                <FaArrowRight />
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Home;