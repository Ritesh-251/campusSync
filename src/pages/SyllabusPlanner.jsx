import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// ✅ Retry with timeout logic
const fetchWithRetry = async (url, options, retries = 3, timeout = 60000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (res.ok) return res;
      const errorData = await res.json().catch(() => ({}));
      if (attempt === retries - 1) {
        throw new Error(errorData.error?.message || 'Failed after retries.');
      }
    } catch (err) {
      if (attempt === retries - 1 || err.name === 'AbortError') {
        throw new Error(
          err.name === 'AbortError'
            ? 'Model is busy right now. Please try again later.'
            : err.message
        );
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1))); // 1s, 2s, 3s
  }
};

const SyllabusPlannerPage = () => {
  const [file, setFile] = useState(null);
  const [studyPlan, setStudyPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [user, setUser] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else signInAnonymously(auth);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      ['application/pdf', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selected.type)
    ) {
      setFile(selected);
      setError('');
    } else {
      setError('Please upload a .pdf, .jpeg, or .docx file.');
      setFile(null);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleGeneratePlan = async () => {
    if (!file) {
      setError('Please upload a syllabus file first.');
      return;
    }

    setLoading(true);
    setError('');
    setStudyPlan('');
    setChatHistory([]);

    try {
      const base64Data = await fileToBase64(file);
      const base64 = base64Data.split(',')[1];

      const prompt = `
You are a smart academic planner. Carefully read this syllabus and generate a personalized, study-friendly plan.

The output must:
- Be divided into weeks or days, explained clearly in continuous text.
- Organize the plan by topic or chapter naturally.
- Include recommended study hours per topic or chapter.

Important rules:
- Do NOT use bullet points, lists, numbers, or symbols like "*", "-", or "•".
- Write everything in full sentences and paragraphs, like natural flowing text.
- Do NOT copy the syllabus text directly.
- Keep the tone simple and student-friendly.

Create a clean, achievable study schedule that can realistically be followed.
`.trim();

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: file.type,
                  data: base64,
                },
              },
            ],
          },
        ],
      };

      const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const res = await fetchWithRetry(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const planText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No plan generated.';
      setStudyPlan(planText);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!userMessage.trim()) return;

    const updatedChat = [...chatHistory, { role: 'user', text: userMessage }];
    setChatHistory(updatedChat);
    setUserMessage('');
    setChatLoading(true);

    try {
      const fullConversation = [
        {
          role: 'user',
          parts: [
            {
              text: `The core document for our discussion is the following study plan:\n\n${studyPlan}\n\nPlease refer to this plan for all subsequent questions and adjustments.`,
            },
          ],
        },
        ...updatedChat.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      ];

      const payload = { contents: fullConversation };

      const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const res = await fetchWithRetry(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';

      try {
        const parsed = JSON.parse(geminiReply);
        setCalendarEvents(parsed);
        setChatHistory((prev) => [
          ...prev,
          { role: 'gemini', text: '✅ Your updated plan has been added to the calendar.' },
        ]);
      } catch {
        setChatHistory((prev) => [...prev, { role: 'gemini', text: geminiReply }]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to chat with Gemini.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f8fcfb] min-h-screen p-8 gap-6">
      <h2 className="text-[32px] font-bold text-[#0e1b19]">Syllabus Planner</h2>
      <p className="text-[#4e978b] text-sm mb-4">Upload your syllabus and create a personalized study plan.</p>

      <div className="flex flex-col gap-4 border-2 border-dashed border-[#d0e7e3] rounded-xl p-6">
        <input
          type="file"
          accept=".pdf, .jpeg, .jpg, .docx, application/pdf, image/jpeg, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
        {file && <p className="text-[#0e1b19]">{file.name}</p>}
        <button
          onClick={handleGeneratePlan}
          className="bg-[#19e5c3] text-[#0e1b19] font-bold rounded-xl h-10 px-4 disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? 'Generating...' : 'Generate Study Plan'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {studyPlan && (
        <>
          <div className="bg-[#e7f3f1] p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Initial Study Plan:</h3>
            <div className="whitespace-pre-wrap text-sm text-[#0e1b19]">{studyPlan}</div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <h3 className="text-[#0e1b19] font-bold text-lg">Refine Your Plan (Chat with Gemini)</h3>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto bg-[#f8fcfb] border border-[#d0e7e3] rounded-xl p-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className="font-semibold">{msg.role === 'user' ? 'You:' : 'Gemini:'}</span> {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="text-left text-sm text-[#4e978b] italic">Gemini is typing...</div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask to adjust plan (e.g., reduce hours)"
                className="flex-1 border border-[#d0e7e3] rounded-lg p-2 text-sm resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (userMessage.trim()) handleChat();
                  }
                }}
              />
              <button
                onClick={handleChat}
                className="bg-[#19e5c3] text-[#0e1b19] font-bold rounded-lg px-4"
                disabled={!userMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SyllabusPlannerPage;
