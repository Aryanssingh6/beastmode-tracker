import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const user = {
        id: userCredential.user.uid,
        name,
        email,
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      onSignup(user);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email already registered');
      else if (err.code === 'auth/weak-password') setError('Password too weak');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address');
      else setError('Something went wrong. Try again!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side */}
      <div className="flex-1 bg-gray-900 hidden md:flex flex-col items-center justify-center gap-6">
        <div className="w-28 h-28 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center shadow-2xl">
          <Zap size={64} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-5xl font-black italic bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
          BeastMode
        </h2>
        <p className="text-gray-500 text-lg tracking-widest uppercase">
          Level Up Every Day
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black italic bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            BeastMode
          </h1>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Start your journey today 💪</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="relative">
            <User size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-400 transition-all shadow-sm"
            />
          </div>
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
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
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

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-purple-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-300 shadow-lg mb-6 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight size={16} />}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-500 font-bold hover:text-purple-700 transition-all"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;