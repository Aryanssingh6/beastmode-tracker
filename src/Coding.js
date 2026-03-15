import React, { useState, useEffect } from 'react';
import { Code2, Plus, Trash2, Clock, BookMarked } from 'lucide-react';
import { saveData, getData } from './firestore';

function Coding({ currentUser }) {
  const [entries, setEntries] = useState([]);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(10);
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
    setTopic('');
    setDuration('');
    setNote('');
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveData(currentUser.id, 'coding', updated);
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
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <Code2 size={24} className="text-purple-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Coding Tracker</h2>
          <p className="text-gray-400 text-sm">{entries.length} sessions logged</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-purple-200 text-xs uppercase tracking-widest mb-1">This Week</p>
            <p className="text-white font-black text-4xl">{weeklyHours.toFixed(1)}</p>
            <p className="text-purple-200 text-sm">/ {weeklyGoal} hrs</p>
          </div>
          <div className="text-center border-x border-white border-opacity-20">
            <p className="text-purple-200 text-xs uppercase tracking-widest mb-1">Streak</p>
            <p className="text-white font-black text-4xl">{streak}</p>
            <p className="text-purple-200 text-sm">days 🔥</p>
          </div>
          <div className="text-center">
            <p className="text-purple-200 text-xs uppercase tracking-widest mb-1">Total</p>
            <p className="text-white font-black text-4xl">{totalHours.toFixed(0)}</p>
            <p className="text-purple-200 text-sm">hours</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between mb-1">
            <p className="text-purple-200 text-xs">Weekly Progress</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weeklyGoal}
                onChange={e => setWeeklyGoal(e.target.value)}
                className="w-12 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-2 py-0.5 text-xs text-center text-white focus:outline-none"
              />
              <p className="text-purple-200 text-xs">{weeklyProgress}%</p>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Log New Session</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <BookMarked size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Topic (e.g. React Hooks)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="number"
              placeholder="Duration in hours (e.g. 2)"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 bg-gray-900 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          <Plus size={16} />
          Log Session
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 font-medium">Loading...</p>
          </div>
        )}
        {!loading && entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Code2 size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No sessions yet. Start coding!</p>
          </div>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-purple-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Code2 size={18} className="text-purple-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-gray-800">{entry.topic}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-xs">{entry.duration} hrs · {entry.date}</p>
                </div>
                {entry.note && <p className="text-gray-400 text-xs mt-1">{entry.note}</p>}
              </div>
            </div>
            <button
              onClick={() => deleteEntry(entry.id)}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coding;