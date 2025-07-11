import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Globe, Shield, Banknote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToStore}</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.paymentOptionsPage}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.paymentDescription}
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
                <h3 className="text-2xl font-bold text-gray-900">{t.wiseTransfer}</h3>
                <p className="text-green-700 font-medium">{t.recommendedForInternational}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">{t.cheaperThanBanks}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">{t.realExchangeRates}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">{t.fastSecureTransfers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">{t.regulatedByAuthorities}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">{t.ourWiseDetails}</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t.accountName}:</span>
                  <span className="ml-2 text-gray-900">StandardTime</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.email}:</span>
                  <span className="ml-2 text-gray-900">standardtimepiece@gmail.com</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {t.specificDetailsProvided}
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              {t.payWithWise}
            </button>
          </div>

          {/* Traditional Payment */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t.bankTransfer}</h3>
                <p className="text-blue-700 font-medium">{t.traditionalBanking}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{t.secureTransfer}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{t.establishedMethod}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{t.availableWorldwide}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{t.higherFeesInternational}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">{t.bankDetails}</h4>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-gray-500">
                  {t.bankDetailsProvided}
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {t.payViaBankTransfer}
            </button>
          </div>
        </div>

        {/* Payment Process */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.howPaymentWorks}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.contactUs}</h4>
              <p className="text-gray-600 text-sm">{t.contactUsDescription}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.receiveDetails}</h4>
              <p className="text-gray-600 text-sm">{t.receiveDetailsDescription}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.makePayment}</h4>
              <p className="text-gray-600 text-sm">{t.makePaymentDescription}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-900 font-bold text-lg">4</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t.receiveWatch}</h4>
              <p className="text-gray-600 text-sm">{t.receiveWatchDescription}</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">{t.secureProtected}</h4>
          <p className="text-gray-600">
            {t.securityNotice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;