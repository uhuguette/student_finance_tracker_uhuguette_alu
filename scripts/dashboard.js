import { state } from "./state.js";
import { save } from "./storage.js";

const stats = document.getElementById("stats");
const capMessage = document.getElementById("capMessage");

function renderDashboard() {
  const total = state.records.length;
  const sum = state.records.reduce((a, b) => a + b.amount, 0);

  stats.innerHTML = `
    <p>Total Transactions: ${total}</p>
    <p>Total Spent: $${sum.toFixed(2)}</p>
  `;

  if (state.cap) {
    if (sum > state.cap) {
      capMessage.setAttribute("aria-live", "assertive");
      capMessage.textContent = "⚠ Cap exceeded!";
    } else {
      capMessage.setAttribute("aria-live", "polite");
      capMessage.textContent = "Remaining: $" + (state.cap - sum).toFixed(2);
    }
  }

  save(state.records);
}

// Render on page load
renderDashboard();
