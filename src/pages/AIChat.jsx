// import { useState, useEffect } from 'react';
// import { Send, Bot, User, Wrench, UserCog, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
// import api from '../utils/api';

// export default function AIChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [subCategories, setSubCategories] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [currentUser] = useState({ id: 1, company_id: 1, name: 'John Doe', role: 'admin' });

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         const response = await api.get(`/api/chat/${currentUser.id}`);
//         if (response.data && response.data.length > 0) {
//           const history = response.data.map(msg => ({
//             role: msg.role,
//             content: msg.content,
//             timestamp: new Date(msg.timestamp)
//           }));
//           setMessages(history);
//         }
//       } catch (err) {
//         console.error('Error loading chat history:', err);
//       }
//     };
//     fetchChatHistory();
//   }, [currentUser.id]);


//   const categories = [
//     { id: 'asset', name: 'Asset Issue', icon: Wrench, color: '#667eea' },
//     { id: 'user_management', name: 'User Management', icon: UserCog, color: '#10b981' },
//     { id: 'attendance', name: 'Attendance', icon: Clock, color: '#f59e0b' },
//     { id: 'general_it', name: 'General IT', icon: AlertCircle, color: '#ef4444' }
//   ];

//   const subCategoryMap = {
//     'asset': ['Laptop Issue', 'Monitor Problem', 'Software Error', 'Hardware Request', 'Other'],
//     'user_management': ['Login Issue', 'Password Reset', 'Access Request', 'Other'],
//     'attendance': ['Leave Request', 'Punch-in/out Issue', 'Timesheet Correction', 'Other'],
//     'general_it': ['Network/Wi-Fi Issue', 'Email Problem', 'Printer Issue', 'Other']
//   };

//   const handleCategorySelect = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setSubCategories(subCategoryMap[categoryId]);
//   };

//   const handleSubCategorySelect = async (subCategory) => {
//     setSubCategories(null);
//     const userMsg = {
//       role: 'user',
//       content: subCategory,
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMsg]);
//     setIsTyping(true);

//     try {
//       // Create backend request simulating user input to trigger AI logic and store to DB
//       const response = await api.post('/api/chat', {
//         message: subCategory,
//         user_id: currentUser.id,
//         company_id: currentUser.company_id,
//         category: selectedCategory
//       });
      
//       if (response.data) {
//         setMessages(prev => [...prev, {
//           role: 'assistant',
//           content: response.data.solution || response.data.response,
//           timestamp: new Date()
//         }]);
//       }
//     } catch (e) {
//       console.error(e);
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: `Got it. Could you please describe your ${subCategory.toLowerCase()} in a bit more detail?`,
//         timestamp: new Date()
//       }]);
//     }
    
//     setIsTyping(false);
//   };

//   const handleSend = async () => {
//     if (!input.trim() || !selectedCategory) return;
  
//   const userMessage = input.trim();
//   setInput('');
//   setIsTyping(true);
  
//   // Add user message
//   setMessages(prev => [...prev, {
//     role: 'user',
//     content: userMessage,
//     timestamp: new Date()
//   }]);
  
//   try {
//     const response = await api.post('/api/chat', {
//       message: userMessage,
//       user_id: currentUser.id,
//       company_id: currentUser.company_id,
//       category: selectedCategory
//     });
    
//     const data = response.data;
    
//     // Check if awaiting upgrade details
//     if (data.awaiting_details) {
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: data.solution,
//         timestamp: new Date(),
//         isWorkflow: true
//       }]);
//     } else if (data.needs_ticket) {
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: data.solution,
//         timestamp: new Date()
//       }]);
//     } else {
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: `✅ **Solution:**\n\n${data.solution}`,
//         timestamp: new Date()
//       }]);
//     }
//   } catch (error) {
//     console.error('AI Chat Error:', error);
//     setMessages(prev => [...prev, {
//       role: 'assistant',
//       content: "❌ Sorry, I encountered an error. Please try again.",
//       timestamp: new Date()
//     }]);
//   }
  
//   setIsTyping(false);
// };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="ai-chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//       {/* Header */}
//       <div className="chat-header">
//         <div className="header-content">
//           <Bot size={32} className="bot-icon" />
//           <div>
//             <h1>AI Support Assistant</h1>
//             <p>Get instant help or create tickets automatically</p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages (Always Visible) */}
//       <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', minHeight: '400px', paddingBottom: '30px' }}>
        
