import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });
      const botMessage = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `**Error:** ${err.message}` },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="p-8 pb-2 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to AI Chat</h1>
          <p className="text-gray-500 text-base font-medium">
            Get started by asking anything. Your AI assistant is ready to help!
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`prose px-4 py-3 rounded-2xl max-w-[75%] shadow transition-all
                  ${msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200"
                  }`}
                style={{
                  fontFamily: "Inter, Segoe UI, Arial, sans-serif",
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown
                  components={{
                    strong: ({node, ...props}) => <strong className="text-blue-700 font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="text-purple-600" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-200 px-1 rounded text-purple-700" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl max-w-[75%] bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200 animate-pulse">
                <span className="opacity-70">AI is typing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <form
          className="p-4 border-t border-gray-100 bg-white flex items-center gap-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400 font-medium shadow-sm"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif" }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 font-bold shadow"
            disabled={loading}
          >
            {loading ? "..." : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}