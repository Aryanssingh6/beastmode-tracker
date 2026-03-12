import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Clock, GraduationCap } from 'lucide-react';

function Studies() {
  const [entries, setEntries] = useState([]);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('studies') || '[]');
    setEntries(saved);
  }, []);

  const addEntry = () => {
    if (!subject || !duration) return;
    const newEntry = {
      id: Date.now(),
      subject,
      duration,
      note,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('studies', JSON.stringify(updated));
    setSubject('');
    setDuration('');
    setNote('');
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('studies', JSON.stringify(updated));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <BookOpen size={24} className="text-blue-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Studies Tracker</h2>
          <p className="text-gray-400 text-sm">{entries.length} sessions logged</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Log New Session</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <GraduationCap size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Subject (e.g. Mathematics)"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Duration (e.g. 1.5 hours)"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          <Plus size={16} />
          Log Session
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No sessions yet. Open the books!</p>
          </div>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-gray-800">{entry.subject}</p>
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
    </div>
  );
}

export default Studies;