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
import Pomodoro from './Pomodoro';
import Notifications from './Notifications';
import toast from 'react-hot-toast';
import { Home, Code2, BookOpen, Flame, Dumbbell, LogOut, Target, User, Menu, X, BarChart2, Sun, Moon } from 'lucide-react';

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export const getLevel = (xp) => {
  if (!xp) return { level: 1, currentXP: 0, nextXP: 100, progress: 0, title: 'Novice Tracker' };
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const currentXP = xp - currentLevelXP;
  const nextXP = nextLevelXP - currentLevelXP;
  
  const titles = ['Novice Tracker', 'Consistent Beginner', 'Habit Builder', 'Discipline Master', 'Unstoppable Force', 'Beast Mode'];
  const title = titles[Math.min(level - 1, titles.length - 1)];

  return { level, currentXP, nextXP, progress: (currentXP / nextXP) * 100, title };
};

export const addXP = (userId, amount) => {
  const currentXP = parseInt(localStorage.getItem(`xp_${userId}`)) || 0;
  const newXP = currentXP + amount;
  localStorage.setItem(`xp_${userId}`, newXP);
  
  const oldLevel = getLevel(currentXP).level;
  const newLevel = getLevel(newXP).level;
  
  if (newLevel > oldLevel) {
    toast.success(`🎉 Level Up! You reached Level ${newLevel}!`, { duration: 4000, icon: '🏆' });
  }
  return newXP;
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
      className={`flex min-h-screen font-sans relative overflow-hidden ${darkMode ? 'bg-black text-white' : 'bg-gray-100'}`}
    >
      {/* Premium Background Orbs for Dark Mode */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed h-full flex flex-col py-6 px-4 z-40 transition-all duration-300 border-r
        ${sidebarOpen ? 'w-64 left-0' : 'w-64 -left-64 md:left-0'}
        ${darkMode ? 'bg-[#030303]/90 backdrop-blur-md border-white/5' : 'bg-gray-50 border-gray-200'}`}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            BeastMode
          </h1>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {profilePic ? (
              <img src={profilePic} alt="profile" className="w-16 h-16 rounded-full object-cover mb-2 shadow" />
            ) : (
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center mb-2 shadow`}>
                <span className="text-white text-2xl font-bold">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white dark:border-[#111]">
              Lvl {getLevel(parseInt(localStorage.getItem(`xp_${currentUser?.id}`)) || 0).level}
            </div>
          </div>
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser?.name}</p>
          <p className="text-xs text-gray-400 font-medium">{getLevel(parseInt(localStorage.getItem(`xp_${currentUser?.id}`)) || 0).title}</p>
          
          <div className="w-full px-4 mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mb-1">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getLevel(parseInt(localStorage.getItem(`xp_${currentUser?.id}`)) || 0).progress}%` }}></div>
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider">
              {getLevel(parseInt(localStorage.getItem(`xp_${currentUser?.id}`)) || 0).currentXP} / {getLevel(parseInt(localStorage.getItem(`xp_${currentUser?.id}`)) || 0).nextXP} XP
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto w-full">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === item.id
                    ? darkMode ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-white shadow-sm border border-gray-200 text-gray-900'
                    : darkMode
                      ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <Icon size={18} className={activeTab === item.id && darkMode ? "text-cyan-400" : ""} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mt-4 w-full
            ${darkMode ? 'text-gray-500 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className={`md:ml-64 flex-1 flex flex-col min-h-screen relative z-10 ${darkMode ? 'bg-transparent' : 'bg-white'}`}>

        {/* Mobile Header */}
        <div className={`flex items-center justify-between p-4 md:hidden relative backdrop-blur-md border-b ${darkMode ? 'border-white/5 bg-black/50' : 'border-gray-100 bg-white/80'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
               <span className="text-white font-bold">B</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              BeastMode
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                ${darkMode ? 'bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Notifications />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                ${darkMode ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className={`hidden md:flex justify-between items-center px-8 py-5 border-b backdrop-blur-md sticky top-0 z-20 transition-all
          ${darkMode ? 'border-white/5 bg-black/50' : 'border-gray-100 bg-white/80'}`}>
          <div className={`text-sm font-semibold capitalize flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <span className={darkMode ? 'w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'w-2 h-2 rounded-full bg-blue-500'} />
            {activeTab}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                ${darkMode ? 'text-gray-400 hover:text-yellow-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Notifications />
          </div>
        </div>

        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">

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
      </div>

      {/* Advanced Features */}
      <AICoach currentUser={currentUser} />
      <Pomodoro />
    </motion.div>
  );
}

export default App;