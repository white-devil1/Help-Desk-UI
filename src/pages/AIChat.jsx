import { useState } from 'react';
import { Send, Bot, User, Wrench, UserCog, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI Support Assistant. I can help you with:\n\n🖥️ **Asset Issues** - Laptop, monitor, software problems\n👤 **User Management** - Login, password, account issues\n⏰ **Attendance** - Leave, punch-in, timesheet problems\n🎫 **General IT** - Any other technical issues\n\nSelect a category to get started!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser] = useState({ id: 1, company_id: 1, name: 'John Doe', role: 'employee' });

  const categories = [
    { id: 'asset', name: 'Asset Issue', icon: Wrench, color: '#667eea' },
    { id: 'user_management', name: 'User Management', icon: UserCog, color: '#10b981' },
    { id: 'attendance', name: 'Attendance', icon: Clock, color: '#f59e0b' },
    { id: 'general_it', name: 'General IT', icon: AlertCircle, color: '#ef4444' }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: `I need help with ${category.name}`,
      timestamp: new Date()
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! Please describe your ${category.name} issue in detail. I'll try to help you resolve it.`,
        timestamp: new Date()
      }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedCategory) return;
  
  const userMessage = input.trim();
  setInput('');
  setIsTyping(true);
  
  // Add user message
  setMessages(prev => [...prev, {
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  }]);
  
  try {
    const userId = 1; // Hardcoded for demo
    const companyId = 1;
    
    const response = await api.post('/api/chat/analyze', {
      message: userMessage,
      user_id: userId,
      company_id: companyId,
      category: selectedCategory
    });
    
    const data = response.data;
    
    // Check if awaiting upgrade details
    if (data.awaiting_details) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.solution,
        timestamp: new Date(),
        isWorkflow: true
      }]);
    } else if (data.needs_ticket) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.solution,
        timestamp: new Date()
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **Solution:**\n\n${data.solution}`,
        timestamp: new Date()
      }]);
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "❌ Sorry, I encountered an error. Please try again.",
      timestamp: new Date()
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
    <div className="ai-chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => window.location.href = '/'}>
            <ArrowLeft size={20} />
          </button>
          <Bot size={32} className="bot-icon" />
          <div>
            <h1>AI Support Assistant</h1>
            <p>Get instant help or create tickets automatically</p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="category-selection">
          <h2>What issue are you facing?</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className="category-card"
                onClick={() => handleCategorySelect(cat.id)}
                style={{ borderColor: cat.color }}
              >
                <cat.icon size={40} style={{ color: cat.color }} />
                <h3>{cat.name}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {selectedCategory && (
        <>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
                </div>
                <div className="message-content">
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ 
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="message-avatar">
                  <Bot size={24} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your issue in detail..."
                rows="3"
              />
              <button 
                className="btn-send"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </>
      )}
    </div>
  );
}