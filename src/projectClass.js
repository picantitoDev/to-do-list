import { Task } from "./taskClass";

export class Project {

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
                priority: task.priority,
                done: task.done
            }))
        };
    }

    static fromJSON(data) {
        const project = new Project(data.name);

        // Safely handle cases where tasks might be undefined or not an array
        if (Array.isArray(data.tasks)) {
            data.tasks.forEach(taskData => {
                project.addTask(new Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.done));
            });
        } else {
            console.warn("No tasks found in the project data or invalid tasks structure.");
        }

        return project;
    }
}
