import { forEach, indexOf } from 'lodash';
import './styles.css';
import { isTraversal } from 'css-what';

class Task {
    constructor(title, description, dueDate, priority) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
    }

    // let task = new Task("Tarea Prueba", "descripcion", "date", "high")

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

    readTasks() {
        for (let task of this.#tasks) {
            console.log(JSON.stringify(task));
        }
    }

    getTasks(){
        return this.#tasks;
    }

    getName() {
        return this.name;
    }

    // ?
    updateTask(idx, newTitle, description, dueDate, priority) {
        let task = this.#tasks[idx];
        task.title = newTitle;
        task.description = description;
        task.dueDate = dueDate;
        task.priority = priority;
        console.log("Task edited sucessfully")
        return;
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
}

const TodoController = function () {
    let projects = [];
    let currentProject;

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

    function getProjects() {
        return projects;
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

    //Projects
    let todoList = TodoController;

    let displayProjects = function () {
        clearSidebar();
        for (let project of todoList.getProjects()) {
            let div = document.createElement('div');
            div.innerHTML = `${project.getName()}`;
            div.classList.add(...("project flex items-center p-4 text-xl h-[40px] cursor-pointer text-purple-950 font-semibold border-b-4 border-b-purple-300".split(' ')));
            sidebar.appendChild(div);
        }
    };


    let clearSidebar = function () {
        Array.from(sidebar.children).forEach((child) => {
            if (!child.id || child.id !== "create-project-btn") {
                sidebar.removeChild(child);
            }
        });
    }



    return {
        displayTasks() {

        },

        selectProject() {
            document.body.addEventListener('click', (event) => {
                if (event.target.classList.contains('project')) {
                    console.log('Clicked on Project');
                }
            });
        },

        createProject() {
            createProjectButton.addEventListener("click", function () {
                todoList.createProject("Proyecto Prueba");
                displayProjects();
            });
        }
    }

}();

let UI = ScreenController;
UI.createProject();
UI.selectProject();


// let todoControl = new TodoController();
// let project1 = todoControl.createProject("Proyecto 1");
// let project2 = todoControl.createProject("Proyecto 2");
// let project3 = todoControl.createProject("Proyecto 3");
// let project4 = todoControl.createProject("Proyecto 4");
// todoControl.printProjects();
// project1.createTask("Task Prueba 1", "Description", "Date", "high")
// project2.createTask("Task Prueba 2", "Description", "Date", "high")
// project3.createTask("Task Prueba 3", "Description", "Date", "high")
// project4.createTask("Task Prueba 4", "Description", "Date", "high")
// project4.readTasks();
// todoControl.printProjects();
