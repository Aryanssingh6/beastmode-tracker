import React, { useState } from 'react';
import { Zap, TrendingUp, Target, Flame } from 'lucide-react';

function Welcome({ onGetStarted }) {
  const [hovering, setHovering] = useState(false);

  const features = [
    { icon: TrendingUp, label: 'Track Progress', color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: Target, label: 'Set Goals', color: 'text-blue-500', bg: 'bg-blue-100' },
    { icon: Flame, label: 'Build Habits', color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: Zap, label: 'Level Up', color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-2">
            Beast<span className="text-purple-500">Mode</span>
          </h1>
          <p className="text-gray-400 text-lg">Your personal growth companion</p>
        </div>

        {/* Tagline */}
        <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
          Track Your Grind.<br />
          <span className="text-purple-500">Level Up</span> Every Day.
        </h2>

        <p className="text-gray-500 text-lg mb-10 max-w-md">
          Build habits, crush goals, track your fitness, coding and studies — all in one place.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className={`flex items-center gap-2 ${f.bg} px-4 py-2 rounded-full`}>
                <Icon size={16} className={f.color} />
                <span className={`text-sm font-semibold ${f.color}`}>{f.label}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="flex items-center gap-3 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl text-lg w-fit hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-200 hover:shadow-xl"
        >
          <Zap size={20} className={hovering ? 'text-yellow-300' : 'text-white'} />
          Get Started
        </button>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-400 flex flex-col items-center justify-center p-12">
        {/* Big Icon */}
        <div className="w-40 h-40 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Zap size={80} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: 'Habits Tracked', value: '100+' },
            { label: 'Goals Crushed', value: '50+' },
            { label: 'Coding Hours', value: '200+' },
            { label: 'Workouts Done', value: '80+' },
          ].map(stat => (
            <div key={stat.label} className="bg-white bg-opacity-20 rounded-2xl p-4 text-center">
              <p className="text-white text-2xl font-black">{stat.value}</p>
              <p className="text-purple-100 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcome;