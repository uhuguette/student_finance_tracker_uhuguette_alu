import { state } from "./state.js";
import { save } from "./storage.js";
import { compileRegex, highlight } from "./search.js";

let sortField = "date";
let asc = true;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");

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
        <button class="edit" data-id="${r.id}">Edit</button>
        <button class="delete" data-id="${r.id}">X</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function setSort(field) {
  asc = sortField === field ? !asc : true;
  sortField = field;
  renderTransactions();
}

function deleteRecord(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  state.records = state.records.filter(r => r.id !== id);
  save(state.records);
  renderTransactions();
}

function editRecord(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  const newDescription = prompt("Edit description:", record.description);
  if (newDescription === null) return;

  const newAmount = prompt("Edit amount:", record.amount);
  if (newAmount === null) return;

  const newCategory = prompt("Edit category:", record.category);
  if (newCategory === null) return;

  record.description = newDescription.trim();
  record.amount = parseFloat(newAmount);
  record.category = newCategory.trim();
  record.updatedAt = new Date().toISOString();

  save(state.records);
  renderTransactions();
}

// Sorting
document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => setSort(th.dataset.sort));
});

// Search
searchInput.addEventListener("input", renderTransactions);

// Table actions
tableBody.addEventListener("click", e => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete")) {
    deleteRecord(id);
  }

  if (e.target.classList.contains("edit")) {
    editRecord(id);
  }
});

// Render on page load
renderTransactions();