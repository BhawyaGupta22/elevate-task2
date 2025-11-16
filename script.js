// DOM elements
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const themeToggle = document.getElementById("theme-toggle");

// state
let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("todo-tasks-bhawya") || "[]");

// THEME (light / dark)
const savedTheme = localStorage.getItem("todo-theme-bhawya");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("todo-theme-bhawya", isLight ? "light" : "dark");
});

// ADD TASK
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    category: categorySelect.value,
    done: false,
  };

  tasks.push(task);
  taskInput.value = "";
  saveAndRender();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// FILTER buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// RENDER UI
function render() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter((t) => !t.done);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter((t) => t.done);
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    li.innerHTML = `
      <div class="task-main">
        <button class="check-btn"></button>
        <span class="task-text">${task.text}</span>
      </div>
      <div class="task-meta-row">
        <span class="chip chip-${task.category}">${task.category}</span>
        <div class="actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        </div>
      </div>
    `;

    const checkBtn = li.querySelector(".check-btn");
    const textSpan = li.querySelector(".task-text");

    // COMPLETE / UNCOMPLETE: check-btn ya text pr click
    function toggleDone() {
      task.done = !task.done;
      saveAndRender();
    }
    checkBtn.addEventListener("click", toggleDone);
    textSpan.addEventListener("click", toggleDone);

    // DELETE
    li.querySelector(".btn-delete").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveAndRender();
    });

    // EDIT
    li.querySelector(".btn-edit").addEventListener("click", () => {
      const updated = prompt("Edit task:", task.text);
      if (updated && updated.trim()) {
        task.text = updated.trim();
        saveAndRender();
      }
    });

    taskList.appendChild(li);
  });

  updateProgress();
}

// PROGRESS BAR text + width
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;

  if (total === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "No tasks yet";
    return;
  }

  const percent = Math.round((done / total) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${done} of ${total} tasks done (${percent}%)`;
}

// SAVE + RENDER
function saveAndRender() {
  localStorage.setItem("todo-tasks-bhawya", JSON.stringify(tasks));
  render();
}

// first paint
render();
