import React, { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveData, getData } from './firestore';
import { addXP } from './App';
import toast from 'react-hot-toast';

function Habits({ currentUser }) {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const data = await getData(currentUser.id, 'habits');
    setHabits(data);
    setLoading(false);
  };

  const addHabit = async () => {
    if (!newHabit) return;
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      lastChecked: null,
    };
    const updated = [...habits, habit];
    setHabits(updated);
    await saveData(currentUser.id, 'habits', updated);
    setNewHabit('');
  };

  const toggleHabit = async (id) => {
    const today = new Date().toDateString();
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      if (h.lastChecked === today) return h;
      return { ...h, streak: h.streak + 1, lastChecked: today };
    });
    
    const wasUpdated = updated.some(h => h.id === id && h.lastChecked === today && habits.find(old => old.id === id).lastChecked !== today);
    
    setHabits(updated);
    await saveData(currentUser.id, 'habits', updated);
    
    if (wasUpdated) {
      addXP(currentUser.id, 5);
      toast.success(`+5 XP! Habit completed.`);
    }
  };

  const deleteHabit = async (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    await saveData(currentUser.id, 'habits', updated);
  };

  const today = new Date().toDateString();
  const completedToday = habits.filter(h => h.lastChecked === today).length;
  const longestStreak = habits.reduce((max, h) => h.streak > max ? h.streak : max, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
          <Flame size={20} className="text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Habits Tracker</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{completedToday}/{habits.length} completed today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Today</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-gray-900 dark:text-white font-bold text-3xl">{completedToday}</p>
              <p className="text-gray-400 text-sm font-medium">/ {habits.length}</p>
            </div>
            <p className="text-gray-400 text-xs mt-1">completed</p>
          </div>
          <div className="text-center border-l border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Longest Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-gray-900 dark:text-white font-bold text-3xl">{longestStreak}</p>
              <p className="text-gray-400 text-sm font-medium">days</p>
            </div>
            <p className="text-gray-400 text-xs mt-1">{longestStreak >= 7 ? 'Amazing!' : 'Keep going!'}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {habits.length > 0 && (
        <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Progress</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {Math.round((completedToday / habits.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(completedToday / habits.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Habit */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Add New Habit</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Flame size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="New habit (e.g. Read 30 mins)"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={addHabit}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium px-5 py-2.5 rounded-md text-sm transition-colors"
          >
            <Plus size={16} />
            Add Habit
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-xl shadow-sm overflow-hidden mb-6">
        {loading && (
          <div className="p-8 text-center">
            <p className="text-gray-400 font-medium text-sm">Loading...</p>
          </div>
        )}
        {!loading && habits.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame size={20} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="font-medium text-sm">No habits yet. Build your routine!</p>
          </div>
        )}
        <div className="divide-y divide-gray-800/50">
          {habits.map((habit, index) => {
            const doneToday = habit.lastChecked === today;
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={habit.id}
                className={`p-4 flex items-center justify-between transition-colors
                  ${doneToday ? 'bg-blue-500/10 dark:bg-blue-900/20' : 'hover:bg-white/5 dark:hover:bg-[#1a1a1a]'}`}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleHabit(habit.id)} className="flex-shrink-0">
                    {doneToday
                      ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}><CheckCircle2 size={20} className="text-blue-500" /></motion.div>
                      : <Circle size={20} className="text-gray-300 dark:text-gray-600 hover:text-blue-400 transition-colors" />
                    }
                  </button>
                  <div>
                    <p className={`font-medium text-sm ${doneToday ? 'text-blue-900 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Flame size={12} className={doneToday ? 'text-blue-400' : 'text-gray-400'} />
                      <p className={`text-xs ${doneToday ? 'text-blue-500/70 dark:text-blue-400/70' : 'text-gray-400'}`}>
                        {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default Habits;