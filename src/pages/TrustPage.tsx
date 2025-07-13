import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Award, Clock, Star, CheckCircle } from 'lucide-react';

const TrustPage = () => {
  const stats = [
    { icon: Users, value: "1,500+", label: "Happy Customers" },
    { icon: Clock, value: "", label: "Professional Watch Expert" },
    { icon: Award, value: "100%", label: "Authentic Guarantee" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" }
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      location: "New York, NY",
      text: "Exceptional service and authenticity guarantee. My Rolex arrived exactly as described. Will definitely buy again!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      location: "London, UK", 
      text: "Professional, trustworthy, and great communication. The watch was in perfect condition and shipping was fast.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      location: "Los Angeles, CA",
      text: "Found my dream watch through StandardTime. Their expertise and customer service is unmatched in the industry.",
      rating: 5
    }
  ];

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

        {/* Trust Stats */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Your trust is our foundation. Here's why thousands of customers choose StandardTime for their luxury watch needs.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-100 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-burgundy-900" />
              </div>
              {stat.value ? (
                <>
                  <div className="text-3xl font-bold text-burgundy-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </>
              ) : (
                <div className="text-xl font-bold text-burgundy-900">{stat.label}</div>
              )}
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Guarantees</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-burgundy-900 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Authenticity Guarantee</h3>
              <p className="text-gray-600">Every watch is authenticated by our experts</p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Return Policy</h3>
              <p className="text-gray-600">30-day return guarantee</p>
            </div>
            
            <div className="text-center">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lifetime Support</h3>
              <p className="text-gray-600">Ongoing support for your timepiece</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chrono24 Trust Badge */}
        <div className="text-center p-8 bg-burgundy-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Us on Chrono24</h2>
          <p className="text-gray-600 mb-6">
            We're also available on Chrono24, the world's leading marketplace for luxury watches.
          </p>
          <a
            href="https://www.chrono24.co.uk/search/index.htm?customerId=34597&dosearch=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-burgundy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
          >
            <span>View Chrono24 Profile</span>
            <Shield className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrustPage;