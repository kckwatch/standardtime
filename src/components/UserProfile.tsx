import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Save, X, Package, Eye, Calendar, Truck, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Order {
  id: string;
  order_number: string;
  watch_brand: string;
  watch_model: string;
  watch_year: string;
  total: number;
  status: 'pending' | 'payment_approved' | 'shipping_in_progress' | 'delivery_completed';
  tracking_number?: string;
  order_date: string;
  payment_approved_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch user profile
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, display_name, phone, address, city, country, is_admin, created_at, updated_at')
          .eq('id', user.id)
          .limit(1);
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError);
        }

        const profile = profiles && profiles.length > 0 ? profiles[0] : null;

        // Create profile if it doesn't exist
        if (!profile) {
          const newProfile = {
            id: user.id,
            email: user.email || '',
            display_name: user.displayName || '',
            is_admin: user.isAdmin || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }

          setUserData(newProfile);
          setEditedData(newProfile);
        } else {
          setUserData(profile);
          setEditedData(profile);
        }

        // Fetch user orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('order_date', { ascending: false });
        
        if (ordersError) {
          console.error('Error loading orders:', ordersError);
        } else {
          setUserOrders(orders || []);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setError('Failed to load user data');
      }
    };
    
    if (isOpen) {
      fetchUserData();
    }
  }, [user, isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force logout even if there's an error
      onClose();
      window.location.href = '/';
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updateData = {
        ...editedData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      setUserData(prev => ({ ...prev, ...editedData } as UserData));
      setSuccess('Profile information saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save profile information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_approved':
        return 'bg-blue-100 text-blue-800';
      case 'shipping_in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'delivery_completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Calendar className="h-4 w-4" />;
      case 'payment_approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipping_in_progress':
        return <Truck className="h-4 w-4" />;
      case 'delivery_completed':
        return <Package className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment Pending';
      case 'payment_approved':
        return 'Payment Approved';
      case 'shipping_in_progress':
        return 'Shipping in Progress';
      case 'delivery_completed':
        return 'Delivery Completed';
      default:
        return status;
    }
  };

  const hasProfileInfo = userData?.phone || userData?.address || userData?.city || userData?.country;

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-8 overflow-y-auto max-h-[90vh]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-burgundy-900" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {userData?.display_name || user.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-gray-500">
                {userData?.email || user.email}
              </p>
              
              {userData?.created_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Member since {new Date(userData.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Profile/Orders Toggle - Only show for non-admin users */}
            {!userData?.is_admin && (
              <div className="mb-6 flex space-x-2">
                <button
                  onClick={() => setShowOrders(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    !showOrders 
                      ? 'bg-burgundy-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setShowOrders(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    showOrders 
                      ? 'bg-burgundy-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My Orders ({userOrders.length})
                </button>
              </div>
            )}

            {/* Profile Section */}
            {!showOrders && (
              <div className="space-y-6">
                {/* Profile Information Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData?.email || user.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedData.display_name || ''}
                      onChange={(e) => handleInputChange('display_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editedData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editedData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      placeholder="Enter your country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={editedData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editedData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 bg-burgundy-900 text-white py-3 rounded-lg font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                      <span>{loading ? 'Saving...' : 'Save Information'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Orders Section */}
            {showOrders && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">My Orders</h3>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                    <p className="text-gray-500">When you make a purchase, your orders will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">Order #{order.order_number}</h4>
                            <p className="text-sm text-gray-600">
                              {order.watch_brand} {order.watch_model} ({order.watch_year})
                            </p>
                            <p className="text-sm font-medium text-burgundy-900">${order.total}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span>{formatStatus(order.status)}</span>
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${order.order_date ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-gray-600">Order Placed</span>
                            {order.order_date && (
                              <span className="text-gray-500">
                                {new Date(order.order_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${order.payment_approved_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-gray-600">Payment Approved</span>
                            {order.payment_approved_at && (
                              <span className="text-gray-500">
                                {new Date(order.payment_approved_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${order.shipped_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-gray-600">Shipping Started</span>
                            {order.shipped_at && (
                              <span className="text-gray-500">
                                {new Date(order.shipped_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${order.delivered_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-gray-600">Delivery Completed</span>
                            {order.delivered_at && (
                              <span className="text-gray-500">
                                {new Date(order.delivered_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tracking Number */}
                        {order.tracking_number && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Tracking Number:</span>
                              <span className="text-sm text-blue-700 font-mono">{order.tracking_number}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;