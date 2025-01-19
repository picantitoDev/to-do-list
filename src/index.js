import { indexOf } from 'lodash';
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

class Project{
    #tasks = [];

    constructor(name){
        this.name = name;
    }

    createTask(title, description, dueDate, priority) {
        this.#tasks.push(new Task(title, description, dueDate, priority));
    }
    
    readTasks(){
        for(let task of this.#tasks){
            console.log(JSON.stringify(task));
        }
    }

    // ?
    updateTask(idx, newTitle, description, dueDate, priority){
        let task = this.#tasks[idx];
        task.title = newTitle;
        task.description = description;
        task.dueDate = dueDate;
        task.priority = priority;
        console.log("Task edited sucessfully")
        return;
    }

    deleteTask(title){
        let index = null
        for(let task of this.#tasks){
            if(task.title === title){
                index = this.#tasks.indexOf(task);
            }
        }
        this.#tasks.splice(index, 1);
    }
}

class TodoController{
    #projects = [];

   createProject(){

   }
   
   readProjects(){

   }

   updateProject(name){

   }

   deleteProject(name){

   }
}

class screenController{

}

let project = new Project("Proyecto Prueba")

project.createTask("Tarea Prueba 1", "descripcion", "date", "high")
project.createTask("Tarea Prueba 2", "descripcion", "date", "high")
project.createTask("Tarea Prueba 3", "descripcion", "date", "high")
project.createTask("Tarea Prueba 4", "descripcion", "date", "high")

project.readTasks();
console.log("Borrando prueba 3")
project.deleteTask("Tarea Prueba 3")
project.readTasks()