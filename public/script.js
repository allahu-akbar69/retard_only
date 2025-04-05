const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const button = document.getElementById('send-btn');

function addMessage(sender, message) {
  const div = document.createElement('div');
  div.classList.add('msg');
  div.innerHTML = `<span class="${sender}">${sender === 'user' ? 'You' : 'Bot'}:</span> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

button.addEventListener('click', async () => {
  const msg = input.value.trim();
  if (!msg) return;
  addMessage('user', msg);
  input.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    addMessage('bot', data.reply);
  } catch (e) {
    addMessage('bot', 'Error: could not connect to server.');
  }
});
