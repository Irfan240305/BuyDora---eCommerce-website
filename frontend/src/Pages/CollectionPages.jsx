import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from "react-icons/fa"; 
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOption from "../components/Products/SortOption";
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByFilters } from "../redux/slices/productsSlice";

const CollectionPages = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);

    // If collection is "all", ignore it
    const filters = collection && collection !== "all"
      ? { ...queryParams, collection }
      : { ...queryParams };

    console.log("🔍 Filters sent to backend:", filters);
    dispatch(fetchProductByFilters(filters));
  }, [collection, searchParams, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSidebarOpen]);

  return (
    <div className='flex flex-col lg:flex-row'>
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className='lg:hidden border p-3 flex justify-center items-center bg-white hover:bg-gray-50 transition-colors'
        aria-label="Toggle filters"
      >
        <FaFilter className='mr-2' />
        Filters
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 shadow-lg lg:shadow-none`}
      >
        <FilterSidebar />
      </div>

      {/* Main content */}
      <div className='flex-grow p-4'>
        <h2 className='font-bold text-2xl uppercase mb-4'>
          {collection && collection !== "all" ? `${collection} Collection` : "All Products"}
        </h2>
        <SortOption />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPages;
