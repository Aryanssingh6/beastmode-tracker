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
import Goals from './Goals';
import Profile from './Profile';
import Analytics from './Analytics';
import AICoach from './AICoach';
import Notifications from './Notifications';
import { Home, Code2, BookOpen, Flame, Dumbbell, LogOut, Target, User, Menu, X, BarChart2, Sun, Moon } from 'lucide-react';

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSplashDone = () => {
    const saved = localStorage.getItem('currentUser');
    if (saved) { setCurrentUser(JSON.parse(saved)); setScreen('app'); }
    else setScreen('login');
  };

  const handleLogin = (user) => { setCurrentUser(user); setScreen('app'); };
  const handleSignup = (user) => { setCurrentUser(user); setScreen('app'); };
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
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const avatarColor = localStorage.getItem(`avatarColor_${currentUser?.id}`) || localStorage.getItem('avatarColor') || 'from-purple-400 to-pink-400';
  const profilePic = localStorage.getItem(`profilePic_${currentUser?.id}`);

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
      className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed h-full flex flex-col py-8 px-4 z-40 transition-all duration-300
        ${sidebarOpen ? 'w-56 left-0' : 'w-56 -left-56 md:left-0'}
        ${darkMode ? 'bg-gray-900 shadow-gray-800' : 'bg-white shadow-sm'}`}>

        {/* Logo */}
        <h1 className="text-2xl mb-8 tracking-tight px-2">
          <span className="font-black italic bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            BeastMode
          </span>
        </h1>

        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          {profilePic ? (
            <img src={profilePic} alt="profile" className="w-16 h-16 rounded-full object-cover mb-2 shadow" />
          ) : (
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center mb-2 shadow`}>
              <span className="text-white text-2xl font-bold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser?.name}</p>
          <p className="text-xs text-gray-400">Level Up Every Day</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === item.id
                    ? 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all mt-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 md:hidden relative">
          <h1 className="text-xl italic font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            BeastMode
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-all
                ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Notifications />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border
                ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-end items-center gap-3 mb-4 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-all
              ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Notifications />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} currentUser={currentUser} darkMode={darkMode} />}
            {activeTab === 'coding' && <Coding currentUser={currentUser} />}
            {activeTab === 'studies' && <Studies currentUser={currentUser} />}
            {activeTab === 'habits' && <Habits currentUser={currentUser} />}
            {activeTab === 'fitness' && <Fitness currentUser={currentUser} />}
            {activeTab === 'goals' && <Goals darkMode={darkMode} />}
            {activeTab === 'analytics' && <Analytics darkMode={darkMode} />}
            {activeTab === 'profile' && <Profile currentUser={currentUser} onUpdate={setCurrentUser} darkMode={darkMode} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Coach */}
      <AICoach currentUser={currentUser} />
    </motion.div>
  );
}

export default App;