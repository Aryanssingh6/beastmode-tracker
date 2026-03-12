import React, { useState } from 'react';
import './index.css';
import Dashboard from './Dashboard';
import Coding from './Coding';
import Studies from './Studies';
import Habits from './Habits';
import Fitness from './Fitness';
import { Home, Code2, BookOpen, Flame, Dumbbell } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'coding', label: 'Coding', icon: Code2 },
    { id: 'studies', label: 'Studies', icon: BookOpen },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-sm flex flex-col py-8 px-4 fixed h-full">
        <h1 className="text-2xl font-black text-gray-900 mb-8 tracking-tight px-2">
          Beast<span className="text-purple-500">Mode</span>
        </h1>

        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-2 shadow">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <p className="font-semibold text-gray-800 text-sm">Aryan Singh</p>
          <p className="text-xs text-gray-400">Level Up Every Day</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
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
      </div>

      {/* Main Content */}
      <div className="ml-56 flex-1 p-8">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'coding' && <Coding />}
        {activeTab === 'studies' && <Studies />}
        {activeTab === 'habits' && <Habits />}
        {activeTab === 'fitness' && <Fitness />}
      </div>
    </div>
  );
}

export default App;