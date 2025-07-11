import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'customer' | 'admin';
  created_at: string;
  customer_email?: string;
  customer_name?: string;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  const customerEmail = user?.email || '';
  const customerName = user?.displayName || user?.email?.split('@')[0] || 'Guest';

  useEffect(() => {
    if (!isOpen || !customerEmail) return;

    // Fetch messages for this customer
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for:', customerEmail);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('customer_email', customerEmail)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error fetching messages:', error);
          // Don't return early, just log the error
          console.log('Continuing with empty messages array');
          setMessages([]);
          return;
        }
        
        console.log('Messages fetched:', data);
        setMessages(data || []);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `customer_email=eq.${customerEmail}`
        }, 
        (payload) => {
          console.log('Real-time message received:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen, customerEmail]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        if (!customerEmail) {
          console.log('No customer email, cannot send message');
          return;
        }

        console.log('Sending message:', message, customerEmail, customerName);

        // Add message to Supabase
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            message: message.trim(),
            sender: 'customer',
            customer_email: customerEmail,
            customer_name: customerName
          });

        if (error) {
          console.error('Error sending message:', error);
          // Don't throw error, just log it
          console.log('Message send failed, but continuing');
          return;
        }
        
        console.log('Message sent successfully');
        setMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
        console.log('Chat error handled gracefully');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickMessages = [
    "I'm interested in a specific watch",
    "Do you offer international shipping?",
    "Can you help me with customs fees?",
    "What payment methods do you accept?"
  ];

  const handleQuickMessage = (quickMsg: string) => {
    setMessage(quickMsg);
  };

  return (
    <>
      {/* Chat Widget Button */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50">
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-burgundy-900 hover:bg-burgundy-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && user && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-burgundy-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-burgundy-900" />
              </div>
              <div>
                <h3 className="font-bold">StandardTime Support</h3>
                <p className="text-sm text-burgundy-200">Usually replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-200">
                  <p className="text-sm">Hello {customerName}! Welcome to StandardTime. I'm here to help you find the perfect luxury timepiece. How can I assist you today?</p>
                  <p className="text-xs mt-1 text-gray-500">Now</p>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'customer'
                      ? 'bg-burgundy-900 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'customer' ? 'text-burgundy-200' : 'text-gray-500'
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Messages */}
          {messages.length === 0 && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
              <div className="space-y-2">
                {quickMessages.slice(0, 3).map((quickMsg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(quickMsg)}
                    className="w-full text-left text-sm p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {quickMsg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-burgundy-900 text-white p-2 rounded-lg hover:bg-burgundy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Contact Options */}
            <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-gray-100">
              <a
                href="tel:+821087161870"
                className="flex items-center space-x-1 text-sm text-burgundy-900 hover:text-burgundy-700"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:standardtimepiece@gmail.com"
                className="flex items-center space-x-1 text-sm text-burgundy-900 hover:text-burgundy-700"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;