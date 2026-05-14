import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Plus, MessageSquare, Trash2 } from 'lucide-react';
import api, { callCustomAssetAI } from '../utils/api';
import '../App.css';

export default function AIChat() {
  // ── Session Management ──────────────────────────────────────────────────
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('nira_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to load chat sessions:', e);
      }
    }
    return [{
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: "👋 Hello! I'm your AI Asset Management Assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('nira_current_session_id') || sessions[0].id;
  });

  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError]       = useState(null);
  const messagesEndRef           = useRef(null);

  const activeSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = activeSession.messages;

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem('nira_chat_sessions', JSON.stringify(sessions));
    localStorage.setItem('nira_current_session_id', currentSessionId);
  }, [sessions, currentSessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: "Hello! Starting a new conversation. How can I assist you?",
        timestamp: new Date().toISOString()
      }]
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      handleNewChat();
    } else {
      setSessions(updated);
      if (currentSessionId === id) setCurrentSessionId(updated[0].id);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessageText = input.trim();
    const userMessage = {
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toISOString()
    };

    // Add user message and update title if it's the first one
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const isFirstMessage = s.messages.length <= 1;
        const newTitle = isFirstMessage ? userMessageText.substring(0, 30) + (userMessageText.length > 30 ? '...' : '') : s.title;
        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Call the AI (8003)
      const aiResult = await callCustomAssetAI(userMessageText, 1, 1);
      
      const botMessage = {
        role: 'assistant',
        content: aiResult.response,
        timestamp: new Date().toISOString(),
        action: aiResult.action,
        confidence: aiResult.confidence
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, botMessage] };
        }
        return s;
      }));

      // REAL EXECUTION: If AI returns a ticket creation action, call the main backend (8002)
      if (aiResult.action === 'create_ticket' || aiResult.response.includes('<execute>')) {
        let ticketData = {};
        
        // Extract data if it's in the <execute> tag format
        const executeMatch = aiResult.response.match(/<execute>(.*?)<\/execute>/);
        if (executeMatch) {
          try {
            const parsed = JSON.parse(executeMatch[1]);
            ticketData = parsed.data || {};
          } catch(e) {
            console.error('Failed to parse execution data:', e);
          }
        }

        const payload = {
          user_id: 1, // Default for demo, should come from auth
          title: ticketData.title || `AI Request: ${userMessageText.substring(0, 30)}`,
          description: ticketData.description || userMessageText,
          priority: ticketData.priority || 'normal'
        };

        try {
          const res = await api.post('/api/tickets', payload);
          if (res.data.status === 'success') {
            setTimeout(() => {
              const systemMsg = {
                role: 'assistant',
                content: `✅ **System Note:** Ticket successfully logged in CRM (ID: ${res.data.ticket_id}). You can now see it in the "All Tickets" section.`,
                timestamp: new Date().toISOString(),
                isSystem: true
              };
              setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                  return { ...s, messages: [...s.messages, systemMsg] };
                }
                return s;
              }));
            }, 1000);
          }
        } catch (ticketErr) {
          console.error('❌ Failed to create real ticket:', ticketErr);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection failed. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* ── Sidebar: History ───────────────────────────────────────────── */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>
        
        <div className="history-list">
          {sessions.map(s => (
            <div 
              key={s.id} 
              className={`session-item ${s.id === currentSessionId ? 'active' : ''}`}
              onClick={() => setCurrentSessionId(s.id)}
            >
              <MessageSquare size={16} />
              <span className="session-title">{s.title}</span>
              <button 
                className="btn-delete-session" 
                onClick={(e) => deleteSession(s.id, e)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────── */}
      <div className="chat-page">
        <header className="chat-hdr">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} />
          </div>
          <h2>AI Asset Assistant</h2>
          <span className="badge badge-online">● Online</span>
        </header>

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
                      .replace(/<execute>.*?<\/execute>/g, '') // Hide execution tags from user
                      .replace(/\n/g, '<br/>')
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {msg.action && msg.action !== 'answer' && (
                    <span className="action-badge">{msg.action}</span>
                  )}
                  {msg.confidence < 0.7 && !msg.isError && msg.role === 'assistant' && (
                    <small className="confidence-warning">⚠️ Low confidence</small>
                  )}
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        <footer className="chat-input-area">
          <div className="input-row">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message NIRA AI..."
              disabled={isTyping}
              rows={1}
            />
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="input-hint">AI can make mistakes. Check important info.</p>
        </footer>
      </div>
    </div>
  );
}
