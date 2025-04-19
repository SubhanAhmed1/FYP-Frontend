import { useEffect, useState } from 'react';
import { IoMdSend } from "react-icons/io";
import Proximalogo from '../img/avatar.jpeg';
import './ChatBot.css';
import { useNavigate } from 'react-router-dom'; // make sure you're using react-router

function Chatbot() {
  const [inputValue, setInputValue] = useState('');
  const [userType, setUserType] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [showInputField, setShowInputField] = useState(true);
  const [messages, setMessages] = useState([]);
  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [incomingMessages, setIncomingMessages] = useState([
    {
      message: "Greetings, I’m the HR Bot here to assist you.",
      direction: 'incomingMessages',
      sender: "Bot"
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Get role from auth (this could be from context, redux, or an API)
    const role = localStorage.getItem("role");
    const normalizedRole = role?.toLowerCase(); 
    console.log(role) // e.g., 'hr' or 'employee'

    if (role === 'HR' || role === 'employee') {
      setUserType(normalizedRole);
      console.log("User Type:", normalizedRole); // Check the user type
      setAuthorized(true);
    } else {
      setAuthorized(false);
      navigate('/unauthorized'); // Redirect to access denied page (or login)
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        user_id: "new",
        prompt: inputValue,
        user_type: userType// 👈 dynamic based on login
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://cb90-103-244-178-89.ngrok-free.app/chat", requestOptions);
      const resultText = await response.json();
      setIncomingMessages([...incomingMessages, { message: resultText.message, sender: "Bot" }]);

    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      setOutgoingMessages([...outgoingMessages, { message: inputValue, sender: "User" }]);
      setInputValue('');
      fetchData();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const mergeMessages = (incoming, outgoing) => {
    const merged = [];
    const maxLength = Math.max(incoming.length, outgoing.length);
    for (let i = 0; i < maxLength; i++) {
      if (incoming[i]) merged.push(incoming[i]);
      if (outgoing[i]) merged.push(outgoing[i]);
    }
    return merged;
  };

  const allMessages = mergeMessages(incomingMessages, outgoingMessages);

  // If unauthorized, don't show chat
  if (!authorized) {
    return null; // or a loading spinner until redirect happens
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages">
          {allMessages.map((message, index) => (
            <div key={index} className={`message-row ${message.sender === 'User' ? 'user' : 'bot'}`}>
              {message.sender === 'Bot' && (
                <img src={Proximalogo} alt="Bot" className="bot-avatar" />
              )}
              <div className={`message-bubble ${message.sender.toLowerCase()}`}>
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="input-area">
        {showInputField && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
          />
        )}
        <button onClick={handleSend}>
          <IoMdSend className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