//         {/* Permanent Initial Greeting */}
//         <div className="message assistant">
//           <div className="message-avatar">
//             <Bot size={24} />
//           </div>
//           <div className="message-content">
//             <div className="message-text">
//               👋 Hi! I'm your AI Support Assistant.<br/><br/>
//               Please select a category below to get started!
//             </div>
//           </div>
//         </div>

//         {messages.map((msg, idx) => (
//           <div key={idx} className={`message ${msg.role}`}>
//             <div className="message-avatar">
//               {msg.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
//             </div>
//             <div className="message-content">
//               <div 
//                 className="message-text"
//                 dangerouslySetInnerHTML={{ 
//                   __html: msg.content
//                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                     .replace(/\n/g, '<br>')
//                 }}
//               />
//               <span className="message-time">
//                 {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="message assistant">
//             <div className="message-avatar">
//               <Bot size={24} />
//             </div>
//             <div className="message-content">
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Category Selection Grid */}
//       {!selectedCategory && (
//         <div className="category-selection" style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
//           <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#334155', textAlign: 'center' }}>Select a category to get started</h2>
//           <div className="category-grid">
//             {categories.map(cat => (
//               <button
//                 key={cat.id}
//                 className="category-card"
//                 onClick={() => handleCategorySelect(cat.id)}
//                 style={{ borderColor: cat.color }}
//               >
//                 <cat.icon size={40} style={{ color: cat.color }} />
//                 <h3>{cat.name}</h3>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chat Interface Controls */}
//       {selectedCategory && (
//         <div style={{ borderTop: '1px solid #e2e8f0', background: '#fff' }}>
//           {subCategories && (
//             <div className="sub-categories-wrapper" style={{ padding: '10px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//               {subCategories.map((sub, idx) => (
//                 <button 
//                   key={idx} 
//                   onClick={() => handleSubCategorySelect(sub)}
//                   style={{ 
//                     borderRadius: '20px', 
//                     padding: '8px 16px', 
//                     backgroundColor: '#fff',
//                     border: '1px solid #cbd5e1',
//                     color: '#334155',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     transition: 'all 0.2s',
//                     boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//                   }}
//                   onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
//                   onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
//                 >
//                   {sub}
//                 </button>
//               ))}
//             </div>
//           )}

//           <div className="chat-input-container">
//             <div className="input-wrapper">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Describe your issue in detail..."
//                 rows="3"
//               />
//               <button 
//                 className="btn-send"
//                 onClick={handleSend}
//                 disabled={!input.trim() || isTyping}
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//             <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// Help-Desk-UI/src/pages/AIChat.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { callCustomAssetAI } from '../utils/api';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your AI Asset Management Assistant. I can help you with:\n• Asset replacement requests\n• Upgrade eligibility\n• Troubleshooting hardware issues\n• Creating support tickets\n\nWhat can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);
    setError(null);
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    
    try {
      // Call your custom trained AI backend
      const aiResult = await callCustomAssetAI(userMessage, 1, 1);
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResult.response,
        timestamp: new Date(),
        action: aiResult.action,
        confidence: aiResult.confidence
      }]);
      
      // Auto-create ticket if AI suggests it
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
      
      // Fallback message
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
    <div className="ai-chat-container">
      {/* Header */}
      <div className="chat-header">
        <Bot size={24} />
        <h2>AI Asset Assistant</h2>
        <span className="status-badge online">● Online</span>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`message ${msg.role} ${msg.isError ? 'error' : ''} ${msg.isSystem ? 'system' : ''}`}
          >
            <div className="message-avatar">
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
              {msg.action && msg.action !== 'answer' && (
                <span className="action-badge">{msg.action}</span>
              )}
              {msg.confidence < 0.7 && !msg.isError && (
                <small className="confidence-warning">⚠️ Low confidence</small>
              )}
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message assistant typing">
            <div className="message-avatar"><Bot size={20} /></div>
            <div className="message-content">
              <Loader2 className="animate-spin" size={20} />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your issue in detail..."
            disabled={isTyping}
            rows={2}
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
    </div>
  );
}