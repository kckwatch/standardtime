import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Content */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About StandardTime
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              StandardTime is your trusted partner in luxury timepieces. We specialize in authentic, pre-owned watches from the world's most prestigious brands.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With years of expertise in horology, we ensure every watch meets our strict standards for authenticity, condition, and quality.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Expert Authentication</h4>
                  <p className="text-gray-600 text-sm">Certified by experts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Quality Guarantee</h4>
                  <p className="text-gray-600 text-sm">Authenticity promise</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <User className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Personal Service</h4>
                  <p className="text-gray-600 text-sm">Dedicated support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Passion Driven</h4>
                  <p className="text-gray-600 text-sm">Love for timepieces</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Watch craftsmanship"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-burgundy-900/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To make luxury timepieces accessible to watch enthusiasts worldwide while maintaining the highest standards of authenticity and customer service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;