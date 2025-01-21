import './styles.css';

class Task {
    constructor(title, description, dueDate, priority) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
    }

    // Getter for title
    get title() {
        return this._title;
    }

    // Setter for title
    set title(newTitle) {
        if (typeof newTitle === 'string' && newTitle.trim().length > 0) {
            this._title = newTitle;
        } else {
            throw new Error("Invalid title");
        }
    }

    // Getter for description
    get description() {
        return this._description;
    }

    // Setter for description
    set description(newDescription) {
        if (typeof newDescription === 'string') {
            this._description = newDescription;
        } else {
            throw new Error("Invalid description");
        }
    }

    // Getter for dueDate
    get dueDate() {
        return this._dueDate;
    }

    // Setter for dueDate
    set dueDate(newDueDate) {

        this._dueDate = newDueDate;

    }

    // Getter for priority
    get priority() {
        return this._priority;
    }

    // Setter for priority
    set priority(newPriority) {
        if (['low', 'medium', 'high'].includes(newPriority.toLowerCase())) {
            this._priority = newPriority;
        } else {
            throw new Error("Priority must be 'low', 'medium', or 'high'");
        }
    }

}

class Project {

    #tasks = [];

    constructor(name) {
        this.name = name;
    }

    createTask(title, description, dueDate, priority) {
        this.#tasks.push(new Task(title, description, dueDate, priority));
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    readTasks() {
        for (let task of this.#tasks) {
            console.log(JSON.stringify(task));
        }
    }

    getTasks() {
        return [...this.#tasks];
    }

    set tasks(tasks) {
        if (Array.isArray(tasks) && tasks.every(task => task instanceof Task)) {
            this.#tasks = tasks;
        } else {
            console.error("Invalid tasks array");
        }
    }

    getName() {
        return this.name;
    }

    // ?
    updateTask(newTitle, description, dueDate, priority) {
        for (let task of this.#tasks) {
            if (task.title === newTitle) {
                task.description = description;
                task.dueDate = dueDate;
                task.priority = priority;
                console.log("Task edited sucessfully")
                return;
            }
        }
    }

    findTask(title) {
        for (let task of this.#tasks) {
            if (task.title === title) {
                return task;
            }
        }
    }

    deleteTask(title) {
        let index = null
        for (let task of this.#tasks) {
            if (task.title === title) {
                index = this.#tasks.indexOf(task);
            }
        }
        this.#tasks.splice(index, 1);
    }

    toJSON() {
        return {
            name: this.name,
            tasks: this.#tasks.map(task => ({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority
            }))
        };
    }

    static fromJSON(data) {
        const project = new Project(data.name);

        // Safely handle cases where tasks might be undefined or not an array
        if (Array.isArray(data.tasks)) {
            data.tasks.forEach(taskData => {
                project.addTask(new Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority));
            });
        } else {
            console.warn("No tasks found in the project data or invalid tasks structure.");
        }

        return project;
    }
}

const TodoController = function () {
    let projects = [];

    function createProject(name) {
        let project = new Project(name);
        projects.push(project);
        return project;
    }

    function printProjects() {
        for (let project of projects) {
            console.log(project);
        }
    }

    function addProject(project) {
        projects.push(project);
    }

    function clearProjects(){
        projects = [];
    }

    function getProjects() {
        return projects;
    }

    function findProject(name) {
        for (let project of projects) {
            if (project.getName() === name) {
                return project;
            }
        }
    }

    function deleteProject(name) {
        let index = null;
        for (let project of projects) {
            if (project.name === name) {
                index = projects.indexOf(project);
                break; // Stop loop once the project is found
            }
        }
        if (index !== null) {
            projects.splice(index, 1);
        }
    }

    return {
        clearProjects,
        findProject,
        addProject,
        createProject,
        printProjects,
        getProjects,
        deleteProject,
    };
}();

