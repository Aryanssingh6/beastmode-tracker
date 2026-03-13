import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid email or password');
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side */}
      <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-400 hidden md:flex flex-col items-center justify-center p-12">
        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Zap size={64} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-black text-white mb-3">BeastMode</h2>
        <p className="text-purple-100 text-center text-lg max-w-xs">
          Welcome back! Your grind awaits. 💪
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-12 py-12 max-w-lg">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">
            Beast<span className="text-purple-500">Mode</span>
          </h1>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-400 mb-8">Login to continue your journey 🚀</p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:border-purple-400 transition-all shadow-sm"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-purple-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-300 shadow-lg hover:shadow-purple-200 hover:shadow-xl mb-6"
        >
          Login
          <ArrowRight size={16} />
        </button>

        {/* Switch to Signup */}
        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-purple-500 font-bold hover:text-purple-700 transition-all"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;