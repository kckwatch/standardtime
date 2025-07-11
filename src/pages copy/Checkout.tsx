import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Globe, Download, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from 'emailjs-com';
import LanguageSelector from '../components/LanguageSelector';

interface FormData {
  fullName: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  paymentMethod: 'Credit Card' | 'bank';
}

interface OrderItem {
  id: number;
  brand: string;
  model: string;
  year: string;
  price: string;
  originalPrice: string;
  image: string;
  condition: string;
}

const Checkout: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    country: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: user?.email || '',
    paymentMethod: 'wise'
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Get the selected watch from localStorage
    const selectedWatch = localStorage.getItem('selectedWatch');
    if (selectedWatch) {
      const watchData = JSON.parse(selectedWatch);
      setOrderItem(watchData);
    }
    
    // Pre-fill user email if logged in
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const steps = [
    { number: 1, title: t.personalInfo, icon: '👤' },
    { number: 2, title: t.paymentMethod, icon: '💳' },
    { number: 3, title: t.orderReview, icon: '📋' },
    { number: 4, title: t.completion, icon: '✅' }
  ];

  

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = t.required;
      if (!formData.country) newErrors.country = t.required;
      if (!formData.address.trim()) newErrors.address = t.required;
      if (!formData.city.trim()) newErrors.city = t.required;
      if (!formData.phone.trim()) newErrors.phone = t.required;
      if (!formData.email.trim()) {
        newErrors.email = t.required;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.invalidEmail;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const sendOrderNotificationEmail = async (orderData: any) => {
    try {
      // Send email to admin
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_ORDER_TEMPLATE_ID', // Replace with your EmailJS template ID for orders
        {
          to_email: 'standardtimepiece@gmail.com',
          subject: `New Order #${orderData.orderId} - StandardTime`,
          message: `
            New order received on StandardTime:
            
            ORDER DETAILS:
            Order ID: ${orderData.orderId}
            Date: ${orderData.orderDate}
            
            CUSTOMER INFORMATION:
            Name: ${orderData.customerName}
            Email: ${orderData.email}
            Phone: ${orderData.phone}
            Address: ${orderData.address}, ${orderData.city} ${orderData.postalCode}, ${orderData.country}
            
            WATCH DETAILS:
            Brand: ${orderData.watchBrand}
            Model: ${orderData.watchModel}
            Year: ${orderData.watchYear}
            Condition: ${orderData.watchCondition}
            Price: ${orderData.price}
            
            PAYMENT:
            Method: ${orderData.paymentMethod}
            Status: Pending
            
            Please process this order and contact the customer for payment details.
          `,
          order_id: orderData.orderId,
          customer_name: orderData.customerName,
          customer_email: orderData.email,
          customer_phone: orderData.phone,
          customer_address: `${orderData.address}, ${orderData.city} ${orderData.postalCode}, ${orderData.country}`,
          watch_details: `${orderData.watchBrand} ${orderData.watchModel} (${orderData.watchYear})`,
          watch_price: orderData.price,
          payment_method: orderData.paymentMethod,
          order_date: orderData.orderDate
        }
      );
      
      // Send confirmation email to customer
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_CUSTOMER_TEMPLATE_ID', // Replace with customer confirmation template
        {
          to_email: orderData.email,
          customer_name: orderData.customerName,
          order_id: orderData.orderId,
          watch_details: `${orderData.watchBrand} ${orderData.watchModel} (${orderData.watchYear})`,
          watch_price: orderData.price,
          payment_method: orderData.paymentMethod,
          message: `
            Thank you for your order!
            
            Your order #${orderData.orderId} has been received and is being processed.
            We will contact you shortly with payment details.
            
            Order Summary:
            ${orderData.watchBrand} ${orderData.watchModel} (${orderData.watchYear})
            Price: ${orderData.price}
            Payment Method: ${orderData.paymentMethod}
            
            Contact us at standardtimepiece@gmail.com or +82 1087161870 if you have any questions.
          `
        }
      );
    } catch (error) {
      console.error('Failed to send order notification emails:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderItem || !user) return;
    
    const newOrderId = `ST-${Date.now()}`;
    setOrderId(newOrderId);
    
    const orderData = {
      orderId: newOrderId,
      userId: user.uid,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      watchId: orderItem.id,
      watchBrand: orderItem.brand,
      watchModel: orderItem.model,
      watchYear: orderItem.year,
      watchCondition: orderItem.condition,
      price: orderItem.price,
      originalPrice: orderItem.originalPrice,
      paymentMethod: formData.paymentMethod === 'wise' ? 'Wise Transfer' : 'Bank Transfer',
      status: 'pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date()
    };
    
    try {
      // Save order to Firestore
      await setDoc(doc(collection(db, 'orders'), newOrderId), orderData);
      
      // Send email notifications
      await sendOrderNotificationEmail(orderData);
      
      setOrderPlaced(true);
      setCurrentStep(4);
      
      // Clear the selected watch from localStorage
      localStorage.removeItem('selectedWatch');
      
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
  };

  const downloadReceipt = () => {
    if (!orderItem) return;
    
    const receiptData = `
StandardTime Receipt
Order #${orderId}
Date: ${new Date().toLocaleDateString()}

Customer: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}

Watch Details:
${orderItem.brand} ${orderItem.model} (${orderItem.year})
Condition: ${orderItem.condition}
Price: ${orderItem.price}

Subtotal: ${orderItem.price}
Shipping: Free
Total: ${orderItem.price}

Payment Method: ${formData.paymentMethod === 'wise' ? 'Wise Transfer' : 'Bank Transfer'}
Status: ${paymentConfirmed ? 'Paid' : 'Pending'}

Thank you for your business!
StandardTime - Premium Pre-Owned Luxury Watches
standardtimepiece@gmail.com
+82 1087161870
`;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StandardTime-Receipt-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!orderItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No item selected</h1>
          <Link to="/watches" className="text-burgundy-900 hover:text-burgundy-700">
            Browse Watches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Store</span>
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.checkout}</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-burgundy-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? <Check className="h-6 w-6" /> : step.number}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-burgundy-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-burgundy-900' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.personalInfo}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.fullName} *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.country} *
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.city} *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.address} *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full address"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.postalCode}
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                        placeholder="Enter postal code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.selectPayment}</h2>
                  
                  <div className="space-y-4">
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === 'wise'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', 'wise')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Globe className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{t.wiseTransfer}</h3>
                            <p className="text-green-600 font-medium">{t.recommended}</p>
                            <p className="text-sm text-gray-600">{t.lowerFees}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          formData.paymentMethod === 'wise'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'wise' && (
                            <Check className="h-4 w-4 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === 'bank'
                          ? 'border-burgundy-500 bg-burgundy-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', 'bank')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-burgundy-100 p-3 rounded-lg">
                            <CreditCard className="h-6 w-6 text-burgundy-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{t.bankTransfer}</h3>
                            <p className="text-sm text-gray-600">{t.traditional}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          formData.paymentMethod === 'bank'
                            ? 'border-burgundy-500 bg-burgundy-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'bank' && (
                            <Check className="h-4 w-4 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.orderReview}</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="ml-2 text-gray-900">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{formData.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Country:</span>
                        <span className="ml-2 text-gray-900">{formData.country}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Address:</span>
                        <span className="ml-2 text-gray-900">
                          {formData.address}, {formData.city} {formData.postalCode}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Payment:</span>
                        <span className="ml-2 text-gray-900">
                          {formData.paymentMethod === 'wise' ? t.wiseTransfer : t.bankTransfer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Completion */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  {!orderPlaced ? (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Place Order</h2>
                      <p className="text-gray-600 mb-6">Review your information and click below to place your order.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-10 w-10 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-600 mb-4">{t.orderPlaced}</h2>
                      <p className="text-gray-600 mb-2">Order ID: <strong>{orderId}</strong></p>
                      <p className="text-gray-600 mb-6">{t.thankYou}</p>
                      
                      {!paymentConfirmed && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-bold text-yellow-800 mb-2">{t.paymentPending}</h3>
                          <p className="text-yellow-700 mb-4">{t.paymentInstructions}</p>
                          
                          <div className="bg-white rounded-lg p-4 text-left">
                            <h4 className="font-bold text-gray-900 mb-2">
                              {formData.paymentMethod === 'wise' ? 'Wise Transfer Details' : 'Bank Transfer Details'}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Account Name:</span>
                                <span className="ml-2">StandardTime</span>
                              </div>
                              <div>
                                <span className="font-medium">Email:</span>
                                <span className="ml-2">standardtimepiece@gmail.com</span>
                              </div>
                              <div>
                                <span className="font-medium">Amount:</span>
                                <span className="ml-2">{orderItem?.price} USD</span>
                              </div>
                              <div>
                                <span className="font-medium">Reference:</span>
                                <span className="ml-2">Order #{orderId}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                              href="mailto:standardtimepiece@gmail.com"
                              className="inline-flex items-center space-x-2 bg-burgundy-900 text-white px-6 py-3 rounded-lg hover:bg-burgundy-800 transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Email Us</span>
                            </a>
                            <a
                              href="tel:+821087161870"
                              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              <span>Call Us</span>
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {paymentConfirmed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-bold text-green-800 mb-2">{t.paymentConfirmed}</h3>
                          <p className="text-green-700 mb-4">{t.orderComplete}</p>
                          <button
                            onClick={downloadReceipt}
                            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>{t.downloadReceipt}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                {currentStep > 1 && currentStep < 4 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.back}
                  </button>
                )}
                
                {currentStep < 3 && (
                  <button
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-burgundy-900 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
                  >
                    {t.continue}
                  </button>
                )}
                
                {currentStep === 3 && (
                  <button
                    onClick={handlePlaceOrder}
                    className="ml-auto px-6 py-3 bg-burgundy-900 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
                  >
                    {t.placeOrder}
                  </button>
                )}
                
                {currentStep === 4 && orderPlaced && !paymentConfirmed && (
                  <button
                    onClick={handleConfirmPayment}
                    className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.confirmPayment}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t.orderSummary}</h3>
              
              {orderItem && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={orderItem.image}
                      alt={`${orderItem.brand} ${orderItem.model}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {orderItem.brand} {orderItem.model} ({orderItem.year})
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">Condition: {orderItem.condition}</p>
                      <p className="text-burgundy-900 font-bold">{orderItem.price}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="text-gray-900">{orderItem?.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.shipping}</span>
                  <span className="text-green-600 font-medium">{t.free}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">{t.total}</span>
                  <span className="text-burgundy-900">{orderItem?.price}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-burgundy-50 rounded-lg">
                <div className="flex items-center space-x-2 text-burgundy-800">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Worldwide Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">14-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div> 
);
};

export default Checkout;
