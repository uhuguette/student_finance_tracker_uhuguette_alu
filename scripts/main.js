import { state } from "./state.js";
import { validate } from "./validators.js";
import { render, setSort, deleteRecord } from "./ui.js";

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
  render();
});

document.querySelectorAll("th[data-sort]").forEach(th=>{
  th.addEventListener("click", ()=> setSort(th.dataset.sort));
});

document.getElementById("search").addEventListener("input", render);

document.getElementById("tableBody").addEventListener("click", e=>{
  if(e.target.dataset.id){
    deleteRecord(e.target.dataset.id);
  }
});

document.getElementById("cap").addEventListener("input", e=>{
  state.cap = Number(e.target.value);
  render();
});

document.getElementById("export").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(state.records,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "finance.json";
  a.click();
});

document.getElementById("import").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(!Array.isArray(data)) throw "error";
      state.records = data;
      render();
    }catch{
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
});

render();
