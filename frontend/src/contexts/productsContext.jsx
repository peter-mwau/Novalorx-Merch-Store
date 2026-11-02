import { createContext, useCallback, useContext, useState } from "react";

const ProductsContext = createContext(null);
const USD_TO_KES = 130;

const getUsdPrice = (value, variant) => {
  const price = variant?.priceCents ?? value?.priceCents ?? value?.price ?? value?.unitPriceCents;
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const getPriceDetails = useCallback((value, variant) => {
    const usd = getUsdPrice(value, variant);
    return {
      usd,
      ksh: usd * USD_TO_KES,
      usdLabel: new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: value?.currency || "USD",
      }).format(usd),
      kshLabel: `KSh ${(usd * USD_TO_KES).toLocaleString()}`,
    };
  }, []);
  const getVariantImage = useCallback((product, variant) => {
    if (variant?.imageUrl) return variant.imageUrl;
    const color = Object.entries(variant?.attributes || {}).find(
      ([name]) => name.toLowerCase() === "color",
    )?.[1];
    if (!color) return product?.images?.[0]?.url;
    return (
      product?.images?.find(
        (image) => image.color?.trim().toLowerCase() === String(color).trim().toLowerCase(),
      )?.url || product?.images?.[0]?.url
    );
  }, []);

  const getAllProducts = useCallback(async (params = {}) => {
    const query = new URLSearchParams({
      page: "1",
      limit: "100",
      ...params,
    });
    const response = await fetch(`/api/admin/products?${query}`);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch products"));
    }
    const data = await response.json();
    setProducts(data.products);
    setPagination({
      total: data.total,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    });
    return data.products;
  }, []);

  const getProductById = useCallback(async (id) => {
    const response = await fetch(`/api/admin/products/${id}`);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch product"));
    }
    return response.json();
  }, []);

  const getCategories = useCallback(async () => {
    const response = await fetch("/api/admin/categories");
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch categories"));
    }
    const data = await response.json();
    setCategories(data);
    return data;
  }, []);

  const createCategory = useCallback(async (categoryData) => {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to create category"));
    }
    const category = await response.json();
    setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
    return category;
  }, []);

  const createProduct = useCallback(async (productData) => {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to create product"));
    }
    const product = await response.json();
    setProducts((currentProducts) => [product, ...currentProducts]);
    setPagination((current) => ({ ...current, total: current.total + 1 }));
    return product;
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to update product"));
    }
    const product = await response.json();
    setProducts((currentProducts) =>
      currentProducts.map((current) => (current.id === id ? product : current)),
    );
    return product;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to delete product"));
    }
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
    setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        pagination,
        getAllProducts,
        getProductById,
        getCategories,
        createCategory,
        createProduct,
        updateProduct,
        deleteProduct,
        getPriceDetails,
        getVariantImage,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
