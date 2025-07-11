import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedWatches from './components/FeaturedWatches';
import TrustIndicators from './components/TrustIndicators';
import PaymentOptions from './components/PaymentOptions';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WatchDetail from './components/WatchDetail';
import WatchesPage from './components/WatchesPage';
import AboutPage from './pages/AboutPage';
import TrustPage from './pages/TrustPage';
import ContactPage from './pages/ContactPage';
import PaymentPage from './pages/PaymentPage';
import Checkout from './pages/Checkout';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CartPage from './components/CartPage';
import AdminPanel from './pages/AdminPanel';
import LiveChat from './components/LiveChat';
import LoginPage from './pages/LoginPage';

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWatches />
      <TrustIndicators />
      <PaymentOptions />
      <About />
      <Contact />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watches" element={<WatchesPage />} />
                <Route path="/watch/:id" element={<WatchDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Routes>
              <Footer />
              <LiveChat />
            </div>
          </Router>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;