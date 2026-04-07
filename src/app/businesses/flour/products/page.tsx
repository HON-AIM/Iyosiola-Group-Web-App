"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
  categories: Array<{ name: string; count: number }>;
}

function ProductImagePlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-100 flex items-center justify-center">
      <svg className="w-16 h-16 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAddingToCart: boolean;
}

function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden interactive-hover flex flex-col h-full transition-all duration-300 hover:shadow-md">
      <div className="h-48 bg-surface-100 w-full relative overflow-hidden group">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <ProductImagePlaceholder />
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-accent-700 shadow-sm uppercase tracking-wide">
          {product.category}
        </div>
        <div className={`absolute bottom-2 left-2 px-3 py-1 rounded text-xs font-semibold ${isOutOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {stockStatus}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/businesses/flour/products/${product.id}`} className="group">
          <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-surface-600 text-sm mb-4 line-clamp-3 flex-grow">{product.description}</p>
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">{i < Math.floor(product.rating!) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-xs text-surface-500">({product.reviews} reviews)</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-surface-100">
          <span className="text-xl font-extrabold text-primary-700">₦{product.price.toLocaleString()}</span>
          <button onClick={() => onAddToCart(product)} disabled={isOutOfStock || isAddingToCart} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-sm text-sm">
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  categories: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

function FilterSidebar({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }: FilterSidebarProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 sticky top-28 h-fit">
      <div className="mb-8">
        <h3 className="font-bold text-lg text-primary-900 mb-4 border-b border-surface-100 pb-2">Categories</h3>
        <ul className="space-y-3 text-surface-600 font-medium">
          <li>
            <button onClick={() => onCategoryChange("")} className={`w-full text-left flex justify-between transition-colors ${selectedCategory === "" ? "text-accent-600 font-bold" : "hover:text-primary-600"}`}>
              All Products <span>({categories.reduce((sum, cat) => sum + cat.count, 0)})</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button onClick={() => onCategoryChange(cat.name)} className={`w-full text-left flex justify-between transition-colors ${selectedCategory === cat.name ? "text-accent-600 font-bold" : "hover:text-primary-600"}`}>
                {cat.name} <span>({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg text-primary-900 mb-4 border-b border-surface-100 pb-2">Sort By</h3>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="w-full bg-white border border-surface-300 text-surface-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}

function MobileFilterButton({ showFilters, onToggle }: { showFilters: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="md:hidden fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center gap-2" aria-label="Toggle filters">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
      </svg>
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-surface-200" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-surface-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-surface-200 rounded" />
          <div className="h-4 bg-surface-200 rounded w-5/6" />
        </div>
        <div className="h-10 bg-surface-200 rounded" />
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, pageSize: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: "20",
          ...(selectedCategory && { category: selectedCategory }),
          ...(sortBy && { sort: sortBy }),
          ...(searchQuery && { search: searchQuery }),
        });
        const response = await fetch(`/api/products?${params.toString()}`, { headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
        setCategories(data.categories);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load products";
        setError(errorMessage);
        console.error("[ERROR] Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy, searchQuery, currentPage]);

  const handleAddToCart = useCallback(async (product: Product) => {
    setAddingToCartId(product.id);
    try {
      const response = await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, quantity: 1 }) });
      if (!response.ok) throw new Error("Failed to add to cart");
      console.log("✅ Product added to cart");
    } catch (err) {
      console.error("[ERROR] Failed to add to cart:", err);
    } finally {
      setAddingToCartId(null);
    }
  }, []);

  const handlePageChange = useCallback((newPage: number) => { setCurrentPage(newPage); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const handleSearch = useCallback((query: string) => { setSearchQuery(query); setCurrentPage(1); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section className="bg-primary-900 text-white py-16 px-4 md:px-8 text-center border-b-4 border-accent-500">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Products</h1>
        <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light">Browse our catalog of premium milled products. Quality guaranteed in every bag.</p>
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full px-4 py-3 rounded-lg text-surface-900 focus:outline-none focus:ring-2 focus:ring-accent-500" aria-label="Search products" />
            <svg className="absolute right-3 top-3 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar categories={categories} selectedCategory={selectedCategory} onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }} sortBy={sortBy} onSortChange={(sort) => { setSortBy(sort); setCurrentPage(1); }} />
        </aside>
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden">
            <div className="absolute left-0 top-0 w-64 h-full bg-white p-6 overflow-y-auto">
              <button onClick={() => setShowMobileFilters(false)} className="mb-6 text-surface-500 hover:text-surface-900">✕ Close</button>
              <FilterSidebar categories={categories} selectedCategory={selectedCategory} onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); setShowMobileFilters(false); }} sortBy={sortBy} onSortChange={(sort) => { setSortBy(sort); setCurrentPage(1); setShowMobileFilters(false); }} />
            </div>
          </div>
        )}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <p className="text-surface-500 font-semibold">Showing {products.length} of {pagination.total} products</p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold">Error: {error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-red-600 hover:text-red-700 font-medium underline">Try again</button>
            </div>
          )}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (<ProductSkeleton key={i} />))}
            </div>
          )}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-surface-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-surface-900 mb-2">No products found</h3>
              <p className="text-surface-600 mb-6">Try adjusting your filters or search query</p>
              <button onClick={() => { setSelectedCategory(""); setSortBy("featured"); setSearchQuery(""); setCurrentPage(1); }} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg">Clear filters</button>
            </div>
          )}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product) => (<ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isAddingToCart={addingToCartId === product.id} />))}
              </div>
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-surface-300 rounded-lg hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed">← Previous</button>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`px-3 py-2 rounded-lg transition-colors ${currentPage === i + 1 ? "bg-primary-600 text-white font-bold" : "border border-surface-300 hover:bg-surface-100"}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))} disabled={currentPage === pagination.pages} className="px-4 py-2 border border-surface-300 rounded-lg hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed">Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </section>
      <MobileFilterButton showFilters={showMobileFilters} onToggle={() => setShowMobileFilters(!showMobileFilters)} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section className="bg-primary-900 text-white py-16 px-4 md:px-8 text-center border-b-4 border-accent-500">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Products</h1>
        <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light">Loading...</p>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
