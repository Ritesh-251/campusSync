import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const NoteSummarizerPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pastSummaries, setPastSummaries] = useState([]);
  const [user, setUser] = useState(null);

  // Firebase Auth (Anonymous Login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchSummaries(user.uid);
      } else {
        signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSummaries = async (uid) => {
    const snapshot = await getDocs(collection(db, 'users', uid, 'summaries'));
    const summaries = snapshot.docs.map((doc) => doc.data());
    setPastSummaries(summaries);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setPdfFile(null);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSummarize = async () => {
    if (!pdfFile || !user) {
      setError('Please upload a PDF and ensure you are logged in.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const base64Data = await fileToBase64(pdfFile);
      const base64Pdf = base64Data.split(',')[1];

      const prompt = `
You are an expert academic summarizer. Analyze the provided PDF document and generate a concise, study-friendly summary with:
- Key Concepts
- Important Facts
- Definitions
- Major Ideas

Present in bullet points. Don't copy full paragraphs.
      `.trim();

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'application/pdf',
                  data: base64Pdf,
                },
              },
            ],
          },
        ],
      };

      const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to get summary from the API.');
      }

      const data = await res.json();
      const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary could be generated.';
      setSummary(summaryText);

      // Save to Firestore
      await addDoc(collection(db, 'users', user.uid, 'summaries'), {
        title: pdfFile.name,
        date: new Date().toISOString().split('T')[0],
        summary: summaryText,
      });

      // Refresh summaries
      fetchSummaries(user.uid);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#f8fcfb] min-h-screen">
      {/* Left Section */}
      <div className="flex-1 flex flex-col p-8 gap-6">
        <div>
          <h2 className="text-[32px] font-bold text-[#0e1b19]">Note Summarizer</h2>
          <p className="text-[#4e978b] text-sm mt-1">
            Upload your notes and get a concise summary.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 border-2 border-dashed border-[#d0e7e3] rounded-xl px-6 py-14">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#0e1b19] text-lg font-bold text-center">
              Drag and drop your notes here
            </p>
            <p className="text-[#0e1b19] text-sm text-center">
              Supported formats: PDF
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="bg-[#e7f3f1] text-[#0e1b19] font-bold rounded-xl h-10 px-4 pt-2 cursor-pointer"
          >
            Upload Notes
          </label>
          {pdfFile && <p className="text-[#0e1b19] text-sm">{pdfFile.name}</p>}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleSummarize}
            className="bg-[#19e5c3] text-[#0e1b19] font-bold rounded-xl h-10 px-4 disabled:opacity-50"
            disabled={loading || !pdfFile}
          >
            {loading ? 'Summarizing...' : 'Summarize My Notes'}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {summary && (
          <div className="bg-[#e7f3f1] text-[#0e1b19] p-4 rounded-xl mt-6">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <div className="text-sm whitespace-pre-wrap">{summary}</div>
          </div>
        )}
      </div>

      {/* Right Section - Past Summaries */}
      <div className="w-full md:w-[360px] p-6 border-l border-[#d0e7e3]">
        <h3 className="text-[#0e1b19] text-lg font-bold mb-4">Past Summaries</h3>
        {pastSummaries.length === 0 ? (
          <p className="text-sm text-[#4e978b]">No past summaries yet.</p>
        ) : (
          pastSummaries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSummary(item.summary)}
              className="w-full text-left flex items-center gap-4 bg-[#f8fcfb] px-4 py-2 border border-[#e7f3f1] rounded-lg"
            >
              <div className="bg-[#e7f3f1] rounded-lg p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="text-[#0e1b19]"
                >
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                </svg>
              </div>
              <div>
                <p className="text-[#0e1b19] font-medium text-base">{item.title}</p>
                <p className="text-[#4e978b] text-sm">{item.date}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteSummarizerPage;
