import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Plus, MessageSquare, Trash2 } from 'lucide-react';
import api, { callCustomAssetAI } from '../utils/api';

export default function AIChat() {
  // Load sessions from localStorage or initialize with one session
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('nira_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
    return [{
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: "👋 Hello! I'm your AI Asset Management Assistant. How can I assist you today?",
        timestamp: new Date().toISOString()
      }]
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('nira_current_session_id') || (sessions[0] ? sessions[0].id : '');
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession ? currentSession.messages : [];

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem('nira_chat_sessions', JSON.stringify(sessions));
    localStorage.setItem('nira_current_session_id', currentSessionId);
  }, [sessions, currentSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const createNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: "Hello! Starting a new conversation. How can I help you?",
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
      createNewChat();
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

    // Update current session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const newTitle = s.messages.length <= 1 ? userMessageText.substring(0, 30) : s.title;
        return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
      }
      return s;
    }));

    setInput('');
    setIsTyping(true);
    setError(null);
    
    try {
      // Get current user from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.user_id || 1;

      // Call the AI backend (8003)
      const aiResult = await callCustomAssetAI(userMessageText, userId, 1);
      
      const botMessage = {
        role: 'assistant',
        content: aiResult.response,
        timestamp: new Date().toISOString(),
        action: aiResult.action,
        confidence: aiResult.confidence
      };

      // REAL EXECUTION: If AI returns a ticket creation action, call the main backend (8002)
      if (aiResult.action === 'create_ticket' || aiResult.response.includes('<execute>')) {
        let ticketData = {};
        const executeMatch = aiResult.response.match(/<execute>(.*?)<\/execute>/);
        if (executeMatch) {
          try { ticketData = JSON.parse(executeMatch[1]).data; } catch(e){}
        }

        const payload = {
          user_id: userId,
          title: ticketData.title || `AI Ticket: ${userMessageText.substring(0, 20)}`,
          description: ticketData.description || userMessageText,
          priority: ticketData.priority || 'normal'
        };
        
        try {
          const res = await api.post('/api/tickets', payload);
          if (res.data.status === 'success') {
            console.log('✅ Real ticket created:', res.data.ticket_id);
            botMessage.content += `\n\n> ⚙️ **System Note:** Ticket logged successfully (ID: ${res.data.ticket_id})`;
          }
        } catch (ticketErr) {
          console.error('❌ Failed to create real ticket:', ticketErr);
          botMessage.content += `\n\n> ⚠️ **System Note:** Could not log ticket in database. Error: ${ticketErr.message}`;
        }
      }

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, botMessage] }
          : s
      ));
      
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
    <div className="ai-chat-full-screen">
      {/* Sidebar - Chat History */}
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          <Plus size={16} />
          <span>New chat</span>
        </button>

        <div className="history-list">
          <div className="history-label">Recent Chats</div>
          {sessions.map(s => (
            <div 
              key={s.id} 
              className={`history-item ${s.id === currentSessionId ? 'active' : ''}`}
              onClick={() => setCurrentSessionId(s.id)}
            >
              <MessageSquare size={16} />
              <span className="session-title">{s.title}</span>
              <Trash2 size={14} className="delete-icon" onClick={(e) => deleteSession(s.id, e)} />
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar-small">U</div>
            <span>User Account</span>
          </div>
        </div>
      </div>
      
      <div className="chat-main-area">
        {/* Header */}
        <div className="chat-top-nav">
          <div className="nav-left">
            <Bot size={24} className="bot-icon-glow" />
            <div className="bot-info">
              <h3>NIRA AI Assistant</h3>
              <div className="online-status">
                <span className="pulse-dot"></span>
                <span>Ready to assist</span>
              </div>
            </div>
          </div>
          <div className="nav-right">
            <button className="btn-icon-ghost"><AlertCircle size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-scroller">
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-bubble-wrapper ${msg.role} ${msg.isError ? 'error' : ''} ${msg.isSystem ? 'system' : ''}`}
              >
                <div className="bubble-avatar">
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="bubble-content-area">
                  <div className="sender-name">
                    {msg.role === 'user' ? 'You' : 'NIRA AI'}
                  </div>
                  <div 
                    className="bubble-text"
                    dangerouslySetInnerHTML={{ 
                      __html: msg.content
                        .replace(/<execute>.*?<\/execute>/g, '') // Hide JSON tags
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                  <span className="bubble-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble-wrapper assistant typing">
                <div className="bubble-avatar"><Bot size={18} className="animate-spin-slow" /></div>
                <div className="bubble-content-area">
                  <div className="sender-name">NIRA AI</div>
                  <div className="typing-loader">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="chat-bottom-bar">
          <div className="input-box-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message NIRA AI..."
              disabled={isTyping}
              rows={1}
            />
            <button 
              className={`send-circle-btn ${input.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="footer-disclaimer">AI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
}