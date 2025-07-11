import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ExternalLink, Shield, Award, Clock, CreditCard, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import watchesData from '../data/watches.json';

interface WatchModalProps {
  watchId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const WatchModal: React.FC<WatchModalProps> = ({ watchId, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { convertPrice } = useCurrency();
  const watch = watchId ? watchesData.find(w => w.id === watchId) : null;

  // Reset image index when watch changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [watchId]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !watch) return null;

  // Use images array if available, otherwise fall back to single image
  const images = watch.images || [watch.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Prevent context menu and drag events
  const handleImageInteraction = (e: React.MouseEvent | React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 p-2 rounded-full transition-all duration-200 shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh]">
            {/* Image Section */}
            <div className="relative bg-gray-100 flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
              <div className="relative w-full h-full">
                <img
                  src={images[currentImageIndex]}
                  alt={`${watch.brand} ${watch.model} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
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
                
                {/* Watermark Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    StandardTime
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    © StandardTime
                  </div>
                </div>

                <div className="absolute top-4 right-16">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-medium">
                    {watch.condition}
                  </span>
                </div>
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                        onDragStart={handleImageInteraction}
                        onContextMenu={handleImageInteraction}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 overflow-y-auto max-h-[90vh]">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{watch.brand}</h1>
                  <h2 className="text-xl text-gray-600 mb-4">{watch.model} ({watch.year})</h2>
                  
                  <div className="flex items-baseline space-x-4 mb-6">
                    <span className="text-3xl font-bold text-burgundy-900">{convertPrice(watch.price)}</span>
                    <span className="text-xl text-gray-500 line-through">{convertPrice(watch.originalPrice)}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(watch.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-burgundy-50 rounded-lg">
                    <Shield className="h-6 w-6 text-burgundy-900 mx-auto mb-1" />
                    <p className="text-xs font-medium text-burgundy-900">Authenticated</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-green-600">Guaranteed</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-yellow-600">Expert Verified</p>
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(watch.specifications).slice(0, 6).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0">
                          <dt className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace('_', ' ')}
                          </dt>
                          <dd className="text-sm font-semibold text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Options</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Wise Transfer</span>
                      </div>
                      <p className="text-xs text-green-700">Lower fees, better rates</p>
                    </div>
                    
                    <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="h-4 w-4 text-burgundy-600" />
                        <span className="text-sm font-medium text-burgundy-800">Bank Transfer</span>
                      </div>
                      <p className="text-xs text-burgundy-700">Traditional banking</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <a
                    href={watch.chrono24Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-yellow-500 text-burgundy-900 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Purchase on Chrono24</span>
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="w-full bg-burgundy-900 text-white py-3 rounded-lg font-bold text-lg hover:bg-burgundy-800 transition-colors"
                  >
                    Contact for Payment Details
                  </button>
                </div>

                {/* Guarantee */}
                <div className="bg-burgundy-50 rounded-lg p-4">
                  <h4 className="font-bold text-burgundy-900 mb-2">Our Guarantee</h4>
                  <p className="text-burgundy-800 text-sm">
                    This timepiece comes with our lifetime authenticity guarantee and 14-day return policy. 
                    All watches are professionally authenticated and inspected by our expert team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchModal;