import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Award, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Content */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {t.aboutStandardTime}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {t.aboutDescription1}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t.aboutDescription2}
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.expertAuthentication}</h4>
                  <p className="text-gray-600 text-sm">{t.certifiedByExperts}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.qualityGuarantee}</h4>
                  <p className="text-gray-600 text-sm">{t.authenticityPromise}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <User className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.personalService}</h4>
                  <p className="text-gray-600 text-sm">{t.dedicatedSupport}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-burgundy-900 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.passionDriven}</h4>
                  <p className="text-gray-600 text-sm">{t.loveForTimepieces}</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.ourMission}</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.missionStatement}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;