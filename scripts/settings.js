import { state } from "./state.js";
import { save } from "./storage.js";

const capInput = document.getElementById("cap");
const exportBtn = document.getElementById("export");
const importInput = document.getElementById("import");

// Load cap value from state
capInput.value = state.cap || "";

capInput.addEventListener("input", e => {
  state.cap = Number(e.target.value);
  save(state.records);
});

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "finance.json";
  a.click();
});

importInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw "error";
      state.records = data;
      save(state.records);
      alert("Data imported successfully!");
    } catch {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
});
