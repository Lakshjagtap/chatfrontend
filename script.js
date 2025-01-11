// Emoji List
const emojis = ['😊', '😂', '😎', '😍', '🙄', '😭', '😢', '😡', '👍', '👏', '🙏', '🥺', '🤔', '💖'];

// DOM Elements
const emojiButton = document.getElementById('emoji-button');
const messageInput = document.getElementById('message-input');
const chatMessages = document.querySelector('.chat-messages');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator'); // Ensure this is in your HTML

// Backend URL (update with your Render URL)
const API_URL = 'https://chatbackend-rvdq.onrender.com';

// Toggle Emoji Picker Visibility
let emojiPickerVisible = false;

emojiButton.addEventListener('click', () => {
  emojiPickerVisible = !emojiPickerVisible;

  if (emojiPickerVisible) {
    showEmojiPicker();
  } else {
    hideEmojiPicker();
  }
});

// Function to Show Emoji Picker
function showEmojiPicker() {
  const emojiPicker = document.createElement('div');
  emojiPicker.id = 'emoji-picker';
  emojiPicker.style.position = 'absolute';
  emojiPicker.style.bottom = '50px';
  emojiPicker.style.right = '20px';
  emojiPicker.style.display = 'grid';
  emojiPicker.style.gridTemplateColumns = 'repeat(5, 1fr)';
  emojiPicker.style.gridGap = '5px';
  emojiPicker.style.backgroundColor = '#2c2c2c';
  emojiPicker.style.padding = '10px';
  emojiPicker.style.borderRadius = '8px';
  emojiPicker.style.zIndex = '1000';

  emojis.forEach(emoji => {
    const emojiButton = document.createElement('button');
    emojiButton.innerText = emoji;
    emojiButton.style.fontSize = '20px';
    emojiButton.style.backgroundColor = 'transparent';
    emojiButton.style.border = 'none';
    emojiButton.style.cursor = 'pointer';

    emojiButton.addEventListener('click', () => {
      insertEmoji(emoji);
      hideEmojiPicker();
    });

    emojiPicker.appendChild(emojiButton);
  });

  document.body.appendChild(emojiPicker);
}

// Function to Insert Emoji into Input
function insertEmoji(emoji) {
  messageInput.value += emoji;
  messageInput.focus();
}

// Function to Hide Emoji Picker
function hideEmojiPicker() {
  const emojiPicker = document.getElementById('emoji-picker');
  if (emojiPicker) {
    emojiPicker.remove();
  }
  emojiPickerVisible = false;
}

// Show Buffering Spinner
function showBuffering() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

// Hide Buffering Spinner
function hideBuffering() {
  document.getElementById('loading-overlay').style.display = 'none';
}

// Function to Simulate Typing Effect
function simulateTypingEffect(text, sender, avatar) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender);

  const avatarElement = document.createElement('img');
  avatarElement.src = avatar;
  avatarElement.alt = `${sender} avatar`;
  avatarElement.classList.add('avatar');

  const textElement = document.createElement('span');
  messageElement.appendChild(avatarElement);
  messageElement.appendChild(textElement);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  let charIndex = 0;

  function typeCharacter() {
    if (charIndex < text.length) {
      textElement.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeCharacter, 30); // Adjust typing speed here
    }
  }

  typeCharacter();
}

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

  // Show buffering spinner
  showBuffering();

  // Send the message to the backend
  fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      hideBuffering();
      if (data.botResponse) {
        simulateTypingEffect(data.botResponse, 'bot', 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      hideBuffering();
      displayMessage('Sorry, something went wrong!', 'bot', 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png');
    });

  messageInput.value = '';
}

// Function to Display a Message (Without Typing Effect)
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

// Function to Load Chat History from Backend
function loadChatHistory() {
  // Show loading indicator while fetching
  showBuffering();

  fetch(`${API_URL}/chats`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }
      return response.json();
    })
    .then((chats) => {
      hideBuffering();
      chats.forEach((chat) => {
        const avatarUrl = chat.sender === 'user'
          ? 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png'
          : 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png';
        displayMessage(chat.message, chat.sender, avatarUrl);
      });
    })
    .catch((error) => {
      console.error('Error loading chat history:', error);
      hideBuffering();
      displayMessage('Sorry, could not load previous chats.', 'bot', 'https://w7.pngwing.com/pngs/983/399/png-transparent-computer-icons-internet-bot-robot-robot-thumbnail.png');
    });
}
