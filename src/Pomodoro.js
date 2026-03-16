import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, X, Maximize2, Minimize2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Pomodoro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      clearInterval(interval);
      
      if (isWorkMode) {
        toast.success('Focus session complete! Take a 5-minute break. 🎯', { duration: 5000 });
        setIsWorkMode(false);
        setTimeLeft(BREAK_TIME);
      } else {
        toast.success('Break is over! Ready to focus again? 🚀', { duration: 5000 });
        setIsWorkMode(true);
        setTimeLeft(WORK_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWorkMode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isWorkMode ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = isWorkMode 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 md:left-[280px] z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 border border-gray-800 dark:border-gray-200"
      >
        <Timer size={18} />
        <span className="font-semibold text-sm">Focus Timer</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 left-6 md:left-[280px] z-50 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl transition-all duration-300 overflow-hidden flex flex-col ${isMinimized ? 'w-48 h-14' : 'w-72 h-auto'}`}>
      
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          {isWorkMode ? (
            <Timer size={16} className="text-blue-500" />
          ) : (
            <CheckCircle size={16} className="text-green-500" />
          )}
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {isWorkMode ? 'Focus Session' : 'Short Break'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isMinimized && (
            <span className="text-sm font-bold font-mono w-12 text-gray-700 dark:text-gray-300">
              {formatTime(timeLeft)}
            </span>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-gray-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="p-6 flex flex-col items-center justify-center relative">
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                className="stroke-current text-gray-100 dark:text-gray-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                className={`stroke-current transition-all duration-1000 ease-linear ${isWorkMode ? 'text-blue-500' : 'text-green-500'}`}
                strokeWidth="6"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
                isActive ? 'bg-orange-500 hover:bg-orange-600' : (isWorkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600')
              }`}
            >
              {isActive ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
            </button>
            
            <button
              onClick={resetTimer}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-3 w-full">
            <button 
              onClick={() => {setIsWorkMode(true); setTimeLeft(WORK_TIME); setIsActive(false);}}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${isWorkMode ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              Focus
            </button>
            <button 
              onClick={() => {setIsWorkMode(false); setTimeLeft(BREAK_TIME); setIsActive(false);}}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${!isWorkMode ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              Break
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;
