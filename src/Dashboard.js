import React from 'react';

function Dashboard({ setActiveTab }) {
  const stats = [
    { label: 'Coding', key: 'coding', icon: '💻', color: 'cyan' },
    { label: 'Studies', key: 'studies', icon: '📚', color: 'purple' },
    { label: 'Habits', key: 'habits', icon: '🔥', color: 'orange' },
    { label: 'Fitness', key: 'fitness', icon: '💪', color: 'green' },
  ];

  const getStreak = (key) => {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return data.length;
  };

  const getColorClass = (color) => {
    const colors = {
      cyan: 'border-cyan-500 text-cyan-400',
      purple: 'border-purple-500 text-purple-400',
      orange: 'border-orange-500 text-orange-400',
      green: 'border-green-500 text-green-400',
    };
    return colors[color];
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Welcome back, Champion! 👊</h2>
        <p className="text-gray-500">Track your grind. Level up every day.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(stat => (
          <div
            key={stat.key}
            onClick={() => setActiveTab(stat.key)}
            className={`bg-gray-900 border-l-4 ${getColorClass(stat.color)} rounded-lg p-5 cursor-pointer hover:bg-gray-800 transition-all`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${getColorClass(stat.color).split(' ')[1]}`}>
              {getStreak(stat.key)}
            </div>
            <div className="text-gray-500 text-sm mt-1">{stat.label} entries</div>
          </div>
        ))}
      </div>

      {/* Motivation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <p className="text-cyan-400 text-lg font-semibold tracking-wide">
          "Success is the sum of small efforts repeated day in and day out."
        </p>
        <p className="text-gray-600 text-sm mt-2">— Robert Collier</p>
      </div>
    </div>
  );
}

export default Dashboard;