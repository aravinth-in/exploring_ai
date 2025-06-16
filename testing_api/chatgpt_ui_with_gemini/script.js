document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatTextarea = document.getElementById('chat-textarea');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const initialPrompt = document.querySelector('.initial-prompt');

    const GEMINI_API_KEY = '';
    const modelName = 'gemini-1.5-flash';

    // Check if GoogleGenerativeAI is available (from the CDN import)
    if (typeof window.GoogleGenerativeAI === 'undefined') {
        console.error('GoogleGenerativeAI SDK not loaded. Make sure the script tag is correct in index.html.');
        // Disable features that rely on the API
        chatForm.style.display = 'none';
        alert('Gemini API SDK failed to load. Please check your network or browser console.');
        return;
    }

    const genAI = new window.GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Function to adjust textarea height
    function adjustTextareaHeight() {
        chatTextarea.style.height = 'auto'; // Reset height
        chatTextarea.style.height = chatTextarea.scrollHeight + 'px'; // Set to scroll height
    }

    // Adjust textarea height on input and initial load
    chatTextarea.addEventListener('input', adjustTextareaHeight);
    adjustTextareaHeight(); // Initial adjustment

    // Enable/disable send button based on textarea content
    chatTextarea.addEventListener('keyup', () => {
        sendButton.disabled = chatTextarea.value.trim() === '';
    });
    sendButton.disabled = true; // Disable on initial load

    // Function to add a message to the chat display
    // Added a parameter 'isMarkdown' to indicate if content should be rendered as Markdown
    function addMessage(sender, text, isThinking = false, isMarkdown = false) {
        // Hide initial prompt if it's visible
        if (!initialPrompt.classList.contains('hidden')) {
            initialPrompt.classList.add('hidden');
        }

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        if (isThinking) {
            messageDiv.classList.add('thinking');
        }

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.textContent = sender === 'user' ? 'U' : 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        // KEY CHANGE: Use innerHTML if it's markdown, otherwise use textContent
        if (isMarkdown) {
            // Check if markdown-it library is available
            if (typeof window.markdownit !== 'undefined') {
                contentDiv.innerHTML = window.markdownit().render(text);
            } else {
                console.warn('MarkdownIt library not loaded. Displaying raw Markdown text.');
                contentDiv.textContent = text;
            }
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userMessage = chatTextarea.value.trim();
        if (userMessage === '') {
            return;
        }

        addMessage('user', userMessage);
        chatTextarea.value = '';
        adjustTextareaHeight();
        sendButton.disabled = true;

        let thinkingMessageDiv = addMessage('ai', 'Thinking...', true);

        try {
            // Instruct Gemini to return Markdown by prepending the user's prompt
            // Or, more robustly, you can set system instructions on the model if supported.
            // For now, prepending is a simple way for demo purposes.
            const promptWithMarkdownInstruction = `Please provide a detailed explanation formatted using Markdown. Include bolding for key terms, bullet points for lists, and headings where appropriate.\n\nHere is the user's request: "${userMessage}"`;

            const result = await model.generateContent(promptWithMarkdownInstruction);
            const response = await result.response;
            const aiResponseText = response.text();

            // Update the thinking message with the actual AI response, and tell it to render as Markdown
            const messageContentElement = thinkingMessageDiv.querySelector('.message-content');
            if (messageContentElement) {
                if (typeof window.markdownit !== 'undefined') {
                    messageContentElement.innerHTML = window.markdownit().render(aiResponseText);
                } else {
                    messageContentElement.textContent = aiResponseText;
                }
            }
            thinkingMessageDiv.classList.remove('thinking');

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            const messageContentElement = thinkingMessageDiv.querySelector('.message-content');
            if (messageContentElement) {
                messageContentElement.textContent = 'Error: Could not get a response from AI. Please try again.';
                messageContentElement.classList.remove('thinking');
                messageContentElement.classList.add('error-message');
            }
        } finally {
            chatMessages.scrollTop = chatMessages.scrollHeight;
            sendButton.disabled = false;
        }
    });

    // Handle Enter key for sending messages (Shift+Enter for new line)
    chatTextarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
});