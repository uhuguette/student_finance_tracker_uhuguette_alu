import { state } from "./state.js";
import { save } from "./storage.js";
import { compileRegex, highlight } from "./search.js";

let sortField = "date";
let asc = true;

export function render() {
  const body = document.getElementById("tableBody");
  const stats = document.getElementById("stats");
  const capMessage = document.getElementById("capMessage");
  const searchInput = document.getElementById("search").value;

  const re = compileRegex(searchInput);

  body.innerHTML = "";

  let records = [...state.records];

  records.sort((a, b) => {
    if (sortField === "amount") {
      return asc ? a.amount - b.amount : b.amount - a.amount;
    }
    return asc
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });

  records.forEach(r => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${r.date}</td>
      <td>${highlight(r.description, re)}</td>
      <td>$${r.amount.toFixed(2)}</td>
      <td>${r.category}</td>
      <td><button data-id="${r.id}">X</button></td>
    `;

    body.appendChild(row);
  });

  // Stats
  const total = state.records.length;
  const sum = state.records.reduce((a,b)=>a+b.amount,0);

  stats.innerHTML = `
    <p>Total Transactions: ${total}</p>
    <p>Total Spent: $${sum.toFixed(2)}</p>
  `;

  if (state.cap) {
    if (sum > state.cap) {
      capMessage.setAttribute("aria-live","assertive");
      capMessage.textContent = "⚠ Cap exceeded!";
    } else {
      capMessage.setAttribute("aria-live","polite");
      capMessage.textContent = "Remaining: $" + (state.cap - sum).toFixed(2);
    }
  }

  save(state.records);
}

export function setSort(field) {
  asc = sortField === field ? !asc : true;
  sortField = field;
  render();
}

export function deleteRecord(id) {
  state.records = state.records.filter(r => r.id !== id);
  render();
}
