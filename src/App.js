import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Coding from './Coding';
import Studies from './Studies';
import Habits from './Habits';
import Fitness from './Fitness';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '⚡ Dashboard' },
    { id: 'coding', label: '💻 Coding' },
    { id: 'studies', label: '📚 Studies' },
    { id: 'habits', label: '🔥 Habits' },
    { id: 'fitness', label: '💪 Fitness' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase">
             BeastMode
          </h1>
          <p className="text-gray-500 text-sm">{new Date().toDateString()}</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold tracking-wide transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
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