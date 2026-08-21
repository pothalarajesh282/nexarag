import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, FileText, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { askAI } from "../../services/aiService";
import "./RAGChat.css";

 const prompts = [
  "What are Rajesh's technical skills?",
  "What projects has Rajesh worked on?",
  "Explain Rajesh's MERN experience",
  "What is the work from home policy?"
];

export default function RAGChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputWrapperRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  // Mobile keyboard fix: iOS Safari (and older Android webviews) don't
  // reflow the layout when the keyboard opens, so a fixed-height chat
  // card can end up with its input bar hidden behind the keyboard.
  // Track the real visible height via visualViewport and nudge the
  // input bar into view whenever the keyboard shows or resizes.
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const keepInputVisible = () => {
      // Only bother while the input actually has focus (keyboard is up)
      if (document.activeElement?.closest(".rag-input-form")) {
        inputWrapperRef.current?.scrollIntoView({
          block: "end",
          behavior: "smooth",
        });
      }
    };

    viewport.addEventListener("resize", keepInputVisible);
    return () => viewport.removeEventListener("resize", keepInputVisible);
  }, []);

  const handleInputFocus = () => {
    // Give the keyboard animation a beat to finish before scrolling
    window.setTimeout(() => {
      inputWrapperRef.current?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }, 300);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const content = question.trim();

    // Add user message
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      // Call Node.js → FastAPI → RAG
      const result = await askAI(content);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            result.answer || "I couldn't find an answer in your documents.",
          sources: result.sources || [],
        },
      ]);
    } catch (error) {
      console.error("RAG Chat Error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the NexaRAG AI service.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
  };

  return (
    <div className="rag-page">
      {/* Header */}
      <div className="rag-header">
        <div className="rag-brand">
          <div className="rag-logo">
            <Sparkles size={20} />
          </div>

          <div>
            <h1>NexaRAG AI Assistant</h1>

            <p>Ready to answer from your documents</p>
          </div>
        </div>

        <div className="rag-status">
          <span className="status-dot"></span>
          AI Online
        </div>
      </div>

      {/* Chat Area */}
      <div className="rag-chat-area">
        {/* Empty State */}
        {messages.length === 0 && !loading ? (
          <div className="rag-empty">
            <div className="rag-empty-icon">
              <Bot size={34} />
            </div>

            <span className="rag-label">DOCUMENT COPILOT</span>

            <h2>What would you like to discover?</h2>

            <p>
              Ask questions in plain English and get grounded answers from your
              connected knowledge base.
            </p>

            <div className="rag-prompts">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <FileText size={16} />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="rag-messages">
            {messages.map((message, index) => (
              <div
                className={`rag-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {/* Avatar */}
                <div className="rag-message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={18} />
                  ) : (
                    <User size={18} />
                  )}
                </div>

                {/* Message Body */}
                <div className="rag-message-body">
                  <div className="rag-message-name">
                    {message.role === "assistant" ? "NexaRAG" : "You"}
                  </div>

                  <div className="rag-message-content">
                    {message.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>

                  {/* Sources */}
                  {message.role === "assistant" &&
                    message.sources?.length > 0 && (
                      <div className="rag-source-info">
                        <FileText size={14} />
                        Grounded in your documents · {
                          message.sources.length
                        }{" "}
                        {message.sources.length === 1 ? "source" : "sources"}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="rag-message assistant">
                <div className="rag-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="rag-message-body">
                  <div className="rag-message-name">NexaRAG</div>

                  <div className="rag-thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="rag-input-wrapper" ref={inputWrapperRef}>
        <form className="rag-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onFocus={handleInputFocus}
            placeholder="Ask something about your documents..."
            aria-label="Ask something about your documents"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-label="Send message"
          >
            <ArrowUp size={19} />
          </button>
        </form>

        <p className="rag-disclaimer">
          NexaRAG can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
