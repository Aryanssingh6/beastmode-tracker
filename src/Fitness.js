import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Clock, Zap, Scale } from 'lucide-react';
import { saveData, getData } from './firestore';

function Fitness({ currentUser }) {
  const [entries, setEntries] = useState([]);
  const [workout, setWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(5);
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
    setWorkout('');
    setDuration('');
    setNote('');
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
    setWeight('');
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
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <Dumbbell size={24} className="text-green-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Fitness Tracker</h2>
          <p className="text-gray-400 text-sm">{entries.length} workouts logged</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-green-200 text-xs uppercase tracking-widest mb-1">This Week</p>
            <p className="text-white font-black text-4xl">{weeklyWorkouts}</p>
            <p className="text-green-200 text-sm">/ {weeklyGoal} workouts</p>
          </div>
          <div className="text-center border-x border-white border-opacity-20">
            <p className="text-green-200 text-xs uppercase tracking-widest mb-1">Streak</p>
            <p className="text-white font-black text-4xl">{streak}</p>
            <p className="text-green-200 text-sm">days 🔥</p>
          </div>
          <div className="text-center">
            <p className="text-green-200 text-xs uppercase tracking-widest mb-1">Weight</p>
            <p className="text-white font-black text-4xl">{latestWeight || '--'}</p>
            <p className="text-green-200 text-sm">
              {weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : 'kg'}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between mb-1">
            <p className="text-green-200 text-xs">Weekly Progress</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weeklyGoal}
                onChange={e => setWeeklyGoal(e.target.value)}
                className="w-12 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-2 py-0.5 text-xs text-center text-white focus:outline-none"
              />
              <p className="text-green-200 text-xs">{weeklyProgress}%</p>
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

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        {['workouts', 'weight'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold pb-2 capitalize transition-all ${activeTab === tab
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab === 'workouts' ? 'Workouts' : 'Weight Log'}
          </button>
        ))}
      </div>

      {activeTab === 'workouts' && (
        <>
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Log New Workout</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Zap size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Workout (e.g. Chest Day)"
                  value={workout}
                  onChange={e => setWorkout(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Duration (e.g. 45 mins)"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={addEntry}
              className="flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              <Plus size={16} />
              Log Workout
            </button>
          </div>

          <div className="space-y-3">
            {loading && <div className="bg-white rounded-2xl p-12 text-center border border-gray-100"><p className="text-gray-400">Loading...</p></div>}
            {!loading && entries.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Dumbbell size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No workouts yet. Hit the gym!</p>
              </div>
            )}
            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-green-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Dumbbell size={18} className="text-green-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{entry.workout}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-gray-400 text-xs">{entry.duration} · {entry.date}</p>
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
        </>
      )}

      {activeTab === 'weight' && (
        <>
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Log Weight</h3>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Scale size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Weight in kg (e.g. 70.5)"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={addWeight}
                className="flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                <Plus size={16} />
                Log
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {weights.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Scale size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No weight logged yet!</p>
              </div>
            )}
            {weights.map((w, i) => (
              <div key={w.id} className="bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Scale size={18} className="text-green-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{w.weight} kg</p>
                    <p className="text-gray-400 text-xs">{w.date}</p>
                  </div>
                </div>
                {i > 0 && (
                  <p className={`text-sm font-bold ${w.weight < weights[i - 1].weight ? 'text-green-500' : 'text-red-400'}`}>
                    {w.weight < weights[i - 1].weight ? '↓' : '↑'} {Math.abs(w.weight - weights[i - 1].weight).toFixed(1)} kg
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Fitness;