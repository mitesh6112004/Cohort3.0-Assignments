
const searchInput = document.querySelector("#searchInput");
const filterCategory = document.querySelector("#filterCategory");
const clearAllBtn = document.querySelector("#clearAll");

const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const pendingTasks = document.querySelector("#pendingTasks");
const categoryCount = document.querySelector("#categoryCount");

const toggleBtn = document.querySelector("#themeToggle");
const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const category = document.querySelector("#category");
const taskContainer = document.querySelector("#taskContainer");
const submitBtn = document.querySelector(".add-task-btn");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editingTaskId = null;


toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}



function renderTasks() {
  taskContainer.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = filterCategory.value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      task.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredTasks.length === 0) {
    taskContainer.innerHTML = `
            <h2 style="text-align:center;padding:40px;color:gray;">
                No Tasks Found
            </h2>
        `;

    updateStats();
    return;
  }

  filteredTasks.forEach((task) => {
    const card = document.createElement("div");

    card.className =
      task.status === "Completed" ? "task-card completed-card" : "task-card";

    card.innerHTML = `
            <div class="task-info">

                <h3>${task.title}</h3>

                <div class="task-meta">

                    <span class="category">
                        ${task.category}
                    </span>

                    <span class="status ${task.status.toLowerCase()}">
                        ${task.status}
                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button class="edit">
                    <i class="ri-edit-line"></i>
                    Edit
                </button>

                <button class="complete">

                    ${
                      task.status === "Completed"
                        ? `<i class="ri-check-double-line"></i> Completed`
                        : `<i class="ri-check-line"></i> Complete`
                    }

                </button>

                <button class="delete">
                    <i class="ri-delete-bin-line"></i>
                    Delete
                </button>

            </div>
        `;

    // Delete

    card.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);

      saveTasks();

      renderTasks();
    });

    // Complete

    card.querySelector(".complete").addEventListener("click", () => {
      task.status = task.status === "Pending" ? "Completed" : "Pending";

      saveTasks();

      renderTasks();
    });

    // Edit

    card.querySelector(".edit").addEventListener("click", () => {
      editingTaskId = task.id;

      taskTitle.value = task.title;

      category.value = task.category;

      submitBtn.innerHTML = `
                <i class="ri-save-line"></i>
                Update Task
            `;
    });

    taskContainer.appendChild(card);
  });

  updateStats();
}



taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();

  const taskCategory = category.value;

  if (title === "") {
    alert("Please enter task title");

    return;
  }


  if (editingTaskId) {
    const task = tasks.find((t) => t.id === editingTaskId);

    if (task) {
      task.title = title;
      task.category = taskCategory;
    }

    editingTaskId = null;

    submitBtn.innerHTML = `
    
    <i class="ri-add-line"></i>

    Add Task
    
    `;
  }

 
  else {
    tasks.push({
      id: Date.now(),

      title,

      category: taskCategory,

      status: "Pending",
    });
  }

  saveTasks();

  renderTasks();

  taskForm.reset();
});


renderTasks();

function updateStats() {
  totalTasks.textContent = tasks.length;

  completedTasks.textContent = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  pendingTasks.textContent = tasks.filter(
    (task) => task.status === "Pending",
  ).length;

  categoryCount.textContent = new Set(tasks.map((task) => task.category)).size;
}

searchInput.addEventListener("input", () => {
  renderTasks();
});

filterCategory.addEventListener("change", () => {
  renderTasks();
});

clearAllBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Delete all tasks?");

  if (!confirmDelete) return;

  tasks = [];

  saveTasks();

  renderTasks();
});
