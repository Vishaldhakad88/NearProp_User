import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import './FloatingChat.css';

const FloatingChat = ({ isGuest, isBasicPlan, onOpenChat }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const navigate = useNavigate();

  const handleChatClick = () => {
    const authData = localStorage.getItem('authData');
    
    if (!authData) {
      // If not logged in, redirect to login
      alert('Please login to use chat feature');
      navigate('/login');
    } else {
      // If logged in, navigate to chat page
      navigate('/chat');
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="floating-chat-button" onClick={handleChatClick}>
        <FontAwesomeIcon icon={faComments} className="chat-icon" />
        <span className="chat-badge">💬</span>
      </div>
    </>
  );
};

export default FloatingChat;