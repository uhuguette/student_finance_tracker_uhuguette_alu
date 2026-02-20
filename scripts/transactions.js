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
      <td><button data-id="${r.id}">X</button></td>
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

// Event listeners
document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => setSort(th.dataset.sort));
});

searchInput.addEventListener("input", renderTransactions);

tableBody.addEventListener("click", e => {
  if (e.target.dataset.id) {
    deleteRecord(e.target.dataset.id);
  }
});

// Render on page load
renderTransactions();
