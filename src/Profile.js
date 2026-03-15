import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Camera } from 'lucide-react';

function Profile({ currentUser, onUpdate }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [saved, setSaved] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

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
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <User size={24} className="text-purple-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Profile</h2>
          <p className="text-gray-400 text-sm">Customize your account</p>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Profile Picture</h3>
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedColor} flex items-center justify-center shadow-lg`}>
                <span className="text-white text-4xl font-black">
                  {name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-all shadow">
              <Camera size={14} className="text-white" />
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
            <p className="text-sm font-semibold text-gray-600 mb-3">Avatar Color</p>
            <div className="flex gap-3">
              {avatarColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-all
                    ${selectedColor === color ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Account Info</h3>
        <div className="space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full bg-gray-100 border border-gray-200 text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm cursor-not-allowed"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 mt-4 font-bold px-6 py-3 rounded-xl text-sm transition-all
            ${saved ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-purple-600 text-white'}`}
        >
          <Save size={16} />
          {saved ? 'Saved! ✓' : 'Save Changes'}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Your Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Coding Sessions', key: 'coding', color: 'text-purple-500' },
            { label: 'Study Sessions', key: 'studies', color: 'text-blue-500' },
            { label: 'Habits', key: 'habits', color: 'text-orange-500' },
            { label: 'Workouts', key: 'fitness', color: 'text-green-500' },
          ].map(stat => (
            <div key={stat.key} className="text-center bg-gray-50 rounded-2xl p-4">
              <p className={`text-2xl font-black ${stat.color}`}>
                {JSON.parse(localStorage.getItem(stat.key) || '[]').length}
              </p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;