import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, Award, Clock, CreditCard, Globe, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import watchesData from '../data/watches.json';
import AuthModal from "./AuthModal.tsx";

const WatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { convertPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedForPurchase, setSelectedForPurchase] = useState(false);

  const watch = watchesData.find(w => w.id === parseInt(id || '0'));

  if (!watch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Watch not found</h1>
          <Link to="/" className="text-burgundy-900 hover:text-burgundy-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Use images array if available, otherwise fall back to single image
  const images = watch.images || [watch.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyNow = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Store the exact watch data for checkout
    const watchForCheckout = {
      id: watch.id,
      brand: watch.brand,
      model: watch.model,
      year: watch.year,
      price: watch.price,
      originalPrice: watch.originalPrice,
      image: watch.image,
      condition: watch.condition,
      features: watch.features,
      description: watch.description,
      specifications: watch.specifications
    };
    
    localStorage.setItem('selectedWatch', JSON.stringify(watchForCheckout));
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    // Allow adding to cart without login
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === watch.id);
    
    if (!existingItem) {
      cart.push({
        id: watch.id,
        brand: watch.brand,
        model: watch.model,
        year: watch.year,
        price: watch.price,
        originalPrice: watch.originalPrice,
        image: watch.image,
        condition: watch.condition
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      setSelectedForPurchase(true);
      setTimeout(() => setSelectedForPurchase(false), 2000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Store</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`${watch.brand} ${watch.model} - Image ${currentImageIndex + 1}`}
                  className="w-full rounded-xl shadow-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-medium">
                    {watch.condition}
                  </span>
                </div>
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-burgundy-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-8 w-8 text-burgundy-900 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Authenticated & Certified</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Authentic Guarantee</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Professional Watch Expert</p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{watch.brand}</h1>
                <h2 className="text-2xl text-gray-600 mb-4">{watch.model} ({watch.year})</h2>
                
                <div className="flex items-baseline space-x-4 mb-6">
                  <span className="text-4xl font-bold text-burgundy-900">{convertPrice(watch.price)}</span>
                  <span className="text-2xl text-gray-500 line-through">{convertPrice(watch.originalPrice)}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {(watch.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Options */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-burgundy-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-burgundy-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy Now</span>
                  </button>
                  
                  <button
                    onClick={handleAddToCart}
                    className={`px-6 py-4 rounded-lg font-bold text-lg transition-colors ${
                      selectedForPurchase
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedForPurchase ? '✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">{watch.description}</div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(watch.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Wise Transfer</span>
                    </div>
                    <p className="text-sm text-green-700">Recommended - Lower Fees</p>
                  </div>
                  
                  <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-5 w-5 text-burgundy-600" />
                      <span className="font-medium text-burgundy-800">Bank Transfer</span>
                    </div>
                    <p className="text-sm text-burgundy-700">Traditional - 2% discount</p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-burgundy-50 rounded-lg p-6">
                <h4 className="font-bold text-burgundy-900 mb-2">Our Guarantee</h4>
                <p className="text-burgundy-800 text-sm">
                  Every watch comes with our authenticity guarantee and professional inspection certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </>
  );
};

export default WatchDetail;