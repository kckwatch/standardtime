import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Globe, Mail, Phone, Gift, Clock, ShoppingCart, AlertCircle, CheckCircle, User, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { supabase } from '../supabase';
import CurrencySelector from '../components/CurrencySelector';

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  paymentMethod: 'Card Payment' | 'Bank Transfer';
  customsAssistance: boolean;
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
  const { user } = useAuth();
  const { convertPrice, currency } = useCurrency();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: user?.email || '',
    paymentMethod: 'Card Payment',
    customsAssistance: false
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get the selected watch from localStorage
    const selectedWatch = localStorage.getItem('selectedWatch');
    if (selectedWatch) {
      const watchData = JSON.parse(selectedWatch);
      setOrderItem(watchData);
    } else {
      // If no selected watch, try to get from cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length > 0) {
        setOrderItem(cart[0]); // Use first item from cart
      }
    }
    
    // Pre-fill user email if logged in
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const steps = [
    { number: 1, title: 'Payment Method', icon: '💳' },
    { number: 2, title: 'Personal Information', icon: '👤' },
    { number: 3, title: 'Payment Process', icon: '💰' },
    { number: 4, title: 'Order Confirmation', icon: '✅' }
  ];

  const calculatePricing = () => {
    if (!orderItem) return { subtotal: 0, shipping: 0, discount: 0, total: 0 };
    
    // Extract numeric value from price string (remove $, commas, etc.)
    const priceStr = (orderItem.price || '0').replace(/[^0-9.]/g, '');
    const subtotal = parseFloat(priceStr) || 0;
    
    // Shipping: Free for members, $100 for non-members
    const shipping = user ? 0 : 100;
    
    // No discount for now
    const discount = 0;
    
    const total = subtotal + shipping - discount;
    
    return { subtotal, shipping, discount, total };
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
    }

    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'This field is required';
      if (!formData.phone.trim()) newErrors.phone = 'This field is required';
      if (!formData.address.trim()) newErrors.address = 'This field is required';
      if (!formData.city.trim()) newErrors.city = 'This field is required';
      if (!formData.country.trim()) newErrors.country = 'This field is required';
      if (!formData.email.trim()) {
        newErrors.email = 'This field is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof Partial<FormData>]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep(currentStep)) {
      return;
    }
    if (currentStep === 2 && !validateStep(currentStep)) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!orderItem || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const pricing = calculatePricing();
      
      // Generate a simple 6-digit order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      const orderData = {
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        watch_id: orderItem.id.toString(),
        watch_brand: orderItem.brand,
        watch_model: orderItem.model,
        watch_year: orderItem.year || new Date().getFullYear().toString(),
        price: orderItem.price,
        total: pricing.total,
        currency: currency,
        payment_method: formData.paymentMethod,
        customs_assistance: formData.customsAssistance,
        status: 'pending',
        order_date: new Date().toISOString()
      };
      
      console.log('Submitting order data:', orderData);
      
      try {
        // Save order to Supabase
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select('*')
          .single();
        
        if (error) {
          console.error('Supabase error details:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('Order was created but no data was returned');
        }
        
        console.log('Order created successfully:', data);
        setOrderNumber(orderNumber);
        
        // Move to step 4 immediately after successful order creation
        setCurrentStep(4);
        
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        throw dbError;
      }
      
      // Clear the selected watch from localStorage
      localStorage.removeItem('selectedWatch');
      localStorage.removeItem('cart');
      
    } catch (error: any) {
      console.error('Failed to place order:', error);
      
      // Show more specific error messages
      let errorMessage = 'Failed to place order. ';
      if (error.message?.includes('original_price')) {
        errorMessage += 'Database schema issue detected. ';
      } else if (error.message?.includes('permission')) {
        errorMessage += 'Permission denied. ';
      } else {
        errorMessage += error.message || 'Unknown error occurred. ';
      }
      errorMessage += 'Please try again or contact us directly.';
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  const pricing = calculatePricing();

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
            <CurrencySelector />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
          {orderNumber && (
            <div className="mt-4 p-3 bg-burgundy-50 rounded-lg">
              <p className="text-burgundy-900 font-bold">Order Number: #{orderNumber}</p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
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
                  <span className={`mt-2 text-sm font-medium text-center ${
                    currentStep >= step.number ? 'text-burgundy-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 ${
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
              
              {/* Step 1: Payment Method Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === 'Card Payment'
                          ? 'border-burgundy-500 bg-burgundy-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', 'Card Payment')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-burgundy-100 p-3 rounded-lg">
                            <CreditCard className="h-6 w-6 text-burgundy-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Card Payment</h3>
                            <p className="text-sm text-gray-600">Secure payment processing</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          formData.paymentMethod === 'Card Payment'
                            ? 'border-burgundy-500 bg-burgundy-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'Card Payment' && (
                            <Check className="h-4 w-4 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.paymentMethod === 'Bank Transfer'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', 'Bank Transfer')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Globe className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Bank Transfer</h3>
                            <p className="text-sm text-gray-600">Direct bank transfer</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          formData.paymentMethod === 'Bank Transfer'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'Bank Transfer' && (
                            <Check className="h-4 w-4 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.paymentMethod && <p className="text-red-600 text-sm">{errors.paymentMethod}</p>}
                </div>
              )}

              {/* Step 2: Personal Information Form */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full address"
                        />
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your country"
                      />
                      {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Customs Assistance Checkbox */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="customsAssistance"
                          checked={formData.customsAssistance}
                          onChange={(e) => handleInputChange('customsAssistance', e.target.checked)}
                          className="mt-1 h-4 w-4 text-burgundy-600 focus:ring-burgundy-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor="customsAssistance" className="flex items-center space-x-2 font-medium text-blue-900 cursor-pointer">
                            <Gift className="h-5 w-5" />
                            <span>Would you like help reducing customs tax?</span>
                          </label>
                          <p className="text-sm text-blue-700 mt-1">
                            If checked, the declared value will be lowered and the package will be marked as a gift.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Flow */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Process</h2>
                  
                  {formData.paymentMethod === 'Card Payment' ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-16 w-16 text-burgundy-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-4">We are processing your order...</h3>
                      <p className="text-gray-600 mb-6">Your order will be confirmed once payment is processed.</p>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="bg-burgundy-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Processing...' : 'Complete Payment'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-yellow-800 mb-4">Please transfer the payment to the following bank account.</h3>
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h4 className="font-bold text-gray-900 mb-3">Bank Transfer Details</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Bank:</strong> Hana Bank</div>
                            <div><strong>Account Name:</strong> Kwon, Changkyu (StandardTime)</div>
                            <div><strong>Account Number:</strong> 29891090745107</div>
                            <div><strong>SWIFT Code:</strong> HNBNKRSE</div>
                            <div><strong>Amount:</strong> ${pricing.total.toFixed(2)} USD</div>
                            <div><strong>Reference:</strong> Order #{orderNumber || 'PENDING'}</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 text-yellow-700">
                          <AlertCircle className="h-5 w-5 mt-0.5" />
                          <p className="text-sm">⚠️ Payment verification can take up to 2 days.</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <button
                          onClick={handlePlaceOrder}
                          disabled={isSubmitting}
                          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'I have completed the transfer'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                  <p className="text-xl text-gray-600 mb-2">Order ID: #{orderNumber}</p>
                  
                  {formData.paymentMethod === 'Card Payment' ? (
                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-4">Payment completed successfully!</h3>
                      <p className="text-gray-600">Thank you for your purchase. We will process your order immediately.</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold text-blue-600 mb-4">Order received - awaiting payment verification</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <p className="text-blue-800 mb-4">
                          We are verifying your bank transfer. This may take up to 2 business days.
                        </p>
                        <p className="text-blue-700 mb-4">
                          You will receive an email confirmation once payment is verified.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                      to="/"
                      className="bg-burgundy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <a
                      href="mailto:standardtimepiece@gmail.com"
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  {currentStep < 3 && (
                    <button
                      onClick={nextStep}
                      className="ml-auto px-6 py-3 bg-burgundy-900 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
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
                      <p className="text-burgundy-900 font-bold">{convertPrice(orderItem.price)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{convertPrice(`${pricing.subtotal}`)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={pricing.shipping === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                    {pricing.shipping === 0 ? 'Free' : convertPrice(`${pricing.shipping}`)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-burgundy-900">{convertPrice(`${pricing.total}`)}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Final payment in USD: ${pricing.total.toFixed(2)}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-burgundy-50 rounded-lg">
                <div className="flex items-center space-x-2 text-burgundy-800">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {user ? 'Free Worldwide Shipping' : 'Shipping: $100'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">14-Day Return Policy</span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formData.customsAssistance ? 'Customs Assistance: Yes' : 'Customs Assistance Available'}
                  </span>
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