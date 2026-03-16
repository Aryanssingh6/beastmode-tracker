import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Clock, GraduationCap, AlertTriangle, Flame, BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveData, getData } from './firestore';
import Heatmap from './Heatmap';
import { addXP } from './App';

function Studies({ currentUser }) {
  const [entries, setEntries] = useState([]);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(parseInt(localStorage.getItem('goal_studies')) || 15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const data = await getData(currentUser.id, 'studies');
    setEntries(data);
    setLoading(false);
  };

  const addEntry = async () => {
    if (!subject || !duration) {
      toast.error('Please fill in subject and duration');
      return;
    }
    const newEntry = {
      id: Date.now(),
      subject,
      duration: parseFloat(duration),
      note,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await saveData(currentUser.id, 'studies', updated);
    
    // Reward XP based on duration (10 XP per hour)
    const earnedXP = Math.max(5, Math.round(parseFloat(duration) * 10));
    addXP(currentUser.id, earnedXP);

    setSubject('');
    setDuration('');
    setNote('');
    toast.success(`+${earnedXP} XP! ${subject} logged.`);
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveData(currentUser.id, 'studies', updated);
    toast.success('Session deleted');
  };

  const getSubjectStats = () => {
    const stats = {};
    entries.forEach(e => {
      if (!stats[e.subject]) stats[e.subject] = { sessions: 0, hours: 0 };
      stats[e.subject].sessions += 1;
      stats[e.subject].hours += parseFloat(e.duration) || 0;
    });
    return stats;
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

  const subjectStats = getSubjectStats();
  const weeklyHours = getWeeklyHours();
  const weeklyProgress = Math.min(Math.round((weeklyHours / weeklyGoal) * 100), 100);
  const streak = getStreak();
  const totalHours = entries.reduce((acc, e) => acc + (parseFloat(e.duration) || 0), 0);

  const weakSubjects = Object.entries(subjectStats)
    .filter(([_, s]) => s.hours < 2)
    .map(([name]) => name);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <BookOpen size={24} className="text-blue-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Studies <span className="text-blue-400">Tracker</span></h2>
          <p className="text-gray-400 text-sm">{entries.length} sessions logged · Stay focused</p>
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
            <p className="text-blue-500/80 text-xs font-semibold uppercase tracking-wider mb-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]">Current Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-blue-400 font-bold text-3xl">{streak}</p>
              <p className="text-blue-500/60 text-sm font-medium">days</p>
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
                  localStorage.setItem('goal_studies', val);
                }}
                className="w-12 bg-gray-900/50 border border-gray-700/50 rounded flex items-center justify-center text-xs text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500 py-1"
              />
              <p className="text-blue-400 text-xs font-bold w-8 text-right drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]">{weeklyProgress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-900/50 border border-gray-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-400 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)] relative"
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
        <Heatmap data={entries} color="blue" />
      </div>

      {/* Weak Subject Alert */}
      {weakSubjects.length > 0 && (
        <div className="bg-orange-900/10 border border-orange-500/20 rounded-2xl p-4 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="text-orange-400" size={20} />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Focus Area Identified</p>
            <p className="text-orange-200/70 text-sm mt-0.5">
              You need more focus on: <strong>{weakSubjects.join(', ')}</strong>. Consider allocating more time there.
            </p>
          </div>
        </div>
      )}

      {/* Subject Stats */}
      {Object.keys(subjectStats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(subjectStats).map(([name, stat]) => (
            <div key={name} className="bg-[#050505] rounded-2xl p-5 shadow-sm border border-gray-800/50 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <p className="font-medium text-gray-500 text-xs tracking-wider uppercase truncate mb-2 relative z-10">{name}</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <p className="text-white font-bold text-3xl">{stat.hours.toFixed(1)}</p>
                <p className="text-blue-400 text-sm font-medium">h</p>
              </div>
              <p className="text-gray-500 text-xs mt-1 relative z-10">{stat.sessions} sessions</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="bg-[#050505] border border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookMarked size={16} className="text-blue-400" />
          <h3 className="font-semibold text-white text-sm tracking-wide">Log Study Session</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="relative">
            <GraduationCap size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Subject (e.g. Mathematics)"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="number"
              placeholder="Duration in hours"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
          />
        </div>
        <button
          onClick={addEntry}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-medium px-8 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Plus size={16} />
          Log Session
        </button>
      </div>

      {/* Entries */}
      <div className="bg-[#050505] border border-gray-800/50 rounded-2xl shadow-sm overflow-hidden mb-8">
        {loading && (
          <div className="p-8 text-center">
            <p className="text-gray-400 font-medium text-sm">Loading...</p>
          </div>
        )}
        {!loading && entries.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium text-sm">No study sessions logged. Time to hit the books!</p>
          </div>
        )}
        <div className="divide-y divide-gray-800/50">
          {entries.map(entry => (
            <div key={entry.id} className="p-5 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/10">
                  <BookOpen size={18} className="text-blue-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-white text-md">{entry.subject}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock size={14} />
                      <span>{entry.duration} hrs</span>
                    </div>
                    <span className="text-gray-700 px-1">•</span>
                    <span className="text-gray-500 text-sm">{entry.date}</span>
                  </div>
                  {entry.note && <p className="text-gray-400 text-sm mt-3 bg-gray-900/50 px-3 py-2 rounded-lg inline-block border border-gray-800/50">{entry.note}</p>}
                </div>
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-900/20 text-gray-500 border border-transparent hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Studies;