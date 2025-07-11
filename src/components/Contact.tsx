import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to find your perfect timepiece? Contact us for personalized service, 
            expert advice, or any questions about our collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">standardtimepiece@gmail.com</p>
                  <p className="text-sm text-gray-500">We respond within 4 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+82 1087161870</p>
                  <p className="text-sm text-gray-500">Mon-Sun 9AM-11PM KST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Chrono24 Messaging</h4>
                  <p className="text-gray-600">Contact us directly through our Chrono24 profile</p>
                  <a
                    href="https://www.chrono24.co.uk/search/index.htm?customerId=34597&dosearch=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy-900 hover:text-burgundy-700 font-medium"
                  >
                    Message us on Chrono24 →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-burgundy-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-burgundy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Business Hours</h4>
                  <div className="text-gray-600">
                    <p>Monday - Sunday: 9:00 AM - 11:00 PM KST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Watch authentication and certification</li>
                <li>• Pre-purchase consultation</li>
                <li>• Trade-in evaluations</li>
                <li>• Watch sourcing and acquisition</li>
                <li>• Maintenance and service referrals</li>
                <li>• Collection management advice</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="purchase">Purchase Question</option>
                  <option value="authentication">Authentication Request</option>
                  <option value="trade">Trade-in Evaluation</option>
                  <option value="service">Service Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  placeholder="Tell us about the watch you're interested in or how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-burgundy-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;