class Task{

    constructor(id, title, owner, category, description, repoName, dueDate, status){
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.category = category;
        this.description = description;
        this.repoName = repoName;
        this.status = status
        this.dueDate = dueDate;
    }

    getTitle(){
        return this.title;
    }
    getOwner(){
        return this.owner
    }
    getCategory(){
        return this.category;
    } 
    getDescription(){
        return this.description;
    }
    getRepoName(){
        return this.repoName;
    }   
    getStatus(){
        return this.status;
    } 
    getDueDate(){
        return this.dueDate;
    } 
    setTitle(title){
        this.title = title;
    }
    setOwner(owner){
        this.owner = owner;
    }
    setCategory(category){
        this.category = category;
    }
    setDescription(description){
        this.description = description;
    }
    setRepoName(content){
        this.repoName = repoName;
    }
    setStatus(title){
        this.status = status;
    }
    setDueDate(title){
        this.dueDate = dueDate;
    }
}

exports.Task = Task;