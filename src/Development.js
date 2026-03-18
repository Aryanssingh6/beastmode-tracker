import React, { useState, useEffect } from 'react';
import { AlertCircle, Github, GitCommit, FileCode2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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

function Development({ currentUser, darkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchGitHubData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchGitHubData = async () => {
    const username = localStorage.getItem(`github_${currentUser?.id}`);
    if (!username) {
      setError('No GitHub username set. Please update your Profile.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const cacheKey = `github_cache_${username}`;
      const cacheTimeKey = `github_cache_time_${username}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 15 * 60 * 1000) {
        const parsed = JSON.parse(cachedData);
        setStats(parsed.stats);
        setRepos(parsed.repos);
        setEvents(parsed.events);
        setLoading(false);
        return;
      }
      
      const [userRes, repoRes, eventRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=10`)
      ]);

      if (userRes.status === 403 || userRes.status === 429) {
        throw new Error('GitHub API Rate limit exceeded. Please wait a few minutes.');
      }

      if (!userRes.ok) throw new Error('Failed to fetch user data');

      const userData = await userRes.json();
      const statsObj = {
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        avatar_url: userData.avatar_url,
      };

      let reposObj = [];
      if (repoRes.ok) {
        reposObj = await repoRes.json();
      }

      let eventsObj = [];
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        eventsObj = eventData.filter(e => e.type === 'PushEvent' || e.type === 'CreateEvent').slice(0, 5);
      }
      
      setStats(statsObj);
      setRepos(reposObj);
      setEvents(eventsObj);
      
      localStorage.setItem(cacheKey, JSON.stringify({ stats: statsObj, repos: reposObj, events: eventsObj }));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Network error or API limit reached.' : err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-[400px] w-full mt-4">
        {/* Skeleton Web Dev Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden z-0 rounded-2xl">
           <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Skeleton Profile Stats */}
          <div className="col-span-1 bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 mb-4"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
            <div className="w-full grid grid-cols-2 gap-3">
               <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
               <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
          {/* Skeleton Repositories */}
          <div className="col-span-1 md:col-span-2 bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
               <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
               <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
               <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Skeleton Timeline */}
        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse relative z-10">
           <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
           <div className="space-y-6 pl-4 border-l border-gray-200 dark:border-gray-800">
             <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
             <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
             <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-12 text-gray-400 min-h-[400px]">
        <AlertCircle size={32} className="text-red-400 mb-4" />
        <p>{error}</p>
        <button onClick={fetchGitHubData} className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30">
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative min-h-[500px]"
    >
      {/* Web Dev / GitHub Thematic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden z-0 rounded-2xl">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
             <pattern id="code-bg" width="60" height="60" patternUnits="userSpaceOnUse">
               <text x="5" y="20" fill="currentColor" fontSize="12" fontFamily="monospace" className="text-gray-400">{'</>'}</text>
               <text x="35" y="50" fill="currentColor" fontSize="12" fontFamily="monospace" className="text-gray-400">{'{ }'}</text>
             </pattern>
             <pattern id="git-branches" width="100" height="100" patternUnits="userSpaceOnUse">
               <path d="M 20 0 L 20 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500" />
               <path d="M 20 40 Q 40 40 40 60 L 40 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-500" />
               <circle cx="20" cy="40" r="3" fill="currentColor" className="text-blue-500" />
               <circle cx="40" cy="80" r="3" fill="currentColor" className="text-cyan-500" />
             </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#code-bg)" />
          <rect width="100%" height="100%" fill="url(#git-branches)" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Profile Stats Card */}
        <div className="col-span-1 bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <img src={stats?.avatar_url} alt="GitHub Avatar" className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 mb-3" />
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg mb-1">
            <Github size={18} />
            <span>GitHub Stats</span>
          </div>
          <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-4">Web Developer</p>
          
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 border border-gray-200 dark:border-gray-800 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-[#202020] hover:scale-[1.02] cursor-default">
              <span className="block text-xl text-gray-900 dark:text-white"><CountUp end={stats?.public_repos || 0} /></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Repos</span>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 border border-gray-200 dark:border-gray-800 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-[#202020] hover:scale-[1.02] cursor-default">
              <span className="block text-xl text-gray-900 dark:text-white"><CountUp end={stats?.followers || 0} /></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</span>
            </div>
          </div>
        </div>

        {/* Recent Repositories */}
        <div className="col-span-1 md:col-span-2 bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 dark:text-gray-200 font-bold mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <FileCode2 className="text-cyan-500" size={18} />
            Active Repositories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {repos.length === 0 ? <p className="text-sm text-gray-500">No public repos found.</p> : null}
            {repos.map(repo => (
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer"
                key={repo.id} 
                className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800/60 p-3 rounded-lg hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-gray-100 dark:hover:bg-[#202020] transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 truncate pr-2">
                    {repo.name}
                  </h4>
                  {repo.stargazers_count > 0 && <span className="flex items-center text-xs text-yellow-500 font-medium gap-1"><Star size={10} />{repo.stargazers_count}</span>}
                </div>
                <p className="text-[10px] text-gray-500 truncate mb-2">{repo.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.6)]"></span>
                  {repo.language || 'Documentation'}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm relative z-10">
         <h3 className="text-gray-900 dark:text-gray-200 font-bold mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <GitCommit className="text-purple-500" size={18} />
            Recent Terminal Activity
         </h3>
         
         <div className="space-y-4 pl-2 border-l border-gray-200 dark:border-gray-800 ml-3">
           {events.length === 0 ? <p className="text-sm text-gray-500 pl-4">No recent pushes found.</p> : null}
           {events.map((event, idx) => (
             <div key={idx} className="relative pl-6">
                <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white dark:border-[#111] shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 mb-1 font-mono">{new Date(event.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 font-medium break-words">
                    {event.type === 'PushEvent' ? `Pushed ${event.payload.commits?.length || 0} commits to ` : 'Created branch in '}
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{event.repo.name}</span>
                  </p>
                  {event.type === 'PushEvent' && event.payload.commits?.length > 0 && (
                     <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded px-2 py-1.5 font-mono truncate">
                       {event.payload.commits[0].message}
                     </div>
                  )}
                </div>
             </div>
           ))}
         </div>
      </div>

    </motion.div>
  );
}

export default Development;
