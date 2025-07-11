import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Eye } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import watchesData from '../data/watches.json';
import WatchModal from './WatchModal';

const FeaturedWatches = () => {
  const [selectedWatchId, setSelectedWatchId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { convertPrice } = useCurrency();

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
    <section id="watches" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Timepieces
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully curated selection of authenticated luxury watches. Each piece has been 
            thoroughly inspected and comes with our guarantee of authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {watchesData.slice(0, 6).map((watch) => (
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

        <div className="text-center mt-12">
          <Link
            to="/watches"
            className="inline-flex items-center space-x-2 bg-burgundy-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-burgundy-800 transition-colors"
          >
            <span>View All Watches</span>
          </Link>
        </div>
      </div>

      {/* Watch Modal for Quick View */}
      <WatchModal
        watchId={selectedWatchId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default FeaturedWatches;