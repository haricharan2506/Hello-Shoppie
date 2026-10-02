import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonalizedProducts } from "../../services/recommendationService";

function PersonalizedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPersonalizedProducts = async () => {
      try {
        const response = await getPersonalizedProducts();

        // Handle either { success, products } or a raw array response,
        // so a shape mismatch doesn't silently hide the section.
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (response?.success) {
          setProducts(response.products || []);
        } else {
          console.warn(
            "getPersonalizedProducts returned an unexpected shape:",
            response
          );
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Failed to load personalized products:",
          error
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPersonalizedProducts();
  }, []);

  // Don't show an empty section
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Inter:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .font-display {
          font-family: 'Baloo 2', sans-serif;
        }
        .font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes shimmerSweep {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .pp-skeleton {
          background: linear-gradient(
            110deg,
            rgba(20, 92, 82, 0.06) 8%,
            rgba(20, 92, 82, 0.14) 18%,
            rgba(20, 92, 82, 0.06) 33%
          );
          background-size: 800px 100%;
          animation: shimmerSweep 1.6s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#C97B65] sm:text-sm">
            Just For You
          </p>

          <h2 className="font-display text-2xl font-extrabold text-[#0B3D3A] sm:text-3xl">
            Personalized For You
          </h2>

          <p className="font-body mt-1 text-sm text-gray-500 sm:text-base">
            Products selected based on your shopping activity
          </p>
        </div>
      </div>

      {/* Products */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          sm:gap-4
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="pp-skeleton aspect-square" />
                <div className="space-y-2 p-3 sm:p-4">
                  <div className="pp-skeleton h-3 w-1/3 rounded" />
                  <div className="pp-skeleton h-4 w-4/5 rounded" />
                  <div className="pp-skeleton h-4 w-2/5 rounded" />
                </div>
              </div>
            ))
          : products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => navigate(`/products/${product.id}`)}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  text-left
                  shadow-sm
                  transition
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-[#FFF3E6]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-contain
                        p-3
                        transition
                        duration-300
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="font-body flex h-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4">
                  <p className="font-body mb-1 truncate text-xs font-medium text-[#C97B65] sm:text-sm">
                    {product.category?.name || "Product"}
                  </p>

                  <h3
                    className="
                      font-display
                      line-clamp-2
                      min-h-[40px]
                      text-sm
                      font-bold
                      text-[#0B3D3A]
                      sm:text-base
                    "
                  >
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-base font-extrabold text-[#0B3D3A] sm:text-lg">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>

                    <span className="font-body text-sm font-semibold text-[#C97B65]">
                      View →
                    </span>
                  </div>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}

export default PersonalizedProducts;