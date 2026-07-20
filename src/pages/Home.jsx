import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';

// Home page renders the product grid with a sidebar of filters and a
// sort dropdown. The search query (?q=...) from the navbar is honoured.
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Local state for the filters and sort order
  const [search, setSearch] = useState(query);
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('default');

  // Keep the input box in sync when the navbar search changes the URL
  useEffect(() => {
    setSearch(query);
  }, [query]);

  // Build unique category and brand lists for the filter dropdowns
  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [],
  );
  const brands = useMemo(
    () => ['All', ...new Set(products.map((p) => p.brand))],
    [],
  );

  // Apply search, filters, and sorting in a memo so it only recomputes
  // when one of the dependencies changes.
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesBrand = brand === 'All' || p.brand === brand;
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= minRating;
      return (
        matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating
      );
    });

    if (sort === 'low-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [search, category, brand, maxPrice, minRating, sort]);

  // Clear the URL query param when the user clears the search box
  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      setSearchParams({ q: value });
    } else if (searchParams.has('q')) {
      setSearchParams({});
    }
  }

  function clearFilters() {
    setCategory('All');
    setBrand('All');
    setMaxPrice(100000);
    setMinRating(0);
    setSort('default');
    setSearch('');
    setSearchParams({});
  }

  return (
    <div className="home">
      <div className="filters">
        <div className="filters-head">
          <h3>Filters</h3>
          <button className="btn-link" onClick={clearFilters}>Clear All</button>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Max Price: ₹{Number(maxPrice).toLocaleString('en-IN')}</label>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
            <option value="0">All Ratings</option>
            <option value="4">4★ &amp; above</option>
            <option value="4.5">4.5★ &amp; above</option>
          </select>
        </div>
      </div>

      <div className="products-section">
        <div className="products-toolbar">
          <input
            type="text"
            className="page-search"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="default">Sort: Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <p className="result-count">{filtered.length} results</p>

        {filtered.length === 0 ? (
          <p className="empty-state">No products match your filters.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
