import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  watchName: string;
  price: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed';
  orderDate: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'confirmed'>('pending');

  useEffect(() => {
    // Mock orders data - in real app this would come from database
    const mockOrders: Order[] = [
      {
        id: 'ST-1703123456',
        customerName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY 10001, USA',
        watchName: 'Oris Big Crown Propilot Altimeter',
        price: '$1,850',
        paymentMethod: 'Wise Transfer',
        status: 'pending',
        orderDate: '2024-12-20'
      },
      {
        id: 'ST-1703123457',
        customerName: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+34-612-345-678',
        address: 'Calle Mayor 45, 28013 Madrid, Spain',
        watchName: 'Breitling Avenger Blackbird',
        price: '$3,200',
        paymentMethod: 'Bank Transfer',
        status: 'confirmed',
        orderDate: '2024-12-19'
      }
    ];
    setOrders(mockOrders);
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Link to="/" className="text-burgundy-900 hover:text-burgundy-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleMarkAsPaid = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' as const }
        : order
    ));
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.adminPanel}</h1>
          <p className="text-gray-600">Manage orders and customer payments</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.pendingOrders} ({pendingOrders.length})
              </button>
              <button
                onClick={() => setSelectedTab('confirmed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'confirmed'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.confirmedOrders} ({confirmedOrders.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {(selectedTab === 'pending' ? pendingOrders : confirmedOrders).map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status === 'pending' ? t.paymentPending : t.paymentConfirmed}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">{t.customerInfo}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{order.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{order.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{order.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">{order.address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">{t.orderDetails}</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Watch:</span>
                      <p className="font-medium text-gray-900">{order.watchName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Price:</span>
                      <p className="font-bold text-burgundy-900 text-lg">{order.price}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {order.status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Waiting for payment confirmation</span>
                    </div>
                    <button
                      onClick={() => handleMarkAsPaid(order.id)}
                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t.markAsPaid}</span>
                    </button>
                  </div>
                </div>
              )}

              {order.status === 'confirmed' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Payment confirmed - Ready to ship</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(selectedTab === 'pending' ? pendingOrders : confirmedOrders).length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {selectedTab === 'pending' ? <Clock className="h-12 w-12 mx-auto" /> : <Check className="h-12 w-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {selectedTab} orders
              </h3>
              <p className="text-gray-500">
                {selectedTab === 'pending' 
                  ? 'All orders have been processed' 
                  : 'No confirmed orders yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;