import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .font-display {
        font-family: 'Baloo 2', system-ui, sans-serif;
      }

      .font-body {
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      }

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

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "newest"
  );

  const currentPage = Number(searchParams.get("page")) || 1;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // ================= LOAD CATEGORIES =================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (data.success) {
          setCategories(data.categories || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Unable to load categories");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // ================= SYNC FILTERS WITH URL =================

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // ================= LOAD PRODUCTS =================

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      try {
        const params = {};

        params.page = currentPage;
        params.limit = 12;

        const urlSearch = searchParams.get("search") || "";
        const urlCategory = searchParams.get("category") || "";
        const urlMinPrice = searchParams.get("minPrice") || "";
        const urlMaxPrice = searchParams.get("maxPrice") || "";
        const urlSort = searchParams.get("sort") || "newest";

        if (urlSearch.trim()) {
          params.search = urlSearch.trim();
        }

        if (urlCategory) {
          params.category = urlCategory;
        }

        if (urlMinPrice !== "") {
          params.minPrice = urlMinPrice;
        }

        if (urlMaxPrice !== "") {
          params.maxPrice = urlMaxPrice;
        }

        if (urlSort) {
          params.sort = urlSort;
        }

        const data = await getProducts(params);

        if (data.success) {
          setProducts(data.products || []);

          setPagination({
            currentPage: data.currentPage || currentPage,
            totalPages: data.totalPages || 1,
            totalProducts: data.totalProducts || 0,
          });
        } else {
          setProducts([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
          });
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Unable to load products");
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  // ================= APPLY FILTERS =================

  const handleApplyFilters = (e) => {
    e.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    if (minPrice !== "") {
      params.minPrice = minPrice;
    }

    if (maxPrice !== "") {
      params.maxPrice = maxPrice;
    }

    if (sort) {
      params.sort = sort;
    }

    params.page = 1;
    setSearchParams(params);
  };

  // ================= CLEAR FILTERS =================

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");

    setSearchParams({});
  };

  return (
    <div className="bg-[#F7EFE3] min-h-screen font-body">
      <BrandStyles />

      {/* ================= PAGE HEADER ================= */}

      <section
        className="text-white rounded-b-[2.5rem] md:rounded-b-[3rem] shadow-xl shadow-black/10"
        style={{
          background:
            "radial-gradient(120% 140% at 10% 0%, #145C52 0%, #0B3D3A 55%, #082B28 100%)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="font-body text-[#E0BE7E] font-bold uppercase tracking-wider text-sm">
            SmartStore
          </p>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2">
            All Products
          </h1>

          <p className="font-body text-[#BFEDE4] mt-4 max-w-2xl text-lg">
            Discover products from multiple sellers and find exactly
            what you're looking for.
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* ================= FILTER PANEL ================= */}

        <form
          onSubmit={handleApplyFilters}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8 md:mb-10"
        >
          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-[#F3E4DC] text-[#C97B65] flex items-center justify-center">
                <FaFilter />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-[#0B3D3A]">
                  Find Products
                </h2>

                <p className="text-sm text-gray-500">
                  Search and filter products
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium transition"
            >
              <FaTimes />
              Clear
            </button>

          </div>

          {/* Search + Filters */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Search */}

            <div className="sm:col-span-2 lg:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>

              <div className="relative">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C97B65] focus:border-transparent"
                />

              </div>

            </div>

            {/* Category */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C97B65]"
              >
                <option value="">
                  All Categories
                </option>

                {!loadingCategories &&
                  categories.map((item) => (
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>

            </div>

            {/* Minimum Price */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price
              </label>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₹0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C97B65]"
              />

            </div>

            {/* Maximum Price */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price
              </label>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₹999999"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C97B65]"
              />

            </div>

          </div>

          {/* Sort + Apply */}

          <div className="mt-5 flex flex-col sm:flex-row gap-4">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C97B65]"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>

            <button
              type="submit"
              className="px-8 py-3 bg-[#C97B65] text-white rounded-lg font-bold hover:bg-[#B96A54] transition"
            >
              Apply Filters
            </button>

          </div>

        </form>

        {/* ================= RESULTS HEADER ================= */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <p className="text-[#C97B65] font-semibold">
              Products
            </p>

            <h2 className="font-display text-2xl font-bold text-[#0B3D3A]">
              {pagination.totalProducts} Products Found
            </h2>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-6">

            {Array.from({ length: 12 }).map((_, i) => (

              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >

                <div className="h-40 border-b border-gray-100 skeleton sm:h-44 md:h-48 lg:h-52 xl:h-56" />

                <div className="p-4">

                  <div className="skeleton h-3 w-1/3 rounded-md mb-3" />

                  <div className="skeleton h-4 w-3/4 rounded-md mb-3" />

                  <div className="skeleton h-3 w-full rounded-md mb-2" />

                  <div className="skeleton h-3 w-2/3 rounded-md mb-4" />

                  <div className="flex items-center justify-between">

                    <div className="skeleton h-5 w-16 rounded-md" />

                    <div className="skeleton h-4 w-10 rounded-md" />

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : products.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="bg-white rounded-2xl p-12 md:p-16 text-center shadow-sm">

            <FaShoppingBag className="mx-auto text-gray-300 text-6xl" />

            <h3 className="font-display text-2xl font-bold text-[#0B3D3A] mt-5">
              No products found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={handleClearFilters}
              className="mt-6 px-6 py-3 bg-[#C97B65] text-white rounded-lg font-semibold hover:bg-[#B96A54] transition"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* ================= PRODUCT GRID ================= */

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6 xl:gap-6">

            {products.map((product) => (

              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group border border-gray-100"
              >

                {/* ================= IMAGE ================= */}

                <div className="flex h-40 items-center justify-center overflow-hidden border-b border-gray-100 bg-white p-3 sm:h-44 sm:p-4 md:h-48 lg:h-52 xl:h-56">

                  {product.images?.length > 0 ? (

                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />

                  ) : (

                    <FaShoppingBag className="text-gray-300 text-5xl" />

                  )}

                </div>

                {/* ================= PRODUCT INFORMATION ================= */}

                <div className="p-3 sm:p-4">

                  <p className="mb-1 line-clamp-1 text-xs font-medium text-[#C97B65] sm:text-sm">
                    {product.category?.name || "Product"}
                  </p>

                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0B3D3A] sm:text-base">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">

                    <span className="text-base font-bold text-[#0B3D3A] sm:text-lg">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>

                    <span className="shrink-0 text-xs font-semibold text-[#C97B65] sm:text-sm">
                      View →
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

          

        )}

        {/* ================= PAGINATION ================= */}

        {pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-10 pb-20">

            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">

              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: pagination.currentPage - 1,
                  });
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page,
                    });
                  }}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    page === pagination.currentPage
                      ? "bg-[#C97B65] text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  pagination.currentPage >= pagination.totalPages
                }
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: pagination.currentPage + 1,
                  });
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>

            </div>
          </div>
        )}

      </main>

      
    
    </div>
  );

}

export default Products;