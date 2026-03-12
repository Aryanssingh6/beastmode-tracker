import React, { useState, useEffect } from 'react';

function Habits() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('habits') || '[]');
    setHabits(saved);
  }, []);

  const addHabit = () => {
    if (!newHabit) return;
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      lastChecked: null,
      completedToday: false,
    };
    const updated = [...habits, habit];
    setHabits(updated);
    localStorage.setItem('habits', JSON.stringify(updated));
    setNewHabit('');
  };

  const toggleHabit = (id) => {
    const today = new Date().toDateString();
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      if (h.lastChecked === today) return h;
      return {
        ...h,
        streak: h.streak + 1,
        lastChecked: today,
        completedToday: true,
      };
    });
    setHabits(updated);
    localStorage.setItem('habits', JSON.stringify(updated));
  };

  const deleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem('habits', JSON.stringify(updated));
  };

  const today = new Date().toDateString();

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">🔥 Habits Tracker</h2>

      {/* Add Habit */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="New habit (e.g. Read 30 mins)"
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            className="flex-1 bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={addHabit}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-lg transition-all tracking-wide"
          >
            + ADD
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 && (
          <p className="text-gray-600 text-center py-10">No habits yet. Build your routine! 🔥</p>
        )}
        {habits.map(habit => {
          const doneToday = habit.lastChecked === today;
          return (
            <div key={habit.id} className={`bg-gray-900 border rounded-lg px-5 py-4 flex items-center justify-between transition-all ${doneToday ? 'border-orange-500' : 'border-gray-800'}`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all font-bold
                    ${doneToday
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-gray-600 text-transparent hover:border-orange-400'}`}
                >
                  ✓
                </button>
                <div>
                  <p className={`font-semibold ${doneToday ? 'text-orange-400' : 'text-white'}`}>
                    {habit.name}
                  </p>
                  <p className="text-gray-500 text-sm">🔥 {habit.streak} day streak</p>
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-gray-700 hover:text-red-500 transition-all text-xl ml-4"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Habits;