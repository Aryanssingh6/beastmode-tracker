import React, { useState, useEffect } from 'react';
import { Bell, X, Flame, Code2, BookOpen, Dumbbell, CheckCircle } from 'lucide-react';

function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = () => {
    const notifs = [];
    const today = new Date().toDateString();
    const todayLocal = new Date().toLocaleDateString();

    // Habits check
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const pendingHabits = habits.filter(h => h.lastChecked !== today);
    if (pendingHabits.length > 0) {
      notifs.push({
        id: 1,
        type: 'warning',
        icon: Flame,
        color: 'text-orange-500',
        bg: 'bg-orange-100',
        title: 'Habits Pending!',
        message: `${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} not completed today`,
      });
    } else if (habits.length > 0) {
      notifs.push({
        id: 2,
        type: 'success',
        icon: CheckCircle,
        color: 'text-green-500',
        bg: 'bg-green-100',
        title: 'All Habits Done!',
        message: 'Amazing! You completed all habits today 🔥',
      });
    }

    // Coding check
    const coding = JSON.parse(localStorage.getItem('coding') || '[]');
    const codedToday = coding.some(e => e.date === todayLocal);
    if (!codedToday) {
      notifs.push({
        id: 3,
        type: 'warning',
        icon: Code2,
        color: 'text-purple-500',
        bg: 'bg-purple-100',
        title: 'No Coding Today!',
        message: 'You haven\'t logged any coding session today',
      });
    }

    // Studies check
    const studies = JSON.parse(localStorage.getItem('studies') || '[]');
    const studiedToday = studies.some(e => e.date === todayLocal);
    if (!studiedToday) {
      notifs.push({
        id: 4,
        type: 'warning',
        icon: BookOpen,
        color: 'text-blue-500',
        bg: 'bg-blue-100',
        title: 'No Study Session!',
        message: 'Open the books! No study session logged today',
      });
    }

    // Fitness check
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]');
    const workedOutToday = fitness.some(e => e.date === todayLocal);
    if (!workedOutToday) {
      notifs.push({
        id: 5,
        type: 'warning',
        icon: Dumbbell,
        color: 'text-green-500',
        bg: 'bg-green-100',
        title: 'No Workout Today!',
        message: 'Hit the gym! No workout logged today',
      });
    }

    // Goals check
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.forEach(goal => {
      if (goal.deadline) {
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3 && daysLeft >= 0) {
          notifs.push({
            id: goal.id,
            type: 'danger',
            icon: Flame,
            color: 'text-red-500',
            bg: 'bg-red-100',
            title: 'Goal Deadline Near!',
            message: `"${goal.title}" due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
          });
        }
      }
    });

    setNotifications(notifs);
  };

  const unread = notifications.length;

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Bell size={18} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-14 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-900">Notifications</p>
            <button onClick={() => setOpen(false)}>
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">All caught up! 🎉</p>
              </div>
            ) : (
              notifications.map(notif => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id} className="flex items-start gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all">
                    <div className={`w-8 h-8 ${notif.bg} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={14} className={notif.color} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{notif.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Notifications;