import React from 'react';

function Heatmap({ data = [], color = 'purple' }) {
  const getActivityMap = () => {
    const map = {};
    data.forEach(item => {
      const date = item.date;
      if (date) {
        map[date] = (map[date] || 0) + 1;
      }
    });
    return map;
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
    if (!count || count === 0) return 'bg-[#0a0a0a] border border-gray-800/50';
    if (count === 1) return `bg-${color}-900/40 border border-${color}-800/50`;
    if (count === 2) return `bg-${color}-800/60 border border-${color}-600/50`;
    if (count >= 3) return `bg-${color}-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]`;
    return 'bg-[#0a0a0a] border border-gray-800/50';
  };

  const activityMap = getActivityMap();
  const days = getLast365Days();

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const totalContributions = Object.values(activityMap).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#050505] border border-gray-800/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-800/50 pb-4 relative z-10">
        <div>
          <h3 className="font-semibold text-white tracking-wide">Activity Map</h3>
          <p className="text-gray-500 text-sm mt-1">{totalContributions} contributions in the last year</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mr-1">Less</span>
          <div className="w-3 h-3 rounded-[3px] bg-[#0a0a0a] border border-gray-800/50" />
          <div className={`w-3 h-3 rounded-[3px] bg-${color}-900/40 border border-${color}-800/50`} />
          <div className={`w-3 h-3 rounded-[3px] bg-${color}-800/60 border border-${color}-600/50`} />
          <div className={`w-3 h-3 rounded-[3px] bg-${color}-500 shadow-[0_0_5px_rgba(59,130,246,0.4)]`} />
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wider ml-1">More</span>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex gap-1 mb-3 ml-0 overflow-x-auto relative z-10">
        {months.map(m => (
          <div key={m} className="text-xs text-gray-500 w-7 text-center shrink-0 font-medium tracking-wider uppercase">{m}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide relative z-10">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[4px]">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day}: ${activityMap[day] || 0} activities`}
                className={`w-3 h-3 rounded-[3px] ${getColor(activityMap[day])} hover:ring-1 hover:ring-cyan-400 transition-all cursor-crosshair`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Heatmap;