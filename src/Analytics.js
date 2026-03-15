import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

function Analytics() {
  const [activeChart, setActiveChart] = useState('coding');

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString());
    }
    return days;
  };

  const days = getLast7Days();

  const getCodingData = () => {
    const coding = JSON.parse(localStorage.getItem('coding') || '[]');
    return days.map(day => ({
      day: day.slice(0, 5),
      hours: coding.filter(e => e.date === day).reduce((acc, e) => acc + (parseFloat(e.duration) || 0), 0),
    }));
  };

  const getStudiesData = () => {
    const studies = JSON.parse(localStorage.getItem('studies') || '[]');
    return days.map(day => ({
      day: day.slice(0, 5),
      hours: studies.filter(e => e.date === day).reduce((acc, e) => acc + (parseFloat(e.duration) || 0), 0),
    }));
  };

  const getFitnessData = () => {
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]');
    return days.map(day => ({
      day: day.slice(0, 5),
      workouts: fitness.filter(e => e.date === day).length,
    }));
  };

  const getHabitsData = () => {
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    return days.map(day => {
      const d = new Date(day).toDateString();
      return {
        day: day.slice(0, 5),
        completed: habits.filter(h => h.lastChecked === d).length,
        total: habits.length,
      };
    });
  };

  const getOverallData = () => {
    const codingData = getCodingData();
    const studiesData = getStudiesData();
    const fitnessData = getFitnessData();
    return days.map((day, i) => ({
      day: day.slice(0, 5),
      coding: codingData[i].hours,
      studies: studiesData[i].hours,
      fitness: fitnessData[i].workouts,
    }));
  };

  const charts = [
    { id: 'coding', label: 'Coding', color: '#a855f7' },
    { id: 'studies', label: 'Studies', color: '#3b82f6' },
    { id: 'fitness', label: 'Fitness', color: '#22c55e' },
    { id: 'habits', label: 'Habits', color: '#f97316' },
    { id: 'overall', label: 'Overall', color: '#6366f1' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <BarChart2 size={24} className="text-indigo-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Analytics</h2>
          <p className="text-gray-400 text-sm">Last 7 days activity</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Coding Hours',
            value: getCodingData().reduce((a, b) => a + b.hours, 0).toFixed(1),
            unit: 'hrs',
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            icon: Activity,
          },
          {
            label: 'Study Hours',
            value: getStudiesData().reduce((a, b) => a + b.hours, 0).toFixed(1),
            unit: 'hrs',
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            icon: TrendingUp,
          },
          {
            label: 'Workouts',
            value: getFitnessData().reduce((a, b) => a + b.workouts, 0),
            unit: 'sessions',
            color: 'text-green-500',
            bg: 'bg-green-100',
            icon: Activity,
          },
          {
            label: 'Habits Done',
            value: getHabitsData().reduce((a, b) => a + b.completed, 0),
            unit: 'total',
            color: 'text-orange-500',
            bg: 'bg-orange-100',
            icon: TrendingUp,
          },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} strokeWidth={1.5} />
              </div>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-gray-400 text-xs mt-1">{card.label} this week</p>
            </div>
          );
        })}
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {charts.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveChart(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${activeChart === c.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {activeChart === 'coding' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Coding Hours — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCodingData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'studies' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Study Hours — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStudiesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'fitness' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Workout Sessions — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getFitnessData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="workouts" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'habits' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Habits Completed — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getHabitsData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'overall' && (
          <>
            <h3 className="font-bold text-gray-800 mb-4">Overall Activity — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getOverallData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="coding" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="studies" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fitness" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;