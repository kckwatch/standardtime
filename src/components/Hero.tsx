import React from 'react';
import { Shield, Award, Clock, Truck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Premium Pre-Owned
              <span className="block text-yellow-400">Luxury Watches</span>
            </h1>
            <p className="text-xl text-burgundy-100 mb-8 leading-relaxed">
              Discover authenticated timepieces from the world's finest watchmakers. 
              Every watch is certified, guaranteed, and backed by our lifetime support promise.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Authenticated & Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Lifetime Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className="text-base font-semibold">Professional Watch Expert</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Worldwide Free Shipping  </span>
              
            </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Buyer Custom Assistance</span>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.chrono24.co.uk/search/index.htm?customerId=34597&dosearch=true"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 text-burgundy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors text-center"
              >
                Browse Chrono24 Store
              </a>
              <a
                href="#watches"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-burgundy-900 transition-colors text-center"
              >
                View    timepiece
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://imgur.com/p04EmBY.jpg"
                alt="Luxury watch collection"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg transform rotate-3 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;