import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSend, FiMessageSquare, FiX } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
const PDFChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  const toggleChat = () => setIsOpen(!isOpen);

  // Streaming Response Function
  const streamResponse = async function* (responseText) {
    for (let i = 0; i < responseText.length; i++) {
      yield responseText.slice(0, i + 1);
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate streaming delay
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const newMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, newMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/ask-pdf", { question });
      const answer = res.data.answer;

      let streamedMessage = { role: "ai", content: "" };
      setMessages((prev) => [...prev, streamedMessage]);

      for await (const chunk of streamResponse(answer)) {
        setMessages((prev) => {
          let updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { role: "ai", content: chunk };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error getting response!" }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Bot Icon (Click to Toggle Chat) */}
      <div
  className="fixed bottom-8 right-8 z-[9999] animate-pulse bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition"
  onClick={toggleChat}
>
  {isOpen ? <FiX size={24} /> : <FaRobot size={34} />}
</div>

{isOpen && (
  <div className="fixed bottom-20 right-6 w-[400px] h-[550px] bg-gray-100 shadow-lg rounded-lg flex flex-col transition-all duration-300 z-[10000]">
    {/* Chat Header */}
    <div className="p-4 text-xl font-bold bg-blue-600 text-white flex justify-between">
      <span>🤖 LandBot</span>
      <FiX size={20} className="cursor-pointer" onClick={toggleChat} />
    </div>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-[80%] ${
            msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {msg.content}
        </div>
      ))}
      {loading && <div className="text-gray-500 text-sm">⏳ Thinking...</div>}
      <div ref={messagesEndRef}></div>
    </div>

    {/* Chat Input */}
    <div className="p-4 bg-white flex items-center border-t rounded-lg">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about the document..."
        className="flex-1 p-2 border rounded-md"
      />
      <button
        onClick={askQuestion}
        className="ml-2 p-2 bg-blue-600 text-white rounded-md"
      >
        <FiSend />
      </button>
    </div>
  </div>
)}
    </>
  );
};

export default PDFChatbot;
