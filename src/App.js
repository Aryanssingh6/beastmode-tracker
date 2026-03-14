import React, { useState, useEffect } from 'react';
import './index.css';
import { AnimatePresence, motion } from 'framer-motion';
import Splash from './Splash';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Coding from './Coding';
import Studies from './Studies';
import Habits from './Habits';
import Fitness from './Fitness';
import AICoach from './AICoach';
import { Home, Code2, BookOpen, Flame, Dumbbell, LogOut } from 'lucide-react';

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleSplashDone = () => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setScreen('app');
    } else {
      setScreen('login');
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen('app');
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setScreen('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setScreen('splash');
    setActiveTab('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'coding', label: 'Coding', icon: Code2 },
    { id: 'studies', label: 'Studies', icon: BookOpen },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  ];

  if (screen !== 'app') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'fixed', width: '100%', height: '100%' }}
        >
          {screen === 'splash' && <Splash onDone={handleSplashDone} />}
          {screen === 'login' && <Login onLogin={handleLogin} onSwitchToSignup={() => setScreen('signup')} />}
          {screen === 'signup' && <Signup onSignup={handleSignup} onSwitchToLogin={() => setScreen('login')} />}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      key="app"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex min-h-screen bg-gray-100 font-sans"
    >
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-sm flex flex-col py-8 px-4 fixed h-full">
        <h1 className="text-2xl font-black text-gray-900 mb-8 tracking-tight px-2">
          Beast<span className="text-purple-500">Mode</span>
        </h1>

        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-2 shadow">
            <span className="text-white text-2xl font-bold">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="font-semibold text-gray-800 text-sm">{currentUser?.name}</p>
          <p className="text-xs text-gray-400">Level Up Every Day</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-56 flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} currentUser={currentUser} />}
            {activeTab === 'coding' && <Coding />}
            {activeTab === 'studies' && <Studies />}
            {activeTab === 'habits' && <Habits />}
            {activeTab === 'fitness' && <Fitness />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Coach */}
      <AICoach currentUser={currentUser} />
    </motion.div>
  );
}

export default App;