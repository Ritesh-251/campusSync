import { useState } from "react";
import { summarizeNote } from "../../utils/gemini";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?worker";

// Setting PDF.js worker manually (required for Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const NoteSummarizer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      console.log("Selected file:", uploadedFile);
      console.log("File Type:", uploadedFile.type);
      setFile(uploadedFile);
    }
  };

  const handleSummarize = async () => {
    setIsLoading(true);

    let content = text;
    try {
      if (file) {
        console.log("File present, starting read...");
        if (file.type === "application/pdf") {
          console.log("PDF detected, reading PDF content...");
          content = await readPdfContent(file);
        } else {
          console.log("Reading plain text file...");
          content = await readFileContent(file);
        }
      }

      if (!content || content.trim() === '') {
        setSummary("⚠️ No text to summarize.");
      } else {
        console.log("Sending to Gemini for summarization...");
        const summaryResult = await summarizeNote(content);
        setSummary(summaryResult);
      }
    } catch (err) {
      console.error(err);
      setSummary("⚠️ Failed to summarize the notes.");
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readPdfContent = async (file) => {
    console.log("Initiating PDF reading...");
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        console.log("PDF FileReader loaded.");
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let extractedText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            extractedText += content.items.map(item => item.str).join(' ') + '\n';
          }

          console.log("PDF text extracted successfully.");
          resolve(extractedText);
        } catch (err) {
          console.error("Error while extracting PDF:", err);
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="space-y-4">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your notes here..."
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
      />

      <div>
        <label className="block text-gray-700 text-sm mb-2">Or upload a file:</label>
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>

      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className={`w-full py-2 rounded-md ${
          isLoading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        {isLoading ? 'Summarizing...' : 'Summarize'}
      </button>

      {summary && (
        <div className="mt-4 border rounded-lg p-3 bg-gray-50 text-sm whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
};

export default NoteSummarizer;
