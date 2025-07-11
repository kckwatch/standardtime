import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Eye, Filter, Search } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import watchesData from '../data/watches.json';
import WatchModal from './WatchModal';

const WatchesPage: React.FC = () => {
  const [selectedWatchId, setSelectedWatchId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filteredWatches, setFilteredWatches] = useState(watchesData);
  const { convertPrice } = useCurrency();

  // Get unique brands for filter
  const brands = ['all', ...Array.from(new Set(watchesData.map(watch => watch.brand)))];

  useEffect(() => {
    let filtered = watchesData.filter(watch => 
      (watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       watch.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedBrand === 'all' || watch.brand === selectedBrand)
    );

    // Sort watches
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        case 'price-high':
          const priceA2 = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB2 = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB2 - priceA2;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return a.brand.localeCompare(b.brand);
      }
    });

    setFilteredWatches(filtered);
  }, [searchTerm, selectedBrand, sortBy]);

  const handleQuickView = (watchId: number) => {
    setSelectedWatchId(watchId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWatchId(null);
  };

  // Prevent image dragging and context menu
  const handleImageInteraction = (e: React.MouseEvent | React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Watch Collection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our complete collection of authenticated luxury timepieces
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search watches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              />
            </div>

            {/* Brand Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent appearance-none"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            >
              <option value="brand">Sort by Brand</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredWatches.length} of {watchesData.length} watches
          </p>
        </div>

        {/* Watches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWatches.map((watch) => (
            <div key={watch.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                  draggable={false}
                  onDragStart={handleImageInteraction}
                  onContextMenu={handleImageInteraction}
                  onMouseDown={handleImageInteraction}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitUserDrag: 'none',
                    KhtmlUserDrag: 'none',
                    MozUserDrag: 'none',
                    OUserDrag: 'none'
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {watch.condition}
                  </span>
                </div>
                {/* Watermark */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  © StandardTime
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{watch.brand}</h3>
                  <p className="text-gray-600">{watch.model} ({watch.year})</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-burgundy-900">{convertPrice(watch.price)}</span>
                    <span className="text-lg text-gray-500 line-through">{convertPrice(watch.originalPrice)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {(watch.features || []).slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Link
                      to={`/watch/${watch.id}`}
                      className="flex-1 bg-burgundy-900 text-white py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                    
                    <button
                      onClick={() => handleQuickView(watch.id)}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      title="Quick View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No watches found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-burgundy-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-gray-600 mb-6">
            We have access to an extensive network of luxury watch dealers and collectors. 
            Let us help you find your perfect timepiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.chrono24.co.uk/search/index.htm?customerId=34597&dosearch=true"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-burgundy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
            >
              Browse Our Full Chrono24 Store
            </a>
            <Link
              to="/contact"
              className="bg-white text-burgundy-900 border border-burgundy-900 px-6 py-3 rounded-lg font-medium hover:bg-burgundy-50 transition-colors"
            >
              Contact Us for Custom Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Watch Modal for Quick View */}
      <WatchModal
        watchId={selectedWatchId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default WatchesPage;