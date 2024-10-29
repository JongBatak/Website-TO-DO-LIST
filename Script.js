document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = ""; // Clear input
        }
    });

    function addTask(taskText) {
        const li = document.createElement("li");
        li.textContent = taskText;

        // Buat Check Box nya
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed");
        });

        // Buat tombol delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            taskList.removeChild(li);
        });

        li.prepend(checkbox);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }
});
