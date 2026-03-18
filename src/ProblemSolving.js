import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, AlertCircle, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#22c55e', '#eab308', '#ef4444']; // Easy(Green), Medium(Yellow), Hard(Red)

const CountUp = ({ end, duration = 2000 }) => {
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

  return <>{count}</>;
};

function ProblemSolving({ currentUser, darkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [solvedData, setSolvedData] = useState(null);
  const [topicData, setTopicData] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchData = async () => {
    const username = localStorage.getItem(`leetcode_${currentUser?.id}`);
    if (!username) {
      setError('No LeetCode username set. Please update your Profile.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Check Cache First
      const cacheKey = `leetcode_cache_${username}`;
      const cacheTimeKey = `leetcode_cache_time_${username}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      // Use cache if it's less than 15 minutes old
      if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 15 * 60 * 1000) {
        const parsed = JSON.parse(cachedData);
        setSolvedData(parsed.solvedData);
        setTopicData(parsed.topicData);
        setBadges(parsed.badges);
        setLoading(false);
        return;
      }
      
      const [solvedRes, skillRes, badgeRes] = await Promise.all([
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
        fetch(`https://alfa-leetcode-api.onrender.com/skillStats/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/badges`)
      ]);

      if (solvedRes.status === 429 || skillRes.status === 429 || badgeRes.status === 429) {
        throw new Error('API Rate limit exceeded. Please wait a few minutes before trying again.');
      }

      if (!solvedRes.ok) throw new Error('Failed to fetch data from API. Status: ' + solvedRes.status);

      const solved = await solvedRes.json();
      if(solved.errors) throw new Error(solved.errors[0]?.message);

      const solvedResult = {
        total: solved.solvedProblem || 0,
        easy: solved.easySolved || 0,
        medium: solved.mediumSolved || 0,
        hard: solved.hardSolved || 0
      };

      const skills = await skillRes.json();
      let topicsResult = [];
      if (skills?.matchedUser?.tagProblemCounts) {
        const counts = skills.matchedUser.tagProblemCounts;
        const allTags = [...(counts.fundamental || []), ...(counts.intermediate || []), ...(counts.advanced || [])];
        topicsResult = allTags
          .map(t => ({ name: t.tagName, value: t.problemsSolved }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      }
      
      if(topicsResult.length === 0) {
        topicsResult = [
          { name: 'Arrays', value: 37 }, { name: 'Math', value: 13 }, { name: 'Two Pointers', value: 12 },
          { name: 'String', value: 11 }, { name: 'Matrix', value: 7 }, { name: 'Sorting', value: 6 }
        ];
      }
      
      const badgeData = await badgeRes.json();
      const badgesResult = badgeData?.badges || [];

      setSolvedData(solvedResult);
      setTopicData(topicsResult);
      setBadges(badgesResult);

      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify({ solvedData: solvedResult, topicData: topicsResult, badges: badgesResult }));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      
    } catch (err) {
      console.error("API Error:", err);
      // Fallback to sample data so the UI doesn't break
      setSolvedData({ total: 55, easy: 26, medium: 25, hard: 4 });
      setTopicData([
        { name: 'Arrays', value: 37 }, { name: 'Math', value: 13 }, { name: 'Two Pointers', value: 12 },
        { name: 'String', value: 11 }, { name: 'Matrix', value: 7 }, { name: 'Sorting', value: 6 }, { name: 'HashMap', value: 6 }
      ]);
      setBadges([]);
      setError('Showing sample data. API is currently rate-limited. It will auto-resolve in a while.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-[400px] w-full mt-4">
        {/* Skeleton DSA Thematic Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] overflow-hidden z-0 rounded-2xl">
           <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />
        </div>
        
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
          {/* Skeleton Awards */}
          <div className="bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-sm animate-pulse">
            <div className="h-6 w-32 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 w-12 bg-gray-800 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg"></div>
              <div className="w-16 h-16 bg-gray-800 rounded-lg"></div>
              <div className="w-16 h-16 bg-gray-800 rounded-lg"></div>
            </div>
          </div>
          {/* Skeleton Chart */}
          <div className="bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-sm animate-pulse flex items-center justify-between">
             <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-gray-700/50"></div>
             <div className="flex-1 ml-6 space-y-4">
               <div className="h-8 bg-gray-800 rounded"></div>
               <div className="h-8 bg-gray-800 rounded"></div>
               <div className="h-8 bg-gray-800 rounded"></div>
             </div>
          </div>
        </div>
        {/* Skeleton Bar Chart */}
        <div className="bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-sm animate-pulse relative z-10">
           <div className="h-6 w-48 bg-gray-800 rounded mb-6"></div>
           <div className="space-y-4">
             <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
             <div className="h-3 w-1/2 bg-gray-800 rounded"></div>
             <div className="h-3 w-2/3 bg-gray-800 rounded"></div>
             <div className="h-3 w-1/3 bg-gray-800 rounded"></div>
             <div className="h-3 w-4/5 bg-gray-800 rounded"></div>
           </div>
        </div>
      </div>
    );
  }

  const pieData = solvedData ? [
    { name: 'Easy', value: solvedData.easy },
    { name: 'Medium', value: solvedData.medium },
    { name: 'Hard', value: solvedData.hard },
  ] : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      {/* DSA Thematic Background (Graph Nodes / Binary Overlay) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] overflow-hidden z-0 rounded-2xl">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dsa-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <pattern id="nodes" width="100" height="100" patternUnits="userSpaceOnUse">
               <circle cx="20" cy="20" r="3" fill="currentColor" />
               <circle cx="80" cy="50" r="3" fill="currentColor" />
               <circle cx="40" cy="80" r="3" fill="currentColor" />
               <path d="M20 20 L80 50 L40 80 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dsa-grid)" className="text-blue-500" />
          <rect width="100%" height="100%" fill="url(#nodes)" className="text-cyan-500" />
        </svg>
      </div>

      {error && (
        <div className="relative z-10 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl p-3 mb-6 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="px-3 py-1.5 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30 text-xs font-semibold transition-colors">
            Retry Connection
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
        {/* Awards Section */}
        <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-200 font-bold mb-4 flex items-center gap-2">
            <Award className="text-blue-500" size={18} />
            Awards
          </h3>
          <p className="text-xs text-gray-500 mb-6">{badges.length}</p>
          
          <div className="min-h-[120px] flex items-center justify-center">
            {badges.length === 0 ? (
              <div className="flex flex-col items-center opacity-40">
                <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center mb-2 transform rotate-45">
                  <div className="transform -rotate-45 text-2xl font-bold text-gray-700">50</div>
                </div>
                <p className="text-sm text-gray-500">No Badge found</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                 {badges.slice(0,3).map((badge, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                      <img src={badge.icon.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`} alt={badge.displayName} className="w-16 h-16 object-contain" />
                      <span className="text-xs text-center text-gray-400 max-w-[80px] truncate">{badge.displayName}</span>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Problems Solved */}
        <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-200 font-bold mb-6 text-center text-lg shadow-sm border-b border-gray-800 pb-2">Problems Solved</h3>
          
          <div className="flex items-center justify-between">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white tracking-tight"><CountUp end={solvedData?.total || 0} /></span>
              </div>
            </div>

            <div className="flex-1 ml-6 space-y-4">
              <p className="text-xs text-center text-gray-400 font-semibold mb-2 shadow-sm uppercase tracking-wider">DSA</p>
              <div className="bg-[#1a1a1a] rounded flex justify-between items-center px-3 py-1.5 border border-gray-800/50 transition-all hover:bg-[#202020] hover:scale-[1.02] cursor-default">
                <span className="text-green-500 text-sm font-semibold">Easy</span>
                <span className="text-gray-300 font-bold text-sm"><CountUp end={solvedData?.easy || 0} /></span>
              </div>
              <div className="bg-[#1a1a1a] rounded flex justify-between items-center px-3 py-1.5 border border-gray-800/50 transition-all hover:bg-[#202020] hover:scale-[1.02] cursor-default">
                <span className="text-yellow-500 text-sm font-semibold">Medium</span>
                <span className="text-gray-300 font-bold text-sm"><CountUp end={solvedData?.medium || 0} /></span>
              </div>
              <div className="bg-[#1a1a1a] rounded flex justify-between items-center px-3 py-1.5 border border-gray-800/50 transition-all hover:bg-[#202020] hover:scale-[1.02] cursor-default">
                <span className="text-red-500 text-sm font-semibold">Hard</span>
                <span className="text-gray-300 font-bold text-sm"><CountUp end={solvedData?.hard || 0} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DSA Topic Analysis Horizontal Bar Chart */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-sm relative z-10 min-h-[300px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-200 font-bold flex items-center gap-2">
            <TerminalSquare className="text-blue-500" size={18} />
            DSA Topic Analysis
          </h3>
          <AlertCircle size={16} className="text-gray-600" />
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topicData}
              margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
              barSize={18}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                width={120} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {topicData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#3b82f6' : '#60a5fa'} 
                    fillOpacity={maxOpacity(index, topicData.length)}
                    className="hover:fill-cyan-400 transition-colors duration-300 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// Helper for gradient dropoff on bars
function maxOpacity(index, total) {
  const base = 1.0;
  const drop = index * (0.6 / total);
  return Math.max(0.4, base - drop);
}

export default ProblemSolving;
