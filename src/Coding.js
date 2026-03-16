import React, { useState, useEffect } from 'react';
import { Code2, Plus, Trash2, Clock, BookMarked, Github } from 'lucide-react';
import { saveData, getData } from './firestore';
import Heatmap from './Heatmap';
import { addXP } from './App';
import toast from 'react-hot-toast';

function Coding({ currentUser }) {
  const [entries, setEntries] = useState([]);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(parseInt(localStorage.getItem('goal_coding')) || 10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const data = await getData(currentUser.id, 'coding');
    setEntries(data);
    setLoading(false);
  };

  const addEntry = async () => {
    if (!topic || !duration) return;
    const newEntry = {
      id: Date.now(),
      topic,
      duration: parseFloat(duration),
      note,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await saveData(currentUser.id, 'coding', updated);
    
    // Reward XP based on duration (10 XP per hour)
    const earnedXP = Math.max(5, Math.round(parseFloat(duration) * 10));
    addXP(currentUser.id, earnedXP);

    setTopic('');
    setDuration('');
    setNote('');
    toast.success(`+${earnedXP} XP! ${topic} logged.`);
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveData(currentUser.id, 'coding', updated);
  };

  const syncGithub = async () => {
    const username = localStorage.getItem(`github_${currentUser?.id}`);
    if (!username) {
      toast.error('Please set your GitHub username in Profile to sync commits.');
      return;
    }
    
    try {
      toast.loading('Syncing GitHub commits...', { id: 'github_sync' });
      const response = await fetch(`https://api.github.com/users/${username}/events/public`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const events = await response.json();
      const pushEvents = events.filter(e => e.type === 'PushEvent');
      
      if (pushEvents.length === 0) {
        toast.success('No recent commits found.', { id: 'github_sync' });
        return;
      }
      
      let currentEntries = [...entries];
      let addedCount = 0;
      
      pushEvents.forEach(event => {
        const date = new Date(event.created_at).toLocaleDateString();
        const commits = event.payload.commits.length;
        const repo = event.repo.name;
        
        // Prevent duplicates
        const exists = currentEntries.some(e => e.date === date && e.topic === repo && e.note === 'GitHub Sync');
        
        if (!exists && commits > 0) {
          currentEntries.unshift({
            id: Date.now() + Math.random(),
            topic: repo,
            duration: (commits * 0.5).toFixed(1),
            note: 'GitHub Sync',
            date: date
          });
          addedCount += commits;
        }
      });
      
      if (addedCount > 0) {
        setEntries(currentEntries);
        await saveData(currentUser.id, 'coding', currentEntries);
        // Reward fixed XP for a sync
        addXP(currentUser.id, addedCount * 5); 
        toast.success(`Synced ${addedCount} recent commits from GitHub! (+${addedCount * 5} XP)`, { id: 'github_sync' });
      } else {
        toast.success('You are already up to date with GitHub.', { id: 'github_sync' });
      }
    } catch (error) {
      toast.error('Failed to sync. Please check your username in Profile.', { id: 'github_sync' });
    }
  };

  const getWeeklyHours = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return entries
      .filter(e => new Date(e.date) >= oneWeekAgo)
      .reduce((acc, e) => acc + (parseFloat(e.duration) || 0), 0);
  };

  const getStreak = () => {
    if (entries.length === 0) return 0;
    const dates = [...new Set(entries.map(e => e.date))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let current = new Date();
    for (let date of dates) {
      const d = new Date(date);
      const diff = Math.round((current - d) / (1000 * 60 * 60 * 24));
      if (diff <= 1) { streak++; current = d; }
      else break;
    }
    return streak;
  };

  const weeklyHours = getWeeklyHours();
  const weeklyProgress = Math.min(Math.round((weeklyHours / weeklyGoal) * 100), 100);
  const streak = getStreak();
  const totalHours = entries.reduce((acc, e) => acc + (parseFloat(e.duration) || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <Code2 size={24} className="text-cyan-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Coding <span className="text-cyan-400">Tracker</span></h2>
          <p className="text-gray-400 text-sm">{entries.length} sessions logged · Keep pushing forward</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-[#050505] border border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="text-center">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">This Week</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-white font-bold text-3xl">{weeklyHours.toFixed(1)}</p>
              <p className="text-gray-400 text-sm font-medium">/ {weeklyGoal}h</p>
            </div>
          </div>
          <div className="text-center border-x border-gray-800/50">
            <p className="text-cyan-500/80 text-xs font-semibold uppercase tracking-wider mb-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">Current Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-cyan-400 font-bold text-3xl">{streak}</p>
              <p className="text-cyan-500/60 text-sm font-medium">days</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-white font-bold text-3xl">{totalHours.toFixed(0)}</p>
              <p className="text-gray-400 text-sm font-medium">hrs</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800/50 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Weekly Progress Goal</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weeklyGoal}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setWeeklyGoal(val);
                  localStorage.setItem('goal_coding', val);
                }}
                className="w-12 bg-gray-900/50 border border-gray-700/50 rounded flex items-center justify-center text-xs text-center text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 py-1"
              />
              <p className="text-cyan-400 text-xs font-bold w-8 text-right drop-shadow-[0_0_5px_rgba(34,211,238,0.2)]">{weeklyProgress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-900/50 border border-gray-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.3)] relative"
              style={{ width: `${weeklyProgress}%` }}
            >
              {weeklyProgress > 10 && (
                 <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-[slide-right_2s_infinite]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <Heatmap data={entries} color="purple" />
      </div>

      {/* Form */}
      <div className="bg-[#050505] border border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookMarked size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-white text-sm tracking-wide">Log New Session</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="relative">
            <Code2 size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Topic (e.g. React Hooks)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="number"
              placeholder="Duration in hours"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addEntry}
            className="flex-1 shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            <Plus size={16} />
            Log Session
          </button>
          <button
            onClick={syncGithub}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-gray-300 hover:text-white font-medium px-6 py-2.5 rounded-full text-sm transition-all shadow-sm"
          >
            <Github size={16} />
            Sync Commits
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="p-8 text-center">
            <p className="text-gray-400 font-medium text-sm">Loading...</p>
          </div>
        )}
        {!loading && entries.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Code2 size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium text-sm">No sessions yet. Start coding!</p>
          </div>
        )}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-center shrink-0">
                  <Code2 size={16} className="text-blue-600 dark:text-blue-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{entry.topic}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Clock size={12} />
                      <span>{entry.duration} hrs</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-gray-500 text-xs">{entry.date}</span>
                  </div>
                  {entry.note && <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">{entry.note}</p>}
                </div>
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Coding;