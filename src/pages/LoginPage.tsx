import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();

  // Check if this is admin email
  const isAdminEmail = email === 'standardtimepiece@gmail.com';

  // Password validation
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const minLength = password.length >= 8;
    
    return {
      hasLetter,
      hasNumber,
      minLength,
      isValid: hasLetter && hasNumber && minLength
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        setSuccess('Successfully signed in!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        // Validate form for signup
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        
        if (!passwordValidation.isValid) {
          throw new Error('Password must be at least 8 characters long and contain both letters and numbers');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Special handling for admin email
        if (isAdminEmail) {
          setSuccess('Creating admin account...');
        }

        const result = await signUp(email, password, confirmPassword, fullName);
        
        if (result.needsVerification) {
          setSuccess('Account created! Please check your email and click the verification link to complete your registration.');
        } else {
          setSuccess('Account created successfully!');
          setTimeout(() => navigate('/'), 1000);
        }
      }
    } catch (error: any) {
      console.error("Authentication failed:", error);
      
      // Handle specific error codes
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
        if (isAdminEmail && !isLogin) {
          setError('Admin account setup: Please use a strong password with letters and numbers.');
        } else {
          setError('Invalid email or password. Please check your credentials and try again.');
        }
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox for a verification link.');
      } else if (error.message?.includes('User already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.message?.includes('Database error saving new user')) {
        setError('Account creation failed. Please try again or contact support.');
      } else if (error.message?.includes('Request rate limit reached')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-burgundy-900" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : (isAdminEmail ? 'Admin Account Setup' : 'Create Account')}
          </h2>
          <p className="text-burgundy-200">
            {isLogin ? 'Sign in to your account' : (isAdminEmail ? 'Set up your admin account' : 'Join StandardTime today')}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Admin Account Notice */}
          {isAdminEmail && !isLogin && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Admin Account Setup</span>
              </div>
              <p className="text-yellow-300 text-sm">
                You are setting up the admin account for StandardTime. This account will have full administrative privileges.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-burgundy-200" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder={isAdminEmail ? "Admin Full Name" : "Enter your full name"}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-burgundy-200" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {isAdminEmail && (
                <p className="mt-1 text-xs text-yellow-400">Admin email detected</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-burgundy-200" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder={isAdminEmail && !isLogin ? "Create admin password" : "Enter your password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-burgundy-200 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {!isLogin && password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center space-x-2 text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasLetter ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLetter ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>Contains letters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>Contains numbers</span>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-burgundy-200" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-burgundy-200 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!isLogin && (!passwordValidation.isValid || password !== confirmPassword))}
              className="w-full bg-white text-burgundy-900 py-3 px-4 rounded-lg font-medium hover:bg-burgundy-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-burgundy-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : (isAdminEmail ? 'Create Admin Account' : 'Create Account'))}
            </button>
          </form>

          <div className="mt-6">
            {isLogin && (
              <div className="text-center mb-4">
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="text-burgundy-200 hover:text-white text-sm underline disabled:opacity-50"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  // Clear form fields
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
                }}
                className="text-burgundy-200 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;