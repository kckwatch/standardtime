import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface CartItem {
  id: number;
  brand: string;
  model: string;
  year: string;
  price: string;
  originalPrice: string;
  image: string;
  condition: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { convertPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Add quantity if not present
      const cartWithQuantity = parsedCart.map((item: any) => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setCartItems(cartWithQuantity);
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (itemId: number) => {
    const newCart = cartItems.filter(item => item.id !== itemId);
    updateCart(newCart);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    const newCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    return user?.isGuest ? 100 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // For now, we'll use the first item for checkout
    // In a real app, you'd handle multiple items
    const firstItem = cartItems[0];
    localStorage.setItem('selectedWatch', JSON.stringify(firstItem));
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/watches"
            className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>

          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some luxury watches to get started</p>
            <Link
              to="/watches"
              className="inline-flex items-center space-x-2 bg-burgundy-900 text-white px-6 py-3 rounded-lg hover:bg-burgundy-800 transition-colors"
            >
              <span>Browse Watches</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/watches"
          className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.model}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.brand}</h3>
                      <p className="text-gray-600">{item.model} ({item.year})</p>
                      <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-burgundy-900">{convertPrice(item.price)}</span>
                        <span className="text-sm text-gray-500 line-through">{convertPrice(item.originalPrice)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium">{convertPrice(`${calculateSubtotal()}`)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${calculateShipping() === 0 ? 'text-green-600' : ''}`}>
                    {calculateShipping() === 0 ? 'Free' : convertPrice(`${calculateShipping()}`)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-burgundy-900">{convertPrice(`${calculateTotal()}`)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full mt-6 bg-burgundy-900 text-white py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </button>

              <div className="mt-6 p-4 bg-burgundy-50 rounded-lg">
                <div className="flex items-center space-x-2 text-burgundy-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {user?.isGuest ? 'Shipping: $100' : 'Free Worldwide Shipping'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-burgundy-800 mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">14-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;