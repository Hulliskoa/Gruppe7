class Task{

    constructor(id, title, owner, category, description, repoName, status){
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.category = category;
        this.description = description;
        this.repoName = repoName;
        this.status = status
    }

    getTitle(){
        return this.title;
    }
    getOwner(){
        return this.owner
    }
    getContent(){
        return this.content;
    }
    getRepoName(){
        return this.repoName;
    }   
    getStatus(){
        return this.status;
    } 
    setTitle(title){
        this.title = title;
    }
    setStatus(title){
        this.status = status;
    }
    setOwner(owner){
        this.owner = owner;
    }
    setCategory(category){
        this.category = category;
    }
    setContent(content){
        this.content = content;
    }
    setRepoName(content){
        this.repoName = repoName;
    }
}

exports.Task = Task;