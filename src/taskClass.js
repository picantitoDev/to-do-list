export class Task {
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