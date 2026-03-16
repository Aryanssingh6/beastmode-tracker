import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || email.split('@')[0],
        email: userCredential.user.email,
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      onLogin(user);
    } catch (err) {
      if (err.code === 'auth/user-not-found') toast.error('No account found with this email');
      else if (err.code === 'auth/wrong-password') toast.error('Wrong password');
      else if (err.code === 'auth/invalid-credential') toast.error('Invalid email or password');
      else toast.error('Something went wrong. Try again!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000] flex relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Side */}
      <div className="flex-1 bg-transparent hidden md:flex flex-col items-center justify-center gap-6 relative z-10 border-r border-gray-800/50">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20" />
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-white/10 relative z-10">
            <Zap size={48} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          BeastMode <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tracker</span>
        </h2>
        <p className="text-gray-400 text-sm tracking-[0.2em] font-medium uppercase">
          Detect The Truth Within
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 bg-transparent relative z-10">
        <div className="mb-10 block md:hidden">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            BeastMode <span className="text-cyan-400">Tracker</span>
          </h1>
        </div>

        <div className="bg-[#050505] border border-gray-800/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Welcome back</h2>
          <p className="text-gray-400 mb-8 text-sm relative z-10">Sign in to your account to continue</p>

        <div className="space-y-4 mb-6 relative z-10">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-500 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-500 rounded-lg pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium py-3 rounded-full text-sm transition-all mb-6 disabled:opacity-50 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] relative z-10"
        >
          {loading ? 'Authenticating...' : 'Sign in'}
          {!loading && <ArrowRight size={16} />}
        </button>

        <p className="text-center text-gray-500 text-sm relative z-10">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]"
          >
            Sign up
          </button>
        </p>
        
        </div>
      </div>
    </div>
  );
}

export default Login;