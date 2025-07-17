import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, User, Mail, Phone, MapPin, MessageCircle, Send, Users, ShoppingBag, DollarSign, Eye, Filter, X, Truck, Package, Calendar, Edit, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  watch_brand: string;
  watch_model: string;
  price: string;
  total: number;
  payment_method: string;
  customs_assistance: boolean;
  status: 'pending' | 'confirmed' | 'photos_sent' | 'shipped' | 'delivered';
  tracking_number?: string;
  order_date: string;
  confirmed_at?: string;
  photos_sent_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface Member {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  is_admin: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'customer' | 'admin';
  customer_email: string;
  customer_name: string;
  created_at: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'orders' | 'completed' | 'members' | 'chat'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [editingTrackingNumber, setEditingTrackingNumber] = useState<string>('');
  const [newTrackingNumber, setNewTrackingNumber] = useState<string>('');
  const [deletingMember, setDeletingMember] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = user?.isAdmin || user?.email === 'standardtimepiece@gmail.com';
    
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
    
    fetchOrders();
    fetchMembers();
    fetchChatMessages();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending'])
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        return;
      }
     

      console.log('Orders fetched:', data);
      setOrders(data || []);

      // Fetch completed orders
      const { data: completedData, error: completedError } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['confirmed', 'photos_sent', 'shipped', 'delivered'])
        .order('created_at', { ascending: false });
      
      if (completedError) {
        console.error('Error fetching completed orders:', completedError);
        setCompletedOrders([]);
        return;
      }
      
      setCompletedOrders(completedData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setCompletedOrders([]);
    }
  };

  const fetchMembers = async () => {
    try {
      console.log('Fetching members...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching members:', profilesError);
        setMembers([]);
        return;
      }
      
      console.log('Members fetched:', profilesData);
      setMembers(profilesData || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  };

  const fetchChatMessages = async () => {
    try {
      console.log('Fetching chat messages...');
      const { data: chatData, error: chatError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (chatError) {
        console.error('Error fetching chat messages:', chatError);
        setChatMessages([]);
        return;
      }
      
      console.log('Chat messages fetched:', chatData);
      setChatMessages(chatData || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setChatMessages([]);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      setLoading(true);
      console.log('Confirming order:', orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        console.error('Error confirming order:', error);
        throw error;
      }
      
      console.log('Order confirmed successfully');
      
      // Refresh orders
      fetchOrders();
      alert('Order confirmed successfully! Confirmation email will be sent to the customer.');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);
      console.log('Updating order status:', orderId, newStatus);
      
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add timestamp for specific statuses
      if (newStatus === 'photos_sent') {
        updateData.photos_sent_at = new Date().toISOString();
      } else if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
      
      console.log('Order status updated successfully');
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setEditingTrackingNumber('');
      setNewTrackingNumber('');
      fetchOrders();
    } catch (error) {
      console.error('Error updating tracking number:', error);
      alert('Failed to update tracking number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setDeletingMember(memberId);

      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;

      // Refresh members list
      fetchMembers();
      alert('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
    } finally {
      setLoading(false);
      setDeletingMember('');
    }
  };

  const handleSendChatMessage = async () => {
    if (!newMessage.trim() || !selectedCustomer) return;
    
    try {
      console.log('Sending chat message:', newMessage, selectedCustomer);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          message: newMessage.trim(),
          sender: 'admin',
          customer_email: selectedCustomer,
          customer_name: 'Admin',
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      console.log('Message sent successfully');
      setNewMessage('');
      fetchChatMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'photos_sent':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'photos_sent':
        return 'Photos & Videos Sent';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  // Check if user is admin
  const isAdmin = user?.isAdmin || user?.email === 'standardtimepiece@gmail.com';
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need to be signed in as an admin to access this page.
            {user ? ` Current user: ${user.email}` : ' Please sign in first.'}
          </p>
          <Link to="/" className="text-burgundy-900 hover:text-burgundy-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-burgundy-900 hover:text-burgundy-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage orders, members, and chat messages
            {user && <span className="ml-2 text-sm">(Logged in as: {user.email})</span>}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'orders'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                New Orders ({orders.length})
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'completed'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed Orders ({completedOrders.length})
              </button>
              <button
                onClick={() => setSelectedTab('members')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'members'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Members ({members.length})
              </button>
              <button
                onClick={() => setSelectedTab('chat')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'chat'
                    ? 'border-burgundy-500 text-burgundy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Live Chat ({chatMessages.length})
              </button>
            </nav>
          </div>
        </div>

        {/* New Orders Tab */}
        {selectedTab === 'orders' && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Customer Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {order.customer_name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
                      
                   <p><strong>Address:</strong> {order.address || 'N/A'}, {order.city || 'N/A'}, {order.country || 'N/A'}</p>

                      <p><strong>Postal Code:</strong> {order.postal_code || 'N/A'}</p>
                      <p><strong>Customs Assistance:</strong> {order.customs_assistance ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {/* Order Details */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Watch:</strong> {order.watch_brand} {order.watch_model}</p>
                      <p><strong>Price:</strong> {order.price}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                      <p><strong>Payment Method:</strong> {order.payment_method}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Actions</h4>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        disabled={loading}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        <span>Confirm Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No new orders</h3>
                <p className="text-gray-500">New orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Orders Tab */}
        {selectedTab === 'completed' && (
          <div className="space-y-6">
            {completedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Customer Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {order.customer_name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Watch:</strong> {order.watch_brand} {order.watch_model}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order.confirmed_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Confirmed</span>
                        {order.confirmed_at && (
                          <span className="text-gray-500">
                            {new Date(order.confirmed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order.photos_sent_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Photos & Videos Sent</span>
                        {order.photos_sent_at && (
                          <span className="text-gray-500">
                            {new Date(order.photos_sent_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order.shipped_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Shipped</span>
                        {order.shipped_at && (
                          <span className="text-gray-500">
                            {new Date(order.shipped_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order.delivered_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Delivered</span>
                        {order.delivered_at && (
                          <span className="text-gray-500">
                            {new Date(order.delivered_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Update Status</h4>
                    <div className="space-y-2">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'photos_sent')}
                          disabled={loading}
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                          Mark Photos Sent
                        </button>
                      )}
                      
                      {order.status === 'photos_sent' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                          disabled={loading}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          disabled={loading}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {/* Tracking Number Section */}
                      <div className="mt-4">
                        {editingTrackingNumber === order.id ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newTrackingNumber}
                              onChange={(e) => setNewTrackingNumber(e.target.value)}
                              placeholder="Enter tracking number"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleUpdateTrackingNumber(order.id, newTrackingNumber)}
                              disabled={!newTrackingNumber.trim() || loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingTrackingNumber('');
                                setNewTrackingNumber('');
                              }}
                              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : order.tracking_number ? (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Tracking:</span>
                              <span className="text-sm text-blue-700 font-mono">{order.tracking_number}</span>
                              <button
                                onClick={() => {
                                  setEditingTrackingNumber(order.id);
                                  setNewTrackingNumber(order.tracking_number || '');
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingTrackingNumber(order.id)}
                            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg py-2"
                          >
                            Add Tracking Number
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {completedOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders</h3>
                <p className="text-gray-500">Confirmed orders will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {selectedTab === 'members' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Members</h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-gray-900">{member.display_name || 'No name'}</h3>
                        {member.is_admin && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">{member.email}</p>
                      {member.phone && (
                        <p className="text-sm text-gray-500">Phone: {member.phone}</p>
                      )}
                      {(member.address || member.city || member.country) && (
                        <p className="text-sm text-gray-500">
                          Address: {[member.address, member.city, member.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Joined: {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {!member.is_admin && (
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={loading || deletingMember === member.id}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                      >
                        {deletingMember === member.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {members.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                  <p className="text-gray-500">Registered members will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Chat Tab */}
        {selectedTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Live Chat Messages</h2>
            
            {/* Customer Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              >
                <option value="">Select a customer...</option>
                {Array.from(new Set(chatMessages.map(msg => msg.customer_email).filter(Boolean))).map(email => (
                  <option key={email} value={email}>{email}</option>
                ))}
              </select>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {chatMessages
                .filter(msg => !selectedCustomer || msg.customer_email === selectedCustomer)
                .map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'admin'
                      ? 'bg-burgundy-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'admin' ? 'text-burgundy-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                    {message.sender === 'customer' && (
                      <p className="text-xs text-gray-500">
                        {message.customer_name} ({message.customer_email})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Send Message */}
            {selectedCustomer && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!newMessage.trim()}
                  className="bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chat messages yet</h3>
                <p className="text-gray-500">Customer messages will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;