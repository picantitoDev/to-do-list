import { TodoController } from "./todoController";
import { Project } from "./projectClass";
import { format } from 'date-fns';

export const ScreenController = function () {

    //DOM Objects
    let sidebar = document.querySelector("#sidebar");
    let header = document.querySelector("#header");
    let content = document.querySelector("#content");

    let createProjectButton = document.querySelector("#create-project-btn");
    let createTaskButton = document.querySelector("#create-task-btn");

    //Create task modal
    // DOM Elements
    const modal = document.getElementById('modal');
    const editModal = document.getElementById('edit-modal');
    const editCloseModal = document.getElementById('close-edit-modal')
    const closeModalBtn = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');

    //Edit task modal


    //Projects
    let todoList = TodoController;
    let currentProject = null;


    // Function to open the modal
    const openModal = function () {
        modal.classList.remove("hidden");
    };

    // Function to close the modal
    const closeModal = function () {
        modal.classList.add("hidden");
    };

    const sumbitModal = function () {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values from the form
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const dueDate = document.getElementById('dueDate').value;
            const priority = document.getElementById('priority').value;

            // Create a new Task object
            // Add task to the list
            currentProject.createTask(title, description, dueDate, priority)
            updateProjectInLocalStorage(currentProject);
            // Clear the form and close the modal
            taskForm.reset();
            modal.classList.add('hidden');
            displayTasks();
        });
    }

    const openEditModal = function (task) {
        const editModal = document.getElementById('edit-modal');
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description;
        document.getElementById('edit-dueDate').value = task.dueDate;
        document.getElementById('edit-priority').value = task.priority;
        editModal.classList.remove('hidden');
    };

    const closeEditModal = function () {
        const editModal = document.getElementById('edit-modal');
        editModal.classList.add('hidden');
    };

    const sumbitEditModal = function (currentTask) {
        // Attach the submit event handler (ensure only one listener is active)
        const editForm = document.getElementById('edit-task-form');
        editForm.onsubmit = (e) => {
            e.preventDefault();

            // Update task with new values
            currentTask.title = document.getElementById('edit-title').value;
            currentTask.description = document.getElementById('edit-description').value;
            currentTask.dueDate = document.getElementById('edit-dueDate').value;
            currentTask.priority = document.getElementById('edit-priority').value;

            // Close modal, clear form, and refresh the task list
            updateProjectInLocalStorage(currentProject);
            closeEditModal();
            editForm.reset();
            displayTasks();
        };
    }

    let clearSidebar = function () {
        Array.from(sidebar.children).forEach((child) => {
            if (!child.id || child.id !== "create-project-btn") {
                sidebar.removeChild(child);
            }
        });
    }

    let clearContent = function () {
        Array.from(content.children).forEach((child) => {
            if (!child.id || child.id !== "create-task-btn") {
                content.removeChild(child);
            }
        });
    }

    function getDaySuffix(date) {
        const day = date.getDate();
        if (day >= 11 && day <= 13) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    function formatTaskDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);

        const formattedDate = format(date, 'MMM dd');
        const daySuffix = getDaySuffix(date);
        return formattedDate.replace(/\d+/, match => `${match}${daySuffix}, ${year}`);
    }

    let displayTasks = function () {
        clearContent();

        for (let task of currentProject.getTasks()) {
            const formattedTaskDate = formatTaskDate(task.dueDate);

            let div = document.createElement('div');
            div.innerHTML = `<div class="bg-[#F8FAFC] flex items-center h-[70px] justify-between px-6 border-l-8 rounded-lg shadow-sm ${chooseRightColor(task.priority)} task-container transition duration-200 hover:shadow-lg">
                        <!-- Tarea y Checkbox -->
                        <div class="flex items-center gap-4">
                            <input type="checkbox" class="task-checkbox w-5 h-5 accent-indigo-600 hover:accent-indigo-700">
                            <p class="task-title font-medium text-gray-800">${task.title}</p>
                        </div>
                        
                        <!-- Fecha y Botones -->
                        <div class="flex items-center gap-6">
                            <p class="text-sm text-gray-500 font-medium taskDate">${formattedTaskDate}</p>
                            <div class="task-button-container flex gap-2">
                                <button class="details-button bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                                    DETAILS
                                </button>
                                <button class="edit-button bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-200">
                                    EDIT
                                </button>
                                <button class="delete-button bg-red-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-200">
                                    DELETE
                                </button>
                            </div>
                        </div>
                    </div>`;
            content.appendChild(div);

            const editButton = div.querySelector('.edit-button');
            const detailsButton = div.querySelector('.details-button');
            const checkbox = div.querySelector('.task-checkbox');
            const taskTitle = div.querySelector('.task-title');
            const taskDate = div.querySelector('.taskDate')

            // Edit Button Listener
            editButton.addEventListener('click', () => {
                console.log('Clicked on Edit Button');
                const currentTask = currentProject.findTask(task.title);
                openEditModal(currentTask);
                sumbitEditModal(currentTask);
                editCloseModal.addEventListener('click', closeEditModal);
            });

            checkbox.checked = task.done;
            updateTaskVisualState(task, taskTitle, taskDate, editButton, detailsButton);
            checkbox.addEventListener('change', () => {
                handleCheckboxChange(task, checkbox, taskTitle, taskDate, editButton, detailsButton);
            });
        }
    }

    let updateTaskVisualState = function (task, taskTitle, taskDate, editButton, detailsButton) {
        if (task.done) {
            taskTitle.style.textDecoration = 'line-through';
            editButton.disabled = true;
            detailsButton.disabled = true;
            taskTitle.classList.add('opacity-50');
            taskDate.classList.add('opacity-50');
            editButton.classList.add('disabled', 'opacity-50');
            detailsButton.classList.add('disabled', 'opacity-50');
        } else {
            taskTitle.style.textDecoration = 'none';
            editButton.disabled = false;
            detailsButton.disabled = false;
            taskTitle.classList.remove('opacity-50');
            taskDate.classList.remove('opacity-50');
            editButton.classList.remove('disabled', 'opacity-50');
            detailsButton.classList.remove('disabled', 'opacity-50');
        }
    }

    let handleCheckboxChange = function (task, checkbox, taskTitle, taskDate, editButton, detailsButton) {
        task.done = checkbox.checked;
        updateTaskVisualState(task, taskTitle, taskDate, editButton, detailsButton);
        updateProjectInLocalStorage(currentProject);
    }


    let selectProject = function () {
        // Make sure the projects are rendered before attaching event listeners
        const projectElements = document.querySelectorAll('.project');

        projectElements.forEach(projectElement => {
            projectElement.addEventListener('click', (event) => {
                // Avoid the checkbox elements
                if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
                    return;
                }

                console.log(event.target);
                event.target.classList.add("bg-blue-100");
                event.target.classList.add("text-blue-600")

                currentProject = todoList.findProject(event.target.innerHTML);
                console.log(`Current Project Name: ${currentProject.getName()}`);
                clearBackgroundProjects();
                displayTasks();
            });
        });
    }

    let editClicked = function () {
        const editButtons = document.querySelectorAll('.edit-button');

        editButtons.forEach(editButton => {
            editButton.addEventListener('click', (event) => {
                console.log('Clicked on Edit Button');
                const taskElement = getDOMTask(event);
                const currentTask = currentProject.findTask(taskElement);

                openEditModal(currentTask);
                sumbitEditModal(currentTask);
                editCloseModal.addEventListener('click', closeEditModal);
            });
        });
    }

    let detailsClicked = function () {
        document.body.addEventListener('click', (event) => {
            if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
                return;
            }

            if (event.target.classList.contains('details-button')) {
                console.log('Clicked on Details Button');
                let currentTask = currentProject.findTask(getDOMTask(event));
                openDescriptionModal(currentTask);
                closeDescriptionModal();
            }
        });
    }

    let deleteClicked = function () {
        document.body.addEventListener('click', (event) => {
            if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
                return;
            }

            if (event.target.classList.contains('delete-button')) {
                console.log('Clicked on Delete Button');
                currentProject.deleteTask(getDOMTask(event));
                updateProjectInLocalStorage(currentProject);
                displayTasks();
            }
        });
    }

    let chooseRightColor = function (taskPriority) {
        switch (taskPriority) {
            case "High":
                return "border-l-red-500";
            case "Medium":
                return "border-l-yellow-500";
            case "Low":
                return "border-l-green-500";
            default:
                return "border-l-gray-300";
        }
    };

    let getDOMTask = function (event) {
        const taskElement = event.target.closest(".task-container");
        let value = taskElement.querySelector('.task-title');
        return value.textContent.trim();
    }

    let clearBackgroundProjects = function () {
        Array.from(sidebar.children).forEach((child) => {
            if ((!child.id || child.id !== "create-project-btn") && child.innerHTML !== currentProject.getName()) {
                child.classList.remove("bg-blue-100");
                child.classList.remove("text-blue-600")
            }
        });
    }

    let openDescriptionModal = function (currentTask) {
        const descriptionModal = document.querySelector("#description-modal")
        const param = document.querySelector("#set-description")
        descriptionModal.classList.remove("hidden");
        param.innerHTML = currentTask.description;
    }

    let closeDescriptionModal = function () {
        const closeViewModal = document.querySelector("#close-view-modal");
        closeViewModal.addEventListener("click", function () {
            const descriptionModal = document.querySelector("#description-modal")
            descriptionModal.classList.add("hidden");
        })
    }

    let openProjectModal = function () {
        const projectModal = document.querySelector("#create-project-modal")
        projectModal.classList.remove("hidden");
    }

    let closeProjectModal = function () {
        const closeProjectModal = document.querySelector("#close-create-project-modal");
        closeProjectModal.addEventListener("click", function () {
            const projectModal = document.querySelector("#create-project-modal")
            projectModal.classList.add("hidden");
        })
    }

    const saveProjectModal = function () {
        const projectForm = document.getElementById('create-project-form');
        const projectModal = document.querySelector("#create-project-modal")

        projectForm.onsubmit = (e) => {
            e.preventDefault();

            const projectName = document.querySelector("#project-name").value;
            const existingProject = todoList.getProjects().find(project => project.getName() === projectName);

            if (existingProject) {
                alert('¡This project already exists!');
                return;
            }

            // Update task with new values
            let newProject = new Project(document.querySelector("#project-name").value);
            todoList.addProject(newProject);
            saveToLocalStorage(newProject);

            // Close modal, clear form, and refresh the task list
            projectModal.classList.add("hidden");
            projectForm.reset();
            displayTasks();
            displayProjects();
        };
    }


    let displayProjects = function () {
        clearSidebar(); // Clear existing sidebar items

        // Retrieve the number of projects from localStorage
        let projectCount = parseInt(localStorage.getItem('projectCount')) || 0;

        for (let i = 0; i < projectCount; i++) {
            let savedProjectData = localStorage.getItem(`project_${i}`);

            if (savedProjectData) {
                // Rebuild the Project object
                let savedProject = Project.fromJSON(JSON.parse(savedProjectData));

                // Create a new div for the project
                let div = document.createElement('div');
                div.innerHTML = savedProject.getName();
                div.classList.add(
                    "project",
                    "flex",
                    "items-center",
                    "p-4",
                    "text-lg",
                    "h-[50px]",
                    "cursor-pointer",
                    "text-gray-700",
                    "font-medium",
                    "rounded-md",
                    "hover:bg-blue-100",
                    "hover:text-blue-600",
                    "transition",
                    "duration-200",
                    "border",
                    "border-blue-200",
                    "shadow-sm",
                    "hover:shadow-md"
                );

                // Highlight the current project
                if (savedProject.getName() === currentProject.getName()) {
                    div.classList.add("bg-blue-100");
                    div.classList.add("text-blue-600")
                }

                // Append to sidebar
                sidebar.appendChild(div);
            }
        }

        selectProject();
    };

    let saveToLocalStorage = function (project) {
        // Retrieve the current project count
        let projectCount = parseInt(localStorage.getItem('projectCount')) || 0;

        // Save the project using the next available key
        localStorage.setItem(`project_${projectCount}`, JSON.stringify(project.toJSON()));

        // Increment and update the project count
        localStorage.setItem('projectCount', projectCount + 1);
    };

    let updateProjectInLocalStorage = function (project) {
        let projectCount = parseInt(localStorage.getItem('projectCount')) || 0;

        for (let i = 0; i < projectCount; i++) {
            let savedProjectData = localStorage.getItem(`project_${i}`);

            if (savedProjectData) {
                let savedProject = Project.fromJSON(JSON.parse(savedProjectData));

                // Match projects by name and update tasks
                if (savedProject.getName() === project.getName()) {
                    localStorage.setItem(`project_${i}`, JSON.stringify(project.toJSON()));
                    break;
                }
            }
        }
    };

    let initialLoad = function () {
        document.addEventListener("DOMContentLoaded", () => {
            todoList.clearProjects(); // Clear in-memory projects

            // Retrieve all projects from localStorage
            let projectCount = parseInt(localStorage.getItem('projectCount')) || 0;

            for (let i = 0; i < projectCount; i++) {
                let projectData = localStorage.getItem(`project_${i}`);
                if (projectData) {
                    let project = Project.fromJSON(JSON.parse(projectData));
                    todoList.addProject(project);
                }
            }

            // If no projects are found, create a default one
            if (todoList.getProjects().length === 0) {
                currentProject = new Project("To-Do");
                todoList.addProject(currentProject);

                // Add tasks to the default project
                currentProject.createTask("Morning Exercise", "Go for a 30-minute jog or do a yoga session.", "2025-01-21", "High");
                currentProject.createTask("Breakfast Preparation", "Prepare and eat a healthy breakfast.", "2025-01-21", "Medium");
                currentProject.createTask("Work Emails", "Check and respond to work-related emails.", "2025-01-21", "Medium");
                currentProject.createTask("Lunch Break", "Take a break and have lunch.", "2025-01-21", "Low");
                currentProject.createTask("Grocery Shopping", "Buy essential groceries for the week.", "2025-01-21", "High");
                currentProject.createTask("Evening Walk", "Take a relaxing walk to clear your mind.", "2025-01-21", "Low");
                // Save the default project
                localStorage.setItem('project_0', JSON.stringify(currentProject.toJSON()));
                localStorage.setItem('projectCount', 1);
            } else {
                currentProject = todoList.getProjects()[0];
            }

            // Display all projects and tasks
            displayProjects();
            displayTasks();
        });
    }

    let createDOMProject = function () {
        createProjectButton.addEventListener("click", function () {
            openProjectModal();
            closeProjectModal();
            saveProjectModal();
        });
    }

    let createDOMTask = function () {
        createTaskButton.addEventListener("click", openModal);
        closeModalBtn.addEventListener("click", closeModal);
        sumbitModal();
    }

    return {
        app() {
            initialLoad();
            createDOMProject();
            selectProject();
            createDOMTask();
            editClicked();
            detailsClicked();
            deleteClicked();
        }

    }
}();