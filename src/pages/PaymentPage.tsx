import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Globe, Shield, Banknote } from 'lucide-react';

const PaymentPage = () => {
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Options</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your preferred payment method for a secure and convenient transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Wise Payment */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 p-3 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Wise Transfer</h3>
                <p className="text-green-700 font-medium">Recommended for International</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Cheaper than banks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Real exchange rates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Fast secure transfers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Regulated by authorities</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Our Wise Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Account Name:</span>
                  <span className="ml-2 text-gray-900">StandardTime</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">standardtimepiece@gmail.com</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Specific details provided after order
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Pay with Wise
            </button>
          </div>

          {/* Traditional Payment */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Bank Transfer</h3>
                <p className="text-blue-700 font-medium">Traditional Banking</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Secure transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Established method</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Available worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Higher fees international</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Bank Details</h4>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-gray-500">
                  Bank details provided after order
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Pay via Bank Transfer
            </button>
          </div>
        </div>

        {/* Payment Process */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Payment Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-gray-600 text-sm">Get in touch about your watch</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Receive Details</h4>
              <p className="text-gray-600 text-sm">Get payment instructions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Make Payment</h4>
              <p className="text-gray-600 text-sm">Complete your payment</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">4</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Receive Watch</h4>
              <p className="text-gray-600 text-sm">Your watch is shipped</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">Secure & Protected</h4>
          <p className="text-gray-600">
            All transactions are secure and protected by industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;