import React, { useState, useEffect } from 'react';
import { Code2, BookOpen, Flame, Dumbbell, TrendingUp, Target } from 'lucide-react';
import Heatmap from './Heatmap';

const quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "Your limitation — it's only your imagination.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
];

function Dashboard({ setActiveTab, currentUser }) {
  const [activeDay, setActiveDay] = useState('Weekly');
  const [quote, setQuote] = useState(quotes[0]);
  const [greeting, setGreeting] = useState('');
  const [todaySummary, setTodaySummary] = useState({});

  useEffect(() => {
    // Random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');

    // Today's summary
    const today = new Date().toLocaleDateString();
    const coding = JSON.parse(localStorage.getItem('coding') || '[]').filter(e => e.date === today).length;
    const studies = JSON.parse(localStorage.getItem('studies') || '[]').filter(e => e.date === today).length;
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]').filter(e => e.date === today).length;
    const habits = JSON.parse(localStorage.getItem('habits') || '[]').filter(h => h.lastChecked === new Date().toDateString()).length;
    setTodaySummary({ coding, studies, fitness, habits });
  }, []);

  const stats = [
    { label: 'Coding', key: 'coding', icon: Code2, color: 'bg-purple-100', textColor: 'text-purple-500', iconColor: 'text-purple-400' },
    { label: 'Studies', key: 'studies', icon: BookOpen, color: 'bg-blue-100', textColor: 'text-blue-500', iconColor: 'text-blue-400' },
    { label: 'Habits', key: 'habits', icon: Flame, color: 'bg-orange-100', textColor: 'text-orange-500', iconColor: 'text-orange-400' },
    { label: 'Fitness', key: 'fitness', icon: Dumbbell, color: 'bg-green-100', textColor: 'text-green-500', iconColor: 'text-green-400' },
  ];

  const getCount = (key) => JSON.parse(localStorage.getItem(key) || '[]').length;

  const totalEntries = stats.reduce((acc, s) => acc + getCount(s.key), 0);
  const overallProgress = Math.min(Math.round((totalEntries / 20) * 100), 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (overallProgress / 100) * circumference;

  const totalToday = Object.values(todaySummary).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900">
          {greeting}, {currentUser?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-400 mt-1">
          {totalToday === 0
            ? "You haven't logged anything today. Let's get started! 💪"
            : `You've logged ${totalToday} activities today. Keep it up! 🔥`}
        </p>
      </div>

      {/* Today's Summary */}
      {totalToday > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-white font-bold mb-3 text-sm uppercase tracking-wide">Today's Activity</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Coding', value: todaySummary.coding, icon: Code2 },
              { label: 'Studies', value: todaySummary.studies, icon: BookOpen },
              { label: 'Habits', value: todaySummary.habits, icon: Flame },
              { label: 'Fitness', value: todaySummary.fitness, icon: Dumbbell },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
                  <Icon size={16} className="text-white mx-auto mb-1" />
                  <p className="text-white font-black text-xl">{item.value}</p>
                  <p className="text-purple-100 text-xs">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Motivational Quote */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6">
        <p className="text-gray-700 font-semibold text-lg">"{quote.text}"</p>
        <p className="text-gray-400 text-sm mt-2">— {quote.author}</p>
      </div>

      {/* Heatmap */}
      <Heatmap />
    </div>
  );
}

export default Dashboard;