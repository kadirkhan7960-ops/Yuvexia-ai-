const form = document.getElementById("chatForm");
const input = document.getElementById("prompt");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("chatStatus");

function addBubble(text, who) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || sendBtn.disabled) return;

  addBubble(message, "user");
  input.value = "";
  sendBtn.disabled = true;
  statusEl.textContent = "AI सोच रहा है…";
  const waiting = addBubble("जवाब तैयार किया जा रहा है…", "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `सर्वर त्रुटि (${response.status})`);
    }
    if (!data.reply) throw new Error("AI से खाली जवाब मिला।");
    waiting.textContent = data.reply;
    statusEl.textContent = "ऑनलाइन";
  } catch (error) {
    waiting.textContent = `माफ़ कीजिए, जवाब नहीं मिल पाया। ${error.message} कृपया Worker/API सेटअप जाँचें।`;
    statusEl.textContent = "कनेक्शन जाँचें";
  } finally {
    sendBtn.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});
