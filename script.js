// script.js

// DOM Elements
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const chatMessages = document.querySelector('.chat-messages');

// Backend URL (update with your Render URL)
const API_URL = 'https://chatbackend-1-cnge.onrender.com';

// Event Listener for Sending Messages
sendButton.addEventListener('click', sendMessage);

// Function to Send a Message
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) {
    alert('Please enter a message.');
    return;
  }

  // Display the user's message
  displayMessage(message, 'user', './images/useravatar.png');

  // Send the message to the backend
  fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.botResponse) {
        displayMessage(data.botResponse, 'bot', './images/avatar.png');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMessage('Sorry, something went wrong!', 'bot', './images/avatar.png');
    });

  messageInput.value = '';
}

// Function to Display a Message
function displayMessage(content, sender, avatar) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender);

  const avatarElement = document.createElement('img');
  avatarElement.src = avatar;
  avatarElement.alt = `${sender} avatar`;
  avatarElement.classList.add('avatar');

  const textElement = document.createElement('span');
  textElement.textContent = content;

  messageElement.appendChild(avatarElement);
  messageElement.appendChild(textElement);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load chat history on page load
document.addEventListener('DOMContentLoaded', loadChatHistory);

// Function to load chat history from backend
function loadChatHistory() {
  fetch(`${API_URL}/chats`)
    .then((response) => response.json())
    .then((chats) => {
      chats.forEach((chat) => {
        displayMessage(chat.message, chat.sender, chat.sender === 'user' ? './images/useravatar.png' : './images/avatar.png');
      });
    })
    .catch((error) => {
      console.error('Error loading chat history:', error);
    });
}
