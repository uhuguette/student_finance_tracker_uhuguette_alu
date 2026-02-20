import { state } from "./state.js";
import { save } from "./storage.js";
import { compileRegex, highlight } from "./search.js";

let sortField = "date";
let asc = true;
let editingId = null;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");

const form = document.getElementById("form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");

function renderTransactions() {
  const searchValue = searchInput.value;
  const re = compileRegex(searchValue);

  tableBody.innerHTML = "";

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
      <td>
        <button class="edit-btn" data-id="${r.id}">Edit</button>
        <button class="delete-btn" data-id="${r.id}">X</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  save(state.records);
}

function setSort(field) {
  asc = sortField === field ? !asc : true;
  sortField = field;
  renderTransactions();
}

function deleteRecord(id) {
  state.records = state.records.filter(r => r.id !== id);
  renderTransactions();
}

function editRecord(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  descriptionEl.value = record.description;
  amountEl.value = record.amount;
  categoryEl.value = record.category;
  dateEl.value = record.date;

  editingId = id;
}

form.addEventListener("submit", e => {
  if (!editingId) return;

  e.preventDefault();

  const record = state.records.find(r => r.id === editingId);
  if (!record) return;

  record.description = descriptionEl.value.trim();
  record.amount = parseFloat(amountEl.value.trim());
  record.category = categoryEl.value.trim();
  record.date = dateEl.value.trim();
  record.updatedAt = new Date().toISOString();

  editingId = null;
  form.reset();
  renderTransactions();
});

// Sort
document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => setSort(th.dataset.sort));
});

// Search
searchInput.addEventListener("input", renderTransactions);

// Edit & Delete
tableBody.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("delete-btn")) {
    deleteRecord(id);
  }

  if (e.target.classList.contains("edit-btn")) {
    editRecord(id);
  }
});

// Render on page load
renderTransactions();