class Task{

    constructor(id, title, owner, category, content, repoName){
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.category = category;
        this.content = content;
        this.repoName = repoName
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
    setTitle(title){
        this.title = title;
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