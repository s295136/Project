import { setBaseDate, toggleAuth, updateAuthUI } from "./state.js";
import { parseDateString } from "./utils.js";
import { loadDataFromSheets, syncDateToGoogleSheets } from "./api.js";
import { updateStats, buildDynamicFilters, initRuler, renderGantt } from "./gantt-render.js";

function renderAll() {
  updateStats();
  initRuler();
  renderGantt();
}

function initEventHandlers() {
  const dateInput = document.getElementById("base-date-input");
  const clearBtn = document.getElementById("btn-clear-date");
  const authBtn = document.getElementById("btn-auth-toggle");
  const reloadBtn = document.getElementById("btn-reload");

  dateInput.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val) {
      const parsed = parseDateString(val);
      if (parsed) {
        setBaseDate(parsed);
        syncDateToGoogleSheets(val, renderAll);
      }
    } else {
      setBaseDate(null);
      syncDateToGoogleSheets("", renderAll);
    }
    renderAll();
  });

  clearBtn.addEventListener("click", () => {
    dateInput.value = "";
    setBaseDate(null);
    syncDateToGoogleSheets("", renderAll);
    renderAll();
  });

  authBtn.addEventListener("click", () => {
    toggleAuth(renderAll);
  });

  reloadBtn.addEventListener("click", () => {
    loadDataFromSheets(true, () => {
      buildDynamicFilters(renderAll);
      renderAll();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  initEventHandlers();
  renderAll();
  
  loadDataFromSheets(false, () => {
    buildDynamicFilters(renderAll);
    renderAll();
  });
});