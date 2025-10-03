import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search employees...' }) => {
  const [searchValue, setSearchValue] = useState('');

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Search is already triggered by useEffect
  };

  const handleClear = () => {
    setSearchValue('');
    // onSearch('') will be called by useEffect
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative group">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md"
          aria-label="Search employees"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
