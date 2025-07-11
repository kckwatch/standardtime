import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple English translations object
const translations = {
  // Navigation
  home: "Home",
  watches: "Watches",
  about: "About",
  contact: "Contact",
  whyChooseUs: "Why Choose Us",
  payment: "Payment",
  login: "Login",
  logout: "Logout",
  account: "Account",
  admin: "Admin",
  
  // Authentication
  signIn: "Sign In",
  signUp: "Sign Up",
  signInWithGoogle: "Sign in with Google",
  signInWithEmail: "Sign in with Email",
  createAccount: "Create Account",
  password: "Password",
  confirmPassword: "Confirm Password",
  forgotPassword: "Forgot Password?",
  dontHaveAccount: "Don't have an account?",
  alreadyHaveAccount: "Already have an account?",
  signOut: "Sign Out",
  emailAddress: "Email Address",
  loading: "Loading...",
  
  // Hero Section
  heroTitle: "Premium Pre-Owned",
  heroSubtitle: "Luxury Watches",
  heroDescription: "Discover authenticated timepieces from the world's finest watchmakers. Every watch is certified, guaranteed, and backed by our lifetime support promise.",
  authenticatedCertified: "Authenticated & Certified",
  lifetimeSupport: "Lifetime Support",
  professionalWatchExpert: "Professional Watch Expert",
  worldwideFreeShipping: "Worldwide Free Shipping",
  buyerCustomAssistance: "Buyer Custom Assistance",
  browseChrono24Store: "Browse Chrono24 Store",
  viewTimepiece: "View Timepiece",
  
  // Featured Watches
  featuredTimepieces: "Featured Timepieces",
  featuredDescription: "Carefully curated selection of authenticated luxury watches. Each piece has been thoroughly inspected and comes with our guarantee of authenticity.",
  viewDetails: "View Details",
  quickView: "Quick View",
  viewOnChrono24: "View on Chrono24",
  viewAllWatches: "View All Watches",
  viewAllOnChrono24: "View All on Chrono24",
  
  // Trust Indicators
  trustedByCollectors: "Trusted by Collectors Worldwide",
  trustDescription: "Our commitment to authenticity, quality, and customer satisfaction has made us a trusted name in the luxury watch community.",
  happyCustomers: "Happy Customers",
  authenticGuarantee: "Authentic Guarantee",
  customerRating: "Customer Rating",
  ourGuarantees: "Our Guarantees",
  authenticityGuarantee: "Authenticity Guarantee",
  authenticityDescription: "Every watch is authenticated by expertise.",
  returnPolicy: "15-Day Return Policy",
  returnDescription: "Not satisfied? Return your watch within 15 days for a full refund.",
  lifetimeSupportTitle: "Lifetime Support",
  lifetimeSupportDescription: "Ongoing support for maintenance, servicing, and future upgrades.",
  whatCustomersSay: "What Our Customers Say",
  findUsOnChrono24: "Find Us on Chrono24",
  chrono24Description: "We're verified sellers on Chrono24, the world's leading marketplace for luxury watches. Our stellar reputation and customer feedback speak for themselves.",
  viewChrono24Profile: "View Our Chrono24 Profile",
  
  // Payment Options
  securePaymentOptions: "Secure Payment Options",
  paymentDescription: "We offer multiple secure payment methods for your convenience, including international transfers with competitive rates.",
  wiseTransfer: "Wise Transfer",
  bankTransfer: "Bank Transfer",
  recommendedForInternational: "Recommended for International Buyers",
  traditionalBanking: "Traditional Banking",
  cheaperThanBanks: "Up to 8x cheaper than traditional banks",
  realExchangeRates: "Real exchange rates, no hidden fees",
  fastSecureTransfers: "Fast and secure international transfers",
  regulatedByAuthorities: "Regulated by financial authorities",
  ourWiseDetails: "Our Wise Details:",
  accountName: "Account Name",
  specificDetailsProvided: "* Specific account details will be provided after purchase confirmation",
  payWithWise: "Pay with Wise",
  secureTransfer: "Secure bank-to-bank transfer",
  establishedMethod: "Established payment method",
  availableWorldwide: "Available worldwide",
  higherFeesInternational: "Higher fees for international transfers",
  bankDetails: "Bank Details:",
  bankDetailsProvided: "* Bank details will be provided after purchase confirmation",
  payViaBankTransfer: "Pay via Bank Transfer",
  howPaymentWorks: "How Payment Works",
  contactUs: "Contact Us",
  contactUsDescription: "Reach out about the watch you're interested in purchasing",
  receiveDetails: "Receive Details",
  receiveDetailsDescription: "We'll provide payment details and final pricing",
  makePayment: "Make Payment",
  makePaymentDescription: "Transfer funds via your preferred method",
  receiveWatch: "Receive Watch",
  receiveWatchDescription: "Your watch ships immediately after payment confirmation",
  secureProtected: "Secure & Protected",
  securityNotice: "All payments are processed securely. We never store your financial information and all transactions are protected by banking regulations and our authenticity guarantee.",
  
  // About Section
  aboutStandardTime: "About StandardTime",
  aboutDescription1: "Founded on a passion for exceptional timepieces, StandardTime has been serving watch enthusiasts and collectors worldwide. We specialize in authenticated pre-owned luxury watches, ensuring every piece meets the highest standards of quality and authenticity.",
  aboutDescription2: "decades of experience in horology, with certified authentication processes and partnerships with leading watch manufacturers. Every watch in our collection is carefully selected, thoroughly inspected, and backed by our lifetime guarantee.",
  expertAuthentication: "Expert Authentication",
  certifiedByExperts: "Certified by Experts",
  qualityGuarantee: "Quality Guarantee",
  authenticityPromise: "authenticity promise",
  personalService: "Personal Service",
  dedicatedSupport: "Dedicated customer support",
  passionDriven: "Passion Driven",
  loveForTimepieces: "Love for exceptional timepieces",
  ourMission: "Our Mission",
  missionStatement: "To provide watch enthusiasts with authenticated, premium pre-owned timepieces for great price while delivering exceptional customer service and building lasting relationships within the watch collecting community. We believe every great watch has a story, and we're here to help you find yours.",
  
  // Contact Section
  getInTouch: "Get In Touch",
  contactDescription: "Ready to find your perfect timepiece? Contact us for personalized service, expert advice, or any questions about our collection.",
  contactInformation: "Contact Information",
  email: "Email",
  respondWithin4Hours: "We respond within 4 hours",
  phone: "Phone",
  businessHours: "Mon-Sun 9AM-11PM KST",
  chrono24Messaging: "Chrono24 Messaging",
  contactDirectly: "Contact us directly through our Chrono24 profile",
  messageOnChrono24: "Message us on Chrono24 →",
  businessHoursTitle: "Business Hours",
  mondayToSunday: "Monday - Sunday: 9:00 AM - 11:00 PM KST",
  ourServices: "Our Services",
  watchAuthentication: "• Watch authentication and certification",
  prePurchaseConsultation: "• Pre-purchase consultation",
  tradeInEvaluations: "• Trade-in evaluations",
  watchSourcing: "• Watch sourcing and acquisition",
  maintenanceReferrals: "• Maintenance and service referrals",
  collectionManagement: "• Collection management advice",
  sendMessage: "Send us a Message",
  firstName: "First Name",
  lastName: "Last Name",
  subject: "Subject",
  selectSubject: "Select a subject",
  generalInquiry: "General Inquiry",
  purchaseQuestion: "Purchase Question",
  authenticationRequest: "Authentication Request",
  tradeInEvaluation: "Trade-in Evaluation",
  serviceQuestion: "Service Question",
  message: "Message",
  messagePlaceholder: "Tell us about the watch you're interested in or how we can help you...",
  sendMessageButton: "Send Message",
  
  // Footer
  trustedByCollectorsFooter: "Trusted by collectors worldwide for authenticated luxury watches. Professional watch expert with lifetime support and worldwide free shipping.",
  quickLinks: "Quick Links",
  featuredWatches: "Featured Watches",
  aboutUs: "About Us",
  ourChrono24Profile: "Our Chrono24 Profile",
  hours: "Hours:",
  allRightsReserved: "© 2024 StandardTime. All rights reserved. | www.standardtimepiece.com",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  authenticityGuaranteeFooter: "Authenticity Guarantee",
  
  // Checkout
  checkout: "Checkout",
  personalInfo: "Personal Information",
  paymentMethod: "Payment Method",
  orderReview: "Order Review",
  completion: "Completion",
  
  // Form Fields
  fullName: "Full Name",
  country: "Country",
  address: "Address",
  city: "City",
  postalCode: "Postal Code",
  phoneNumber: "Phone Number",
  
  // Payment
  selectPayment: "Select Payment Method",
  recommended: "Recommended",
  lowerFees: "Lower fees, better exchange rates",
  traditional: "Traditional banking method",
  
  // Order
  orderSummary: "Order Summary",
  subtotal: "Subtotal",
  shipping: "Shipping",
  total: "Total",
  free: "Free",
  
  // Actions
  continue: "Continue",
  back: "Back",
  placeOrder: "Place Order",
  confirmPayment: "Confirm Payment Received",
  downloadReceipt: "Download Receipt",
  buyNow: "Buy Now",
  addToCart: "Add to Cart",
  
  // Status
  orderPlaced: "Order Placed Successfully!",
  paymentPending: "Payment Pending",
  paymentConfirmed: "Payment Confirmed",
  orderComplete: "Order Complete",
  
  // Messages
  thankYou: "Thank you for your order!",
  paymentInstructions: "Please transfer the payment using the details below:",
  orderProcessing: "We will process your order once payment is confirmed.",
  
  // Validation
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number",
  
  // Admin
  adminPanel: "Admin Panel",
  orderManagement: "Order Management",
  pendingOrders: "Pending Orders",
  confirmedOrders: "Confirmed Orders",
  markAsPaid: "Mark as Paid",
  orderDetails: "Order Details",
  customerInfo: "Customer Information",
  
  // Watch Details
  specifications: "Specifications",
  description: "Description",
  condition: "Condition",
  features: "Features",
  ourGuarantee: "Our Guarantee",
  guaranteeDescription: "This timepiece comes with our lifetime authenticity guarantee and 14-day return policy. All watches are professionally authenticated and inspected by our expert team.",
  purchaseOnChrono24: "Purchase on Chrono24",
  contactForPayment: "Contact for Payment Details",
  
  // Live Chat
  standardTimeSupport: "StandardTime Support",
  usuallyReplies: "Usually replies instantly",
  quickQuestions: "Quick questions:",
  interestedInWatch: "I'm interested in a specific watch",
  internationalShipping: "Do you offer international shipping?",
  helpWithCustoms: "Can you help me with lowering custom when receiving watch?",
  paymentMethods: "What payment methods do you accept?",
  typeMessage: "Type your message...",
  callUs: "Call Us",
  emailUs: "Email Us",
  
  // Errors and Loading
  watchNotFound: "Watch Not Found",
  returnToHome: "Return to Home",
  error: "Error",
  tryAgain: "Try Again",
  
  // Filters and Sorting
  sortBy: "Sort by:",
  priceLowToHigh: "Price: Low to High",
  priceHighToLow: "Price: High to Low",
  mostPopular: "Most Popular",
  showOnlyNew: "Show Only New / Unworn",
  cantFindWatch: "Can't Find What You're Looking For?",
  cantFindDescription: "We have access to an extensive network of luxury watch dealers and collectors. Let us help you find your perfect timepiece.",
  browseFullStore: "Browse Our Full Chrono24 Store",
  contactForCustom: "Contact Us for Custom Requests",
  
  // Separate Pages
  paymentOptionsPage: "Payment Options",
  whyChooseUsPage: "Why Choose Us",
  aboutUsPage: "About Us",
  contactPage: "Contact",
  backToStore: "Back to Store"
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};