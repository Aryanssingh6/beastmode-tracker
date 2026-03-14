import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

function AICoach({ currentUser }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const coding = JSON.parse(localStorage.getItem('coding') || '[]');
    const studies = JSON.parse(localStorage.getItem('studies') || '[]');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const fitness = JSON.parse(localStorage.getItem('fitness') || '[]');
    return { coding, studies, habits, fitness };
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const data = getUserData();

      const prompt = `You are BeastMode AI Coach for ${currentUser?.name || 'the user'}.
User's data:
- Coding sessions: ${data.coding.length}
- Study sessions: ${data.studies.length}
- Habits: ${data.habits.length}
- Fitness workouts: ${data.fitness.length}

Be motivating, concise and give actionable advice. Keep responses short and punchy.

User says: ${userMsg}`;

      const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
  {
    method: "POST",
    
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.8
            }
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "API Error");
      }

      const text = result.candidates[0].content.parts[0].text;

      setChat(prev => [...prev, { role: 'ai', text }]);

    } catch (err) {
      console.error("Gemini Error:", err);
      setChat(prev => [
        ...prev,
        { role: 'ai', text: `⚠️ ${err.message}` }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-50"
      >
        <Sparkles size={24} className="text-white" />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden"
          style={{ height: '480px' }}
        >

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-white" />
              <p className="text-white font-bold">BeastMode AI Coach</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} className="text-white hover:text-purple-200 transition-all" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.length === 0 && (
              <div className="text-center mt-8">
                <Sparkles size={32} className="text-purple-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">Hey {currentUser?.name}! 👋</p>
                <p className="text-gray-400 text-sm">Ask me anything about your progress!</p>
              </div>
            )}

            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gray-900 text-white rounded-br-sm'
                      : 'bg-purple-50 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-purple-50 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask your AI coach..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
            />

            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-gray-900 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-all"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default AICoach;