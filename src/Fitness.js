import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Clock, Zap, Scale } from 'lucide-react';
import { saveData, getData } from './firestore';
import Heatmap from './Heatmap';
import { addXP } from './App';
import toast from 'react-hot-toast';

function Fitness({ currentUser }) {
  const [entries, setEntries] = useState([]);
  const [workout, setWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(parseInt(localStorage.getItem('goal_fitness')) || 5);
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);
  const [activeTab, setActiveTab] = useState('workouts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const data = await getData(currentUser.id, 'fitness');
    setEntries(data);
    const weightData = await getData(currentUser.id, 'weights');
    setWeights(weightData);
    setLoading(false);
  };

  const addEntry = async () => {
    if (!workout || !duration) return;
    const newEntry = {
      id: Date.now(),
      workout,
      duration,
      note,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await saveData(currentUser.id, 'fitness', updated);
    
    // Reward XP
    const earnedXP = 20;
    addXP(currentUser.id, earnedXP);
    
    setWorkout('');
    setDuration('');
    setNote('');
    toast.success(`+${earnedXP} XP! ${workout} logged.`);
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveData(currentUser.id, 'fitness', updated);
  };

  const addWeight = async () => {
    if (!weight) return;
    const newWeight = {
      id: Date.now(),
      weight: parseFloat(weight),
      date: new Date().toLocaleDateString(),
    };
    const updated = [newWeight, ...weights];
    setWeights(updated);
    await saveData(currentUser.id, 'weights', updated);
    
    addXP(currentUser.id, 5);
    setWeight('');
    toast.success(`+5 XP! Weight logged.`);
  };

  const getWeeklyWorkouts = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return entries.filter(e => new Date(e.date) >= oneWeekAgo).length;
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

  const weeklyWorkouts = getWeeklyWorkouts();
  const weeklyProgress = Math.min(Math.round((weeklyWorkouts / weeklyGoal) * 100), 100);
  const streak = getStreak();
  const latestWeight = weights[0]?.weight || null;
  const firstWeight = weights[weights.length - 1]?.weight || null;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-900/20 border border-green-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Dumbbell size={24} className="text-emerald-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Fitness <span className="text-emerald-400">Tracker</span></h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{entries.length} workouts logged</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">This Week</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-gray-900 dark:text-white font-bold text-3xl">{weeklyWorkouts}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">/ {weeklyGoal}</p>
            </div>
          </div>
          <div className="text-center border-x border-gray-800/50">
            <p className="text-emerald-500/80 text-xs font-semibold uppercase tracking-wider mb-1 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">Current Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-emerald-400 font-bold text-3xl">{streak}</p>
              <p className="text-emerald-500/60 text-sm font-medium">days</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Latest Weight</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-gray-900 dark:text-white font-bold text-3xl">{latestWeight || '--'}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">kg</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800/50 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Weekly Progress Goal</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weeklyGoal}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setWeeklyGoal(val);
                  localStorage.setItem('goal_fitness', val);
                }}
                className="w-12 bg-gray-900/50 border border-gray-700/50 rounded flex items-center justify-center text-xs text-center text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 py-1"
              />
              <p className="text-emerald-400 text-xs font-bold w-8 text-right drop-shadow-[0_0_5px_rgba(16,185,129,0.2)]">{weeklyProgress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-900/50 border border-gray-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
              style={{ width: `${weeklyProgress}%` }}
            >
              {weeklyProgress > 10 && (
                 <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-[slide-right_2s_infinite]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-800">
        {['workouts', 'weight'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-3 capitalize transition-colors relative
              ${activeTab === tab
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-500 hover:text-gray-300'}`}
          >
            {tab === 'workouts' ? 'Workouts' : 'Weight Log'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'workouts' && (
        <>
          {/* Heatmap */}
          <div className="mb-6">
            <Heatmap data={entries} color="green" />
          </div>

          <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={16} className="text-emerald-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm tracking-wide">Log New Workout</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="relative">
                <Dumbbell size={16} className="absolute left-3 top-3 text-gray-600 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Workout (e.g. Chest Day)"
                  value={workout}
                  onChange={e => setWorkout(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3 text-gray-600 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Duration (e.g. 45 mins)"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </div>
            <button
              onClick={addEntry}
              className="flex items-center justify-center gap-2 w-full md:w-auto bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-medium px-8 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus size={16} />
              Log Workout
            </button>
          </div>

          <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden mb-8">
            {loading && (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Loading...</p>
              </div>
            )}
            {!loading && entries.length === 0 && (
              <div className="p-12 text-center text-gray-600 dark:text-gray-500">
                <Dumbbell size={32} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium text-sm">No workouts yet. Hit the gym!</p>
              </div>
            )}
            <div className="divide-y divide-gray-800/50">
              {entries.map(entry => (
                <div key={entry.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-green-900/20 rounded-xl flex items-center justify-center shrink-0 border border-green-500/10">
                      <Dumbbell size={18} className="text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-md">{entry.workout}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                          <Clock size={14} />
                          <span>{entry.duration}</span>
                        </div>
                        <span className="text-gray-700 px-1">•</span>
                        <span className="text-gray-600 dark:text-gray-500 text-sm">{entry.date}</span>
                      </div>
                      {entry.note && <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 bg-gray-900/50 px-3 py-2 rounded-lg inline-block border border-gray-800/50">{entry.note}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-900/20 text-gray-600 dark:text-gray-500 border border-transparent hover:border-red-500/30 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'weight' && (
        <>
          <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wide mb-5 text-sm">Log Weight</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Scale size={16} className="absolute left-3 top-3 text-gray-600 dark:text-gray-500" />
                <input
                  type="number"
                  placeholder="Weight in kg"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>
              <button
                onClick={addWeight}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-medium px-8 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
              >
                <Plus size={16} />
                Save Weight
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden mb-8">
            {weights.length === 0 && (
              <div className="p-12 text-center text-gray-600 dark:text-gray-500">
                <Scale size={32} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium text-sm">No weight logged yet!</p>
              </div>
            )}
            <div className="divide-y divide-gray-800/50">
              {weights.map((w, i) => (
                <div key={w.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-900/20 border border-green-500/10 rounded-xl flex items-center justify-center">
                      <Scale size={18} className="text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-md">{w.weight} kg</p>
                      <p className="text-gray-600 dark:text-gray-500 text-sm mt-1">{w.date}</p>
                    </div>
                  </div>
                  {i > 0 && (
                    <p className={`text-xs font-semibold px-2 py-1.5 rounded-md border ${w.weight < weights[i - 1].weight ? 'bg-green-900/20 text-emerald-400 border-green-500/20' : 'bg-red-900/20 text-red-400 border-red-500/20'}`}>
                      {w.weight < weights[i - 1].weight ? '↓' : '↑'} {Math.abs(w.weight - weights[i - 1].weight).toFixed(1)} kg
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Fitness;