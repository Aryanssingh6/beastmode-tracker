import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Code2, BookOpen, Flame, Dumbbell, Calendar } from 'lucide-react';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', category: 'coding', deadline: '' });

  const categories = [
    { id: 'coding', label: 'Coding', icon: Code2, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'studies', label: 'Studies', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'habits', label: 'Habits', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(saved);
  }, []);

  const getProgress = (category, target) => {
    const data = JSON.parse(localStorage.getItem(category) || '[]');
    return Math.min(Math.round((data.length / target) * 100), 100);
  };

  const getCurrent = (category) => {
    const data = JSON.parse(localStorage.getItem(category) || '[]');
    return data.length;
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal = {
      id: Date.now(),
      title: newGoal.title,
      target: parseInt(newGoal.target),
      category: newGoal.category,
      deadline: newGoal.deadline,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
    setNewGoal({ title: '', target: '', category: 'coding', deadline: '' });
  };

  const deleteGoal = (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-purple-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const getDaysColor = (days) => {
    if (days === null) return '';
    if (days < 0) return 'text-red-500';
    if (days <= 3) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <Target size={24} className="text-purple-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Goals</h2>
          <p className="text-gray-400 text-sm">{goals.length} active goals</p>
        </div>
      </div>

      {/* Add Goal */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Set New Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Goal title (e.g. Learn React)"
            value={newGoal.title}
            onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
            className="bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-all"
          />
          <input
            type="number"
            placeholder="Target sessions (e.g. 20)"
            value={newGoal.target}
            onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
            className="bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-all"
          />
          <select
            value={newGoal.category}
            onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
            className="bg-gray-50 text-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-all"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>
        </div>
        <button
          onClick={addGoal}
          className="flex items-center gap-2 bg-gray-900 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Target size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No goals yet. Set your first goal!</p>
          </div>
        )}
        {goals.map(goal => {
          const progress = getProgress(goal.category, goal.target);
          const current = getCurrent(goal.category);
          const cat = categories.find(c => c.id === goal.category);
          const Icon = cat?.icon;
          const daysLeft = getDaysLeft(goal.deadline);

          return (
            <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${cat?.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={cat?.color} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{goal.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-gray-400 text-xs">{cat?.label} · Set on {goal.createdAt}</p>
                      {daysLeft !== null && (
                        <p className={`text-xs font-bold ${getDaysColor(daysLeft)}`}>
                          {daysLeft < 0 ? 'Overdue!' : daysLeft === 0 ? 'Due Today!' : `${daysLeft} days left`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-lg">{current}/{goal.target}</p>
                    <p className="text-gray-400 text-xs">sessions</p>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className={`${getProgressColor(progress)} h-3 rounded-full transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">{progress}% complete</p>
                {progress >= 100 && (
                  <p className="text-xs text-green-500 font-bold">🎉 Goal Achieved!</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;