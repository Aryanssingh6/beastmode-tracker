import React, { useState, useEffect } from 'react';

function Coding() {
  const [entries, setEntries] = useState([]);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('coding') || '[]');
    setEntries(saved);
  }, []);

  const addEntry = () => {
    if (!topic || !duration) return;
    const newEntry = {
      id: Date.now(),
      topic,
      duration,
      note,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('coding', JSON.stringify(updated));
    setTopic('');
    setDuration('');
    setNote('');
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('coding', JSON.stringify(updated));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">💻 Coding Tracker</h2>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Topic (e.g. React Hooks)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Duration (e.g. 2 hours)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={addEntry}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-3 rounded-lg transition-all tracking-wide"
        >
          + LOG SESSION
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-gray-600 text-center py-10">No sessions logged yet. Start grinding! 💪</p>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="bg-gray-900 border border-gray-800 rounded-lg px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{entry.topic}</p>
              <p className="text-gray-500 text-sm">{entry.duration} &nbsp;·&nbsp; {entry.date}</p>
              {entry.note && <p className="text-gray-600 text-sm mt-1">{entry.note}</p>}
            </div>
            <button
              onClick={() => deleteEntry(entry.id)}
              className="text-gray-700 hover:text-red-500 transition-all text-xl ml-4"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coding;