import React, { useState, useEffect } from 'react';
import { Code2, BookOpen, Flame, Dumbbell, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (percentage < 1) {
        animationFrame = window.requestAnimationFrame(updateCount);
      }
    };

    animationFrame = window.requestAnimationFrame(updateCount);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

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

function Dashboard({ setActiveTab, currentUser, darkMode }) {
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
    const coding = JSON.parse(localStorage.getItem('coding') || '[]');
    const studies = JSON.parse(localStorage.getItem('studies') || '[]');
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    
    const codingToday = coding.filter(e => e.date === today).length;
    const studiesToday = studies.filter(e => e.date === today).length;
    const fitnessToday = fitness.filter(e => e.date === today).length;
    const habitsToday = habits.filter(h => h.lastChecked === new Date().toDateString()).length;
    
    setTodaySummary({ coding: codingToday, studies: studiesToday, fitness: fitnessToday, habits: habitsToday });

    // Chart Data (Last 7 Days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString();
      chartData.push({
        name: d.toLocaleDateString(undefined, { weekday: 'short' }),
        Coding: coding.filter(e => e.date === dateStr).length,
        Studies: studies.filter(e => e.date === dateStr).length,
        Fitness: fitness.filter(e => e.date === dateStr).length,
      });
    }
    setChartData(chartData);
  }, []);

  const [chartData, setChartData] = useState([]);

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
      <div className="mb-6 flex flex-col items-center justify-center text-center mt-8">
        {/* Subtle Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
          <span className="text-xs font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
            Powered by Your Discipline
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          <span className={darkMode ? 'text-gray-100' : 'text-gray-800'}>{greeting},</span> <br/>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {currentUser?.name?.split(' ')[0]}
          </span>
        </h2>
        
        <p className={`text-lg max-w-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {totalToday === 0
            ? "You haven't logged anything today. Time to activate Beast Mode."
            : `You've logged ${totalToday} activities today. Exceptional work.`}
        </p>
      </div>

      {/* Today's Summary */}
      {totalToday > 0 && (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 shadow-sm">
          <p className="font-semibold mb-4 text-sm text-gray-900 dark:text-gray-100">Today's Activity</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Coding', value: todaySummary.coding, icon: Code2 },
              { label: 'Studies', value: todaySummary.studies, icon: BookOpen },
              { label: 'Habits', value: todaySummary.habits, icon: Flame },
              { label: 'Fitness', value: todaySummary.fitness, icon: Dumbbell },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center justify-center p-3">
                  <Icon size={20} className="text-gray-400 mb-2" />
                  <p className="text-gray-900 dark:text-white font-bold text-2xl">{item.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Row */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Hero Banner */}
        <div className="flex-1 bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-8 flex items-center justify-between shadow-sm relative overflow-hidden group">
          {/* Subtle hover gradient inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2 tracking-tight"
            >
              Track Your <span className="text-cyan-400">Daily Grind</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-sm leading-relaxed"
            >
              Build habits, level up skills, and become the best version of yourself with consistent daily action.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('habits')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium px-8 py-3 rounded-full text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.15)] flex items-center gap-2"
            >
              Start Tracking →
            </motion.button>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="hidden md:flex flex-col items-center gap-2 relative z-10"
          >
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              <TrendingUp size={48} className="text-cyan-500" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>

        {/* Statistics Card */}
        <div className="w-full md:w-80 bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400">
            <Target size={16} />
            <p className="font-medium text-sm">Overall Progress</p>
          </div>
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" className="stroke-gray-200 dark:stroke-gray-800/50" strokeWidth="6" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none"
                className="stroke-cyan-400" strokeWidth="6"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight"><CountUp end={overallProgress} suffix="%" /></span>
            </div>
          </div>
          <div className="flex gap-4 w-full justify-around">
            <div className="text-center bg-gray-100 dark:bg-gray-900/30 rounded-xl p-3 flex-1 border border-gray-200 dark:border-white/5 transition-transform hover:-translate-y-1">
              <p className="text-gray-900 dark:text-white font-bold text-xl"><CountUp end={totalEntries} /></p>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Total Logs</p>
            </div>
            <div className="text-center bg-gray-100 dark:bg-gray-900/30 rounded-xl p-3 flex-1 border border-gray-200 dark:border-white/5 transition-transform hover:-translate-y-1">
              <p className="text-gray-900 dark:text-white font-bold text-xl">
                <CountUp end={JSON.parse(localStorage.getItem('habits') || '[]').length} />
              </p>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Habits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-gray-800">
        {['Overview'].map(d => (
          <button
            key={d}
            className={`text-sm font-medium pb-3 transition-colors text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm">7-Day Activity Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={currentUser ? '#333' : '#e5e7eb'} opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="Coding" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Studies" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Fitness" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              onClick={() => setActiveTab(stat.key)}
              className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-xl p-5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-all duration-300 shadow-sm flex flex-col gap-4 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                 <Icon size={20} className="text-cyan-500 dark:text-cyan-400" strokeWidth={1.5} />
              </div>
              <div className="relative z-10">
                <p className="font-semibold text-gray-900 dark:text-white tracking-wide">{stat.label}</p>
                <p className="text-sm text-gray-500">
                  {getCount(stat.key)} entries tracking
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Quote */}
      <div className="bg-gray-50 dark:bg-[#111] rounded-xl p-6 border-l-4 border-blue-500 mb-6">
        <p className="text-gray-700 dark:text-gray-300 text-lg">"{quote.text}"</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 font-medium">— {quote.author}</p>
      </div>

      {/* Heatmap moved to individual category pages */}
    </div>
  );
}

export default Dashboard;