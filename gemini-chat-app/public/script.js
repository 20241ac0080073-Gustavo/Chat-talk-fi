const chat = document.getElementById('chat');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send');

let typingIndicator = null;

sendBtn.addEventListener('click', sendMessage);
promptInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, 'user');
    promptInput.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        hideTyping();

        if (data.error) {
            addMessage(`Erro: ${data.error}`, 'bot');
        } else {
            addMessage(data.response, 'bot');
        }
    } catch (error) {
        hideTyping();
        addMessage('Erro de conexão. Tente novamente.', 'bot');
    }

    sendBtn.disabled = false;
    promptInput.focus();
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
    typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing';
    typingIndicator.textContent = 'Gemini está pensando...';
    chat.appendChild(typingIndicator);
    chat.scrollHeight = chat.scrollHeight;
}

function hideTyping() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

promptInput.focus();
