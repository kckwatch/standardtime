import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.getInTouch}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contactDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.contactInformation}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.email}</h4>
                  <p className="text-gray-600">standardtimepiece@gmail.com</p>
                  <p className="text-sm text-gray-500">{t.respondWithin4Hours}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.phone}</h4>
                  <p className="text-gray-600">+82 1087161870</p>
                  <p className="text-sm text-gray-500">{t.businessHours}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.chrono24Messaging}</h4>
                  <p className="text-gray-600">{t.contactDirectly}</p>
                  <a
                    href="https://www.chrono24.co.uk/search/index.htm?customerId=34597&dosearch=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy-900 hover:text-burgundy-700 font-medium"
                  >
                    {t.messageOnChrono24}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.businessHoursTitle}</h4>
                  <div className="text-gray-600">
                    <p>{t.mondayToSunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-4">{t.ourServices}</h4>
              <ul className="space-y-2 text-gray-600">
                <li>{t.watchAuthentication}</li>
                <li>{t.prePurchaseConsultation}</li>
                <li>{t.tradeInEvaluations}</li>
                <li>{t.watchSourcing}</li>
                <li>{t.maintenanceReferrals}</li>
                <li>{t.collectionManagement}</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.sendMessage}</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 font-medium">Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.subject}
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  required
                >
                  <option value="">{t.selectSubject}</option>
                  <option value="inquiry">{t.generalInquiry}</option>
                  <option value="purchase">{t.purchaseQuestion}</option>
                  <option value="authentication">{t.authenticationRequest}</option>
                  <option value="trade">{t.tradeInEvaluation}</option>
                  <option value="service">{t.serviceQuestion}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  placeholder={t.messagePlaceholder}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-burgundy-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
              >
                {t.sendMessageButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;