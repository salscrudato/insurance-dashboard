/**
 * AI Chat Component
 * Modal chat interface with OpenAI integration
 * Optimized for AI coding agents with clear state management
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { generateChatResponse } from '../services/openaiService';
import './AIChat.css';

/**
 * AIChat Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether chat modal is open
 * @param {Function} props.onClose - Callback to close chat
 * @param {Object} props.dashboardData - Current dashboard data for context
 */
const AIChat = ({ isOpen, onClose, dashboardData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm your AI insurance analyst. I can help you understand the financial metrics and performance of ${dashboardData?.ticker || 'the selected company'}. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /**
   * Scroll to bottom of messages with fallback for testing
   */
  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Focus input when modal opens
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Scroll to bottom when messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Generate AI response
      const aiResponse = await generateChatResponse(inputMessage.trim(), dashboardData);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check if your OpenAI API key is configured correctly.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input key press
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Clear chat history
   */
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Chat cleared! I'm ready to help you analyze ${dashboardData?.ticker || 'the selected company'}. What would you like to know?`,
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="ai-chat-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      aria-describedby="chat-description"
    >
      <div className="ai-chat-modal">
        {/* Enhanced Header */}
        <div className="chat-header">
          <div className="header-info">
            <Bot className="bot-icon" aria-hidden="true" />
            <div>
              <h3 id="chat-title">AI Insurance Analyst</h3>
              <p id="chat-description">
                Ask questions about {dashboardData?.ticker || 'insurance data'}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={handleClearChat}
              className="btn-clear btn btn-ghost"
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="btn-close btn btn-ghost"
              title="Close chat"
              aria-label="Close AI chat"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Enhanced Messages */}
        <div
          className="chat-messages"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.type} ${message.isError ? 'error' : ''}`}
              role="article"
              aria-label={`${message.type === 'ai' ? 'AI' : 'User'} message`}
            >
              <div className="message-avatar" aria-hidden="true">
                {message.type === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.type === 'ai' ? (
                    <AIResponseFormatter text={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
                <div className="message-time" aria-label={`Sent at ${message.timestamp.toLocaleTimeString()}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div
              className="message ai loading"
              role="status"
              aria-live="polite"
              aria-label="AI is generating response"
            >
              <div className="message-avatar" aria-hidden="true">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <Loader2 className="spinner" aria-hidden="true" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="chat-error">
            <span>Error: {error}</span>
          </div>
        )}

        {/* Enhanced Input */}
        <div className="chat-input">
          <div className="input-container">
            <label htmlFor="chat-textarea" className="sr-only">
              Ask a question about insurance data
            </label>
            <textarea
              id="chat-textarea"
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about financial metrics, ratios, or company performance..."
              className="message-input"
              rows={1}
              disabled={isLoading}
              aria-describedby="input-help"
              maxLength={500}
            />
            <div id="input-help" className="sr-only">
              Type your question and press Enter to send, or Shift+Enter for new line
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button btn btn-primary"
              title="Send message"
              aria-label="Send message to AI assistant"
            >
              <Send size={16} aria-hidden="true" />
              <span className="sr-only">Send</span>
            </button>
          </div>

          {/* Character count */}
          <div className="input-meta">
            <span className="char-count">
              {inputMessage.length}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * AI Response Formatter Component
 * Handles clean formatting of AI responses for optimal UX
 */
const AIResponseFormatter = ({ text }) => {
  if (!text) return null;

  // Split text into paragraphs and clean formatting
  const paragraphs = text
    .split('\n\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map(paragraph => paragraph.trim());

  return (
    <div className="ai-response-formatted">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="ai-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default AIChat;

/**
 * Suggested questions for users (can be displayed as quick actions)
 */
export const SUGGESTED_QUESTIONS = [
  "What does the combined ratio tell us about this company?",
  "How does this company's ROE compare to industry standards?",
  "What are the key risk factors for this insurer?",
  "Is this company's expense ratio competitive?",
  "What does the loss ratio indicate about underwriting quality?"
];
