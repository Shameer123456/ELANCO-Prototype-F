export function initChatbot({ onAction }) {
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatText");
  const toggle = document.getElementById("chatToggle");
  let collapsed = false;

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  toggle.addEventListener("click", () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? "none" : "block";
    form.style.display = collapsed ? "none" : "flex";
    toggle.textContent = collapsed ? "+" : "–";
  });

  addMsg("Hi! Type 'help' for commands.", "bot");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";

    addMsg(message, "user");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    addMsg(data.reply || "Sorry, I couldn't respond.", "bot");
    if (data.action && data.action.type !== "none") onAction(data.action);
  });
}
