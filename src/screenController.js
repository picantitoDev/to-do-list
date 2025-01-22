import { TodoController } from "./todoController";
import { Project } from "./projectClass";

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

    let displayTasks = function () {
        clearContent();
        for (let task of currentProject.getTasks()) {
            let div = document.createElement('div');
            div.innerHTML = `<div class="bg-gray-200 flex items-center h-[40px] justify-between px-4 border-l-8 border-l-green-500 task-container">
                <div class="flex justify-evenly gap-2">
                    <input type="checkbox">
                    <p class="task-title"> ${task.title}</p>
                </div>
                <div class="flex gap-4">
                    <p>${task.dueDate}</p>
                    <button class="bg-yellow-400 details-button">DETAILS</button>
                    <button class="bg-yellow-400 edit-button">EDIT</button>
                    <button class="bg-yellow-400 delete-button">DELETE</button>
                </div>
            </div>`;
            content.appendChild(div);
        }
    }

    let getDOMTask = function (event) {
        const taskElement = event.target.closest(".task-container");
        let value = taskElement.querySelector('.task-title');
        return value.textContent.trim();
    }

    let clearBackgroundProjects = function () {
        Array.from(sidebar.children).forEach((child) => {
            if ((!child.id || child.id !== "create-project-btn") && child.innerHTML !== currentProject.getName()) {
                child.classList.remove("bg-purple-500")
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
                    "text-xl",
                    "h-[40px]",
                    "cursor-pointer",
                    "text-purple-950",
                    "font-semibold",
                    "border-b-4",
                    "border-b-purple-300"
                );

                // Highlight the current project
                if (savedProject.getName() === currentProject.getName()) {
                    div.classList.add("bg-purple-500");
                }

                // Append to sidebar
                sidebar.appendChild(div);
            }
        }
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
                currentProject = new Project("Default");
                todoList.addProject(currentProject);

                // Add tasks to the default project
                currentProject.createTask("Morning Exercise", "Go for a 30-minute jog or do a yoga session.", "2025-01-21", "High");
                currentProject.createTask("Breakfast Preparation", "Prepare and eat a healthy breakfast.", "2025-01-21", "Medium");
                currentProject.createTask("Work Emails", "Check and respond to work-related emails.", "2025-01-21", "Medium");
                currentProject.createTask("Lunch Break", "Take a break and have lunch.", "2025-01-21", "Low");
                currentProject.createTask("Grocery Shopping", "Buy essential groceries for the week.", "2025-01-21", "High");
                currentProject.createTask("Evening Walk", "Take a relaxing walk to clear your mind.", "2025-01-21", "Low");
                currentProject.createTask("Plan for Tomorrow", "Write down tasks and goals for the next day.", "2025-01-21", "Medium");

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

    let selectProject = function () {
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('project')) {
                console.log(event.target);
                event.target.classList.add('bg-purple-500')
                currentProject = todoList.findProject(event.target.innerHTML);
                console.log(`Current Project Name: ${currentProject.getName()}`)
            }
            clearBackgroundProjects();
            displayTasks();
        });
    }

    let editClicked = function () {
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                console.log('Clicked on Edit Button');
                const taskElement = getDOMTask(event);
                const currentTask = currentProject.findTask(taskElement);

                openEditModal(currentTask);
                sumbitEditModal(currentTask);
                editCloseModal.addEventListener('click', closeEditModal);
            }
        });
    }

    let detailsClicked = function () {
        document.body.addEventListener('click', (event) => {
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
            if (event.target.classList.contains('delete-button')) {
                console.log('Clicked on Delete Button');
                currentProject.deleteTask(getDOMTask(event));
                updateProjectInLocalStorage(currentProject);
                displayTasks();
            }
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