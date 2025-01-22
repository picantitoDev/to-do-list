import { Project } from "./projectClass";

export const TodoController = function () {
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

    function clearProjects() {
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