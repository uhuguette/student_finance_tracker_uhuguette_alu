import { state } from "./state.js";
import { validate } from "./validators.js";
import { save } from "./storage.js";
import { render } from "./ui.js";

const form = document.getElementById("form");
const error = document.getElementById("error");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");

form.addEventListener("submit", e => {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = amountEl.value.trim();
  const category = categoryEl.value.trim();
  const date = dateEl.value.trim();

  if (!validate("description", description) ||
      !validate("amount", amount) ||
      !validate("category", category) ||
      !validate("date", date)) {
    error.textContent = "Invalid input!";
    return;
  }

  state.records.push({
    id: "txn_" + Date.now(),
    description,
    amount: parseFloat(amount),
    category,
    date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  form.reset();
  error.textContent = "";
  save(state.records);
  render(); //  updates table
});