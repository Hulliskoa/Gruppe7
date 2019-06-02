class Task{

    constructor(id, title, owner, category, content){
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.category = category;
        this.content = content;
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
}

exports.Task = Task;