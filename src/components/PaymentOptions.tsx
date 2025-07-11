import React from 'react';
import { CreditCard, Banknote, Globe, Shield } from 'lucide-react';

const PaymentOptions = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Payment Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer multiple secure payment methods for your convenience, including international transfers with competitive rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Wise Payment */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 p-3 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Wise Transfer</h3>
                <p className="text-green-700 font-medium">Recommended for International Buyers</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Up to 8x cheaper than traditional banks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Real exchange rates, no hidden fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Fast and secure international transfers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Regulated by financial authorities</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Our Wise Details:</h4>
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
                  * Specific account details will be provided after purchase confirmation
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
                <span className="text-gray-700">Secure bank-to-bank transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Established payment method</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Available worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Higher fees for international transfers</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Bank Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-gray-500">
                  * Bank details will be provided after purchase confirmation
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Pay via Bank Transfer
            </button>
          </div>
        </div>

        {/* Payment Process */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Payment Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-gray-600 text-sm">Reach out about the watch you're interested in purchasing</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Receive Details</h4>
              <p className="text-gray-600 text-sm">We'll provide payment details and final pricing</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Make Payment</h4>
              <p className="text-gray-600 text-sm">Transfer funds via your preferred method</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">4</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Receive Watch</h4>
              <p className="text-gray-600 text-sm">Your watch ships immediately after payment confirmation</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">Secure & Protected</h4>
          <p className="text-gray-600">
            All payments are processed securely. We never store your financial information and all transactions 
            are protected by banking regulations and our authenticity guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;