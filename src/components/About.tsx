import React from 'react';
import { User, Clock, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About StandardTime
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded on a passion for exceptional timepieces, StandardTime has been serving 
              watch enthusiasts and collectors worldwide. We specialize in authenticated 
              pre-owned luxury watches, ensuring every piece meets the highest standards of 
              quality and authenticity.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              decades of experience in horology, with certified authentication 
              processes and partnerships with leading watch manufacturers. Every watch in our 
              collection is carefully selected, thoroughly inspected, and backed by our lifetime guarantee.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Expert Authentication</h4>
                  <p className="text-gray-600 text-sm">Certified by Experts </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Quality Guarantee</h4>
                  <p className="text-gray-600 text-sm"> authenticity promise</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <User className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Personal Service</h4>
                  <p className="text-gray-600 text-sm">Dedicated customer support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Passion Driven</h4>
                  <p className="text-gray-600 text-sm">Love for exceptional timepieces</p>
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
        <div className="mt-20 text-center bg-white rounded-2xl p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To provide watch enthusiasts with authenticated, premium pre-owned timepieces for great price
            while delivering exceptional customer service and building lasting relationships 
            within the watch collecting community. We believe every great watch has a story, 
            and we're here to help you find yours.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;