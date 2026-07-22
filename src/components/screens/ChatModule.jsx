import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, Send, MoreVertical, Settings } from 'lucide-react';

export default function ChatModule() {
  const { activeScreen } = useContext(AppContext);
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'grok', text: 'Hello! I am Grok. How can I assist you with your pet needs today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: typedMessage };
    setMessages(prev => [...prev, userMsg]);
    setTypedMessage('');
    setIsTyping(true);

    // Simulated response instead of Groq API
    setTimeout(() => {
      const grokMsg = {
        id: Date.now() + 1,
        sender: 'grok',
        text: "I am currently running in offline mode. Please contact support if you need live assistance!"
      };
      setMessages(prev => [...prev, grokMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!['ChatList', 'IndividualChat', 'VoiceMessage', 'VideoCall'].includes(activeScreen)) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000000', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }} className="animate-fade-in">
      {/* Grok Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0a0a0a',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={24} style={{ color: '#fff' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>Grok</h1>
          <span style={{ background: '#333', color: '#aaa', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px' }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', color: '#888' }}>
          <Settings size={20} style={{ cursor: 'pointer' }} />
          <MoreVertical size={20} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Messages View */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: '140px' // Space for input and bottom nav
      }} className="no-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '12px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
            {msg.sender === 'grok' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={18} style={{ color: '#000' }} />
              </div>
            )}
            <div style={{
              background: msg.sender === 'user' ? '#222' : 'transparent',
              color: '#fff',
              padding: msg.sender === 'user' ? '10px 16px' : '6px 0',
              borderRadius: '16px',
              maxWidth: '85%',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              wordBreak: 'break-word'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} style={{ color: '#000' }} />
            </div>
            <div style={{ color: '#888', fontSize: '0.9rem', padding: '6px 0' }}>Grok is typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          position: 'absolute',
          bottom: '60px', // Sit right above the BottomNav
          left: 0, 
          right: 0,
          background: '#0a0a0a',
          borderTop: '1px solid #333',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          background: '#1a1a1a',
          borderRadius: '24px',
          padding: '6px 6px 6px 16px',
          border: '1px solid #333'
        }}>
          <input 
            type="text" 
            placeholder="Ask Grok..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: '#fff',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <button 
            type="submit"
            disabled={!typedMessage.trim()}
            style={{
              background: typedMessage.trim() ? '#fff' : '#333',
              color: typedMessage.trim() ? '#000' : '#888',
              width: '36px', height: '36px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none',
              transition: 'all 0.2s',
              cursor: typedMessage.trim() ? 'pointer' : 'default'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
