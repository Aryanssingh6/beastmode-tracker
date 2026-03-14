import React from 'react';

function Heatmap() {
  const getAllActivity = () => {
    const coding = JSON.parse(localStorage.getItem('coding') || '[]');
    const studies = JSON.parse(localStorage.getItem('studies') || '[]');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]');

    const activityMap = {};

    const addActivity = (items, dateKey) => {
      items.forEach(item => {
        const date = item[dateKey];
        if (date) {
          activityMap[date] = (activityMap[date] || 0) + 1;
        }
      });
    };

    addActivity(coding, 'date');
    addActivity(studies, 'date');
    addActivity(fitness, 'date');
    habits.forEach(h => {
      if (h.lastChecked) {
        const date = new Date(h.lastChecked).toLocaleDateString();
        activityMap[date] = (activityMap[date] || 0) + 1;
      }
    });

    return activityMap;
  };

  const getLast365Days = () => {
    const days = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString());
    }
    return days;
  };

  const getColor = (count) => {
    if (!count || count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-purple-200';
    if (count === 2) return 'bg-purple-400';
    if (count >= 3) return 'bg-purple-600';
    return 'bg-gray-100';
  };

  const activityMap = getAllActivity();
  const days = getLast365Days();

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const totalContributions = Object.values(activityMap).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-gray-900 text-lg">Activity</h3>
          <p className="text-gray-400 text-sm">{totalContributions} contributions in the last year</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-purple-200" />
          <div className="w-3 h-3 rounded-sm bg-purple-400" />
          <div className="w-3 h-3 rounded-sm bg-purple-600" />
          <span className="text-gray-400 text-xs">More</span>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex gap-1 mb-1 ml-0 overflow-x-auto">
        {months.map(m => (
          <div key={m} className="text-xs text-gray-400 w-7 text-center shrink-0">{m}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day}: ${activityMap[day] || 0} activities`}
                className={`w-3 h-3 rounded-sm ${getColor(activityMap[day])} hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Heatmap;