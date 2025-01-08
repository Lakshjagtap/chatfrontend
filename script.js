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
  displayMessage(message, 'user', 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png');

  // Send the message to the backend
  fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.botResponse) {
        displayMessage(data.botResponse, 'bot', 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      displayMessage('Sorry, something went wrong!', 'bot', 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png');
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
        const avatarUrl = chat.sender === 'user'
          ? 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png' 
          : 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png';
        displayMessage(chat.message, chat.sender, avatarUrl);
      });
    })
    .catch((error) => {
      console.error('Error loading chat history:', error);
    });
}
