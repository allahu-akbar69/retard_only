// const chatBox = document.getElementById('chat-box');
// const input = document.getElementById('user-input');
// const button = document.getElementById('send-btn');

// function addMessage(sender, message) {
//   const div = document.createElement('div');
//   div.classList.add('msg');
//   div.innerHTML = `<span class="${sender}">${sender === 'user' ? 'You' : 'Bot'}:</span> ${message}`;
//   chatBox.appendChild(div);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// button.addEventListener('click', async () => {
//   const msg = input.value.trim();
//   if (!msg) return;
//   addMessage('user', msg);
//   input.value = '';

//   try {
//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message: msg }),
//     });
//     const data = await res.json();
//     addMessage('bot', data.reply);
//   } catch (e) {
//     console.error('Error:', e);
//     addMessage('bot', 'Error: could not connect to server.');
//   }
// });


// async function sendMessage(userMessage) {
//   const response = await fetch('/api/chat', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ message: userMessage })
//   });

//   const data = await response.json();
//   return data.reply;
// }


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

  async function sendMessage(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (e) {
      console.error('Error:', e);
      return 'Error: could not connect to server.';
    }
  }

  button.addEventListener('click', async () => {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage('user', msg);
    input.value = '';

    const reply = await sendMessage(msg);
    addMessage('bot', reply);
  });

  // Optional: press Enter to send
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      button.click();
    }
  });