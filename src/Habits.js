import React, { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { saveData, getData } from './firestore';

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
    setHabits(updated);
    await saveData(currentUser.id, 'habits', updated);
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
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
          <Flame size={24} className="text-orange-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Habits Tracker</h2>
          <p className="text-gray-400 text-sm">{completedToday}/{habits.length} completed today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-orange-400" />
            <p className="font-bold text-gray-700 text-sm">Today</p>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {completedToday}
            <span className="text-gray-400 text-lg font-semibold">/{habits.length}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">habits completed</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-orange-400" />
            <p className="font-bold text-white text-sm">Longest Streak</p>
          </div>
          <p className="text-3xl font-black text-white">
            {longestStreak}
            <span className="text-gray-400 text-lg font-semibold"> days</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">{longestStreak >= 7 ? '🔥 Amazing!' : 'Keep going!'}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {habits.length > 0 && (
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-600">Today's Progress</p>
            <p className="text-sm font-bold text-orange-500">
              {Math.round((completedToday / habits.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedToday / habits.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Habit */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Add New Habit</h3>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Flame size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="New habit (e.g. Read 30 mins)"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={addHabit}
            className="flex items-center gap-2 bg-gray-900 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 font-medium">Loading...</p>
          </div>
        )}
        {!loading && habits.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Flame size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No habits yet. Build your routine!</p>
          </div>
        )}
        {habits.map(habit => {
          const doneToday = habit.lastChecked === today;
          return (
            <div
              key={habit.id}
              className={`bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border transition-all
                ${doneToday ? 'border-orange-200 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
            >
              <div className="flex items-center gap-4">
                <button onClick={() => toggleHabit(habit.id)}>
                  {doneToday
                    ? <CheckCircle2 size={24} className="text-orange-500" />
                    : <Circle size={24} className="text-gray-300 hover:text-orange-400 transition-all" />
                  }
                </button>
                <div>
                  <p className={`font-bold ${doneToday ? 'text-orange-600' : 'text-gray-800'}`}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame size={12} className="text-orange-400" />
                    <p className="text-gray-400 text-xs">{habit.streak} day streak</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Habits;