import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Camera, Target, Download, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData } from './firestore';

function Profile({ currentUser, onUpdate }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [profilePic, setProfilePic] = useState(null);
  const [goals, setGoals] = useState({
    coding: parseInt(localStorage.getItem('goal_coding')) || 10,
    fitness: parseInt(localStorage.getItem('goal_fitness')) || 5,
    studies: parseInt(localStorage.getItem('goal_studies')) || 15
  });
  const [stats, setStats] = useState({ coding: [], studies: [], habits: [], fitness: [] });
  const [githubUser, setGithubUser] = useState(localStorage.getItem(`github_${currentUser?.id}`) || '');

  const avatarColors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-teal-400',
    'from-orange-400 to-red-400',
    'from-yellow-400 to-orange-400',
  ];

  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem(`avatarColor_${currentUser?.id}`) || avatarColors[0]
  );

  useEffect(() => {
    const pic = localStorage.getItem(`profilePic_${currentUser?.id}`);
    if (pic) setProfilePic(pic);

    const loadStats = async () => {
      if (!currentUser?.id) return;
      const coding = await getData(currentUser.id, 'coding') || [];
      const studies = await getData(currentUser.id, 'studies') || [];
      const habits = await getData(currentUser.id, 'habits') || [];
      const fitness = await getData(currentUser.id, 'fitness') || [];
      setStats({ coding, studies, habits, fitness });
    };
    loadStats();
  }, [currentUser]);

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfilePic(base64);
      localStorage.setItem(`profilePic_${currentUser?.id}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    localStorage.setItem(`avatarColor_${currentUser?.id}`, color);
    localStorage.setItem('avatarColor', color);
  };

  const handleSave = () => {
    const updated = { ...currentUser, name };
    localStorage.setItem('currentUser', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === currentUser.id ? updated : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Save goals
    localStorage.setItem('goal_coding', goals.coding);
    localStorage.setItem('goal_fitness', goals.fitness);
    localStorage.setItem('goal_studies', goals.studies);
    localStorage.setItem(`github_${currentUser?.id}`, githubUser);

    onUpdate(updated);
    toast.success('Profile and goals updated successfully!');
  };

  const handleExport = () => {
    let csv = 'Category,Date,Title,Details,Note\n';
    stats.coding.forEach(i => csv += `"Coding","${i.date || ''}","${i.topic || ''}","${i.duration || ''} hrs","${i.note || ''}"\n`);
    stats.studies.forEach(i => csv += `"Studies","${i.date || ''}","${i.subject || ''}","${i.duration || ''} hrs","${i.note || ''}"\n`);
    stats.fitness.forEach(i => csv += `"Fitness","${i.date || ''}","${i.workout || ''}","${i.duration || ''}","${i.note || ''}"\n`);
    stats.habits.forEach(i => csv += `"Habits","${i.lastChecked || ''}","${i.name || ''}","${i.streak || 0} streak","${i.description || ''}"\n`);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beastmode_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported to CSV!');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
          <User size={20} className="text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile & Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm">Profile Picture container</h3>
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-800"
              />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedColor} flex items-center justify-center shadow-sm`}>
                <span className="text-white text-3xl font-bold">
                  {name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm">
              <Camera size={12} className="text-gray-600 dark:text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePicUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Color Picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Avatar Theme</p>
            <div className="flex gap-3">
              {avatarColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} transition-all
                    ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Edit Info */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm">Account Details</h3>
          <div className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-md pl-10 pr-4 py-2.5 text-sm cursor-not-allowed shadow-sm opacity-70"
              />
            </div>
            <div className="relative">
              <Github size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="GitHub Username (for syncing)"
                value={githubUser}
                onChange={e => setGithubUser(e.target.value)}
                className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm flex items-center gap-2">
            <Target size={16} className="text-gray-400" />
            Weekly Goals
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Coding Hours</span>
              <input
                type="number"
                value={goals.coding}
                onChange={e => setGoals({ ...goals, coding: parseInt(e.target.value) || 0 })}
                className="w-20 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Fitness Workouts</span>
              <input
                type="number"
                value={goals.fitness}
                onChange={e => setGoals({ ...goals, fitness: parseInt(e.target.value) || 0 })}
                className="w-20 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Study Hours</span>
              <input
                type="number"
                value={goals.studies}
                onChange={e => setGoals({ ...goals, studies: parseInt(e.target.value) || 0 })}
                className="w-20 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save & Export Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 font-medium px-5 py-2.5 rounded-md text-sm transition-colors bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm"
        >
          <Download size={16} />
          Export Data (CSV)
        </button>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 font-medium px-5 py-2.5 rounded-md text-sm transition-colors bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm">Your Lifetime Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Coding Sessions', key: 'coding', color: 'text-purple-500 dark:text-purple-400' },
            { label: 'Study Sessions', key: 'studies', color: 'text-blue-500 dark:text-blue-400' },
            { label: 'Habits Tracker', key: 'habits', color: 'text-orange-500 dark:text-orange-400' },
            { label: 'Workouts', key: 'fitness', color: 'text-green-500 dark:text-green-400' },
          ].map(stat => (
            <div key={stat.key} className="text-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <p className={`text-2xl font-bold mb-1 ${stat.color}`}>
                {stats[stat.key]?.length || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;