const ScreenController = function () {

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


    let displayProjects = function () {
        clearSidebar();
        let projectCount = parseInt(localStorage.getItem('projectCount')) || 1;

        for (let i = 1; i < projectCount; i++) {
            let savedProjectData = localStorage.getItem(`project_${i}`);

            if (savedProjectData) {
                let savedProject = Project.fromJSON(JSON.parse(savedProjectData));

                let div = document.createElement('div');
                div.innerHTML = savedProject.getName();
                div.classList.add(...("project flex items-center p-4 text-xl h-[40px] cursor-pointer text-purple-950 font-semibold border-b-4 border-b-purple-300".split(' ')));
                
                if (div.innerHTML === currentProject.getName()) {
                    div.classList.add("bg-purple-500");
                } else {
                    clearBackgroundProjects();
                }
                sidebar.appendChild(div);
            }
        }
    };



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


    let saveToLocalStorage = function (project) {
        // Retrieve the current counter or initialize it to 1
        let c = parseInt(localStorage.getItem('projectCount')) || 1;

        // Save the project with a unique key
        localStorage.setItem(`project_${c}`, JSON.stringify(project.toJSON()));

        // Increment the counter and save it back to Local Storage
        localStorage.setItem('projectCount', c + 1);
    }

    let updateProjectInLocalStorage = function (project) {
        let projectCount = parseInt(localStorage.getItem('projectCount')) || 1;

        for (let i = 1; i < projectCount; i++) {
            let savedProjectData = localStorage.getItem(`project_${i}`);

            if (savedProjectData) {
                // Rebuild the Project object using `fromJSON`
                let savedProject = Project.fromJSON(JSON.parse(savedProjectData));

                // Check if the project matches by name
                if (savedProject.getName() === project.getName()) {
                    // Update the tasks and save back
                    savedProject.tasks = project.getTasks(); // Update tasks
                    localStorage.setItem(`project_${i}`, JSON.stringify(savedProject.toJSON()));
                    break;
                }
            }
        }
    };


    return {
        init() {
            document.addEventListener("DOMContentLoaded", () => { // Trigger when the page loads
                todoList.clearProjects();

                // Retrieve all projects from localStorage
                let projectCount = parseInt(localStorage.getItem('projectCount')) || 0;

                for (let i = 1; i <= projectCount; i++) {
                    let projectData = localStorage.getItem(`project_${i}`);
                    if (projectData) {
                        let project = Project.fromJSON(JSON.parse(projectData));
                        todoList.addProject(project);
                    }
                }

                if (todoList.getProjects().length > 0) {
                    currentProject = todoList.getProjects()[0];
                } else {
                    currentProject = new Project("Default");
                    todoList.addProject(currentProject);
                    localStorage.setItem('project_1', JSON.stringify(currentProject.toJSON()));
                    localStorage.setItem('projectCount', 1);
                }

                // Display projects and tasks
                
                displayProjects();
                displayTasks();
            });
        },
        selectProject() {
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
        },

        editClicked() {
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
        },

        detailsClicked() {
            document.body.addEventListener('click', (event) => {
                if (event.target.classList.contains('details-button')) {
                    console.log('Clicked on Details Button');
                    let currentTask = currentProject.findTask(getDOMTask(event));
                    openDescriptionModal(currentTask);
                    closeDescriptionModal();
                }
            });
        },

        deleteClicked() {
            document.body.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-button')) {
                    console.log('Clicked on Delete Button');
                    currentProject.deleteTask(getDOMTask(event));
                    updateProjectInLocalStorage(currentProject);
                    displayTasks();
                }
            });
        },

        createDOMProject() {
            createProjectButton.addEventListener("click", function () {
                openProjectModal();
                closeProjectModal();
                saveProjectModal();
            });
        },

        createDOMTask() {
            createTaskButton.addEventListener("click", openModal);
            closeModalBtn.addEventListener("click", closeModal);
            sumbitModal();
        }
    }

}();

let UI = ScreenController;
UI.init();
UI.createDOMProject();
UI.selectProject();
UI.createDOMTask();
UI.editClicked();
UI.detailsClicked();
UI.deleteClicked();