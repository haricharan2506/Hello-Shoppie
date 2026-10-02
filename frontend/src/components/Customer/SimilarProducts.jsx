import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSimilarProducts } from "../../services/recommendationService";

function SimilarProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await getSimilarProducts(productId);

        // Handle either { success, products } or a raw array response,
        // so a shape mismatch doesn't silently hide the section.
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (response?.success) {
          setProducts(response.products || []);
        } else {
          console.warn(
            "getSimilarProducts returned an unexpected shape:",
            response
          );
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Failed to load similar products:",
          error
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilarProducts();
  }, [productId]);

  // Don't show anything when there are no similar products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#C97B65] sm:text-sm">
          You May Also Like
        </p>

        <h2 className="text-2xl font-extrabold text-[#0B3D3A] sm:text-3xl">
          Similar Products
        </h2>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          More products you might be interested in
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="h-48 animate-pulse bg-gray-200" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">

          {products.map((item) => (
            <Link
              key={item.id}
              to={`/products/${item.id}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Image */}
              <div className="flex h-48 items-center justify-center overflow-hidden bg-[#F7EFE3] p-4">
                {item.images?.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">

                {/* Category */}
                <p className="mb-1 text-xs font-semibold text-[#C97B65]">
                  {item.category?.name || "Product"}
                </p>

                {/* Name */}
                <h3 className="line-clamp-2 min-h-[48px] text-sm font-bold text-[#0B3D3A]">
                  {item.name}
                </h3>

                {/* Price */}
                <p className="mt-3 text-lg font-extrabold text-[#0B3D3A]">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

              </div>
            </Link>
          ))}

        </div>
      )}
    </section>
  );
}

export default SimilarProducts;