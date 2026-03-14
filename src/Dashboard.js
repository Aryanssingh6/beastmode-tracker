import React, { useState } from 'react';
import { Code2, BookOpen, Flame, Dumbbell, TrendingUp, Target } from 'lucide-react';
import Heatmap from './Heatmap';

function Dashboard({ setActiveTab, currentUser }) {
  const [activeDay, setActiveDay] = useState('Weekly');

  const stats = [
    { label: 'Coding', key: 'coding', icon: Code2, color: 'bg-purple-100', textColor: 'text-purple-500', iconColor: 'text-purple-400' },
    { label: 'Studies', key: 'studies', icon: BookOpen, color: 'bg-blue-100', textColor: 'text-blue-500', iconColor: 'text-blue-400' },
    { label: 'Habits', key: 'habits', icon: Flame, color: 'bg-orange-100', textColor: 'text-orange-500', iconColor: 'text-orange-400' },
    { label: 'Fitness', key: 'fitness', icon: Dumbbell, color: 'bg-green-100', textColor: 'text-green-500', iconColor: 'text-green-400' },
  ];

  const getCount = (key) => {
    return JSON.parse(localStorage.getItem(key) || '[]').length;
  };

  const totalEntries = stats.reduce((acc, s) => acc + getCount(s.key), 0);
  const overallProgress = Math.min(Math.round((totalEntries / 20) * 100), 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (overallProgress / 100) * circumference;

  return (
    <div>
      {/* Top Row */}
      <div className="flex gap-6 mb-6">
        {/* Hero Banner */}
        <div className="flex-1 bg-gradient-to-br from-pink-300 to-purple-400 rounded-3xl p-8 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Track Your<br />Daily Grind
            </h2>
            <p className="text-purple-100 text-sm mb-5 max-w-xs">
              Build habits, level up skills, and become the best version of yourself.
            </p>
            <button
              onClick={() => setActiveTab('habits')}
              className="bg-white text-purple-600 font-bold px-5 py-2 rounded-xl text-sm shadow hover:shadow-md transition-all"
            >
              Start Today →
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-80">
            <TrendingUp size={80} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Statistics Card */}
        <div className="w-64 bg-gray-900 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <Target size={16} className="text-gray-400" />
            <p className="text-white font-semibold text-sm">Statistics</p>
          </div>

          {/* Circular Progress */}
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#374151" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#a855f7" strokeWidth="10"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-2xl font-black">{overallProgress}%</span>
              <span className="text-gray-400 text-xs">Overall</span>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="flex gap-4 w-full justify-around">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{totalEntries}</p>
              <p className="text-gray-500 text-xs">Total Logs</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {JSON.parse(localStorage.getItem('habits') || '[]').length}
              </p>
              <p className="text-gray-500 text-xs">Habits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex gap-6 mb-6 border-b border-gray-200 pb-2">
        {['Daily', 'Weekly', 'Monthly'].map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`text-sm font-semibold pb-2 transition-all ${activeDay === d
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              onClick={() => setActiveTab(stat.key)}
              className={`${stat.color} rounded-2xl p-5 cursor-pointer hover:scale-105 transition-all shadow-sm`}
            >
              <Icon size={32} className={`${stat.iconColor} mb-3`} strokeWidth={1.5} />
              <p className="font-bold text-gray-800 text-lg">{stat.label}</p>
              <p className={`text-sm font-semibold ${stat.textColor}`}>
                {getCount(stat.key)} entries
              </p>
            </div>
          );
        })}
      </div>

      {/* Motivation Quote */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6">
        <p className="text-gray-700 font-semibold text-lg">
          "Push yourself, because no one else is going to do it for you."
        </p>
        <p className="text-gray-400 text-sm mt-1">— Unknown</p>
      </div>

      {/* Heatmap */}
      <Heatmap />
    </div>
  );
}

export default Dashboard;