import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { callCustomAssetAI } from '../utils/api';
import '../App.css';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your AI Asset Management Assistant. I can help you with:\n• Asset replacement requests\n• Upgrade eligibility\n• Troubleshooting hardware issues\n• Creating support tickets\n\nWhat can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError]       = useState(null);
  const messagesEndRef           = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);
    setError(null);

    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      const aiResult = await callCustomAssetAI(userMessage, 1, 1);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResult.response,
        timestamp: new Date(),
        action: aiResult.action,
        confidence: aiResult.confidence
      }]);

      if (aiResult.action === 'create_ticket') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🎫 **Ticket Created Successfully!**\n\nA support ticket has been created for your request. The IT team will contact you within 24 hours.`,
            timestamp: new Date(),
            isSystem: true
          }]);
        }, 1000);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get AI response. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "❌ Sorry, I'm having trouble connecting to the AI service. Please try again in a moment or contact IT support directly.",
        timestamp: new Date(),
        isError: true
      }]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      {/* Chat header */}
      <div className="chat-hdr">
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} />
        </div>
        <h2>AI Asset Assistant</h2>
        <span className="badge badge-online">● Online</span>
      </div>

      {/* Messages */}
      <div className="chat-msgs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role}${msg.isError ? ' error' : ''}${msg.isSystem ? ' system' : ''}`}>
            <div className="msg-avatar">
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className="msg-content">
              <div
                className="msg-bubble"
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {msg.action && msg.action !== 'answer' && (
                  <span className="action-badge">{msg.action}</span>
                )}
                {msg.confidence < 0.7 && !msg.isError && (
                  <small className="confidence-warning">⚠️ Low confidence</small>
                )}
                <span className="msg-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="msg assistant">
            <div className="msg-avatar"><Bot size={18} /></div>
            <div className="typing-msg">
              <Loader2 className="animate-spin" size={16} />
              <span>AI is thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="input-row">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your issue in detail…"
            disabled={isTyping}
            rows={2}
          />
          <button
            className="btn-send"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
