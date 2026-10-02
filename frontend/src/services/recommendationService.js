import api from "../api/api";

// ============================================================
// RECORD PRODUCT VIEW
// ============================================================

export const recordProductView = async (productId) => {
  const response = await api.post(
    `/recommendations/view/${productId}`,
    {}
  );

  return response.data;
};

// ============================================================
// RECENTLY VIEWED PRODUCTS
// ============================================================

export const getRecentlyViewedProducts = async () => {
  const response = await api.get(
    "/recommendations/recently-viewed"
  );

  return response.data;
};

// ============================================================
// RECOMMENDED PRODUCTS
// ============================================================

export const getRecommendedProducts = async () => {
  const response = await api.get(
    "/recommendations/recommended"
  );

  return response.data;
};

// ============================================================
// SIMILAR PRODUCTS
// ============================================================

export const getSimilarProducts = async (productId) => {
  const response = await api.get(
    `/recommendations/similar/${productId}`
  );

  return response.data;
};

// ============================================================
// PERSONALIZED PRODUCTS
// ============================================================

export const getPersonalizedProducts = async () => {
  const response = await api.get(
    "/recommendations/personalized"
  );

  return response.data;
};