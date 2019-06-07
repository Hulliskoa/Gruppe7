// http://expressjs.com/en/4x/api.html#app  expressjs docs
// https://www.npmjs.com/package/request
// https://developer.github.com/v3/
// https://developer.github.com/v3/repos/collaborators/#list-collaborators 
// https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8 request several urls at once
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016  ASYNC MIDDLEWARE
// https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/ OAuth tutorial til github
// https://dev.to/geoff/writing-asyncawait-middleware-in-express-6i0 async middleware
// https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript first letter to upperCase
// https://www.npmjs.com/package/request request module
// https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/ scope of oauth authorization

// basic modules for hosting server
require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router()
const bodyParser = require('body-parser');
const request = require('request'); // module for making HTTP calls to an api
const host = {name:'178.62.193.44'}; //server ip-address
const port = 3000;

// modules used for GitHub OAuth 
const session = require('express-session');
const qs = require('querystring');
const randomString = require('randomstring');
const csrfString = randomString.generate();

// local modules
const languageDocs = require('./languageDoc')//module containing links to programming language documentation
const helpers = require('./helpers/helpers')//module conatining premade functions that does no directly relate to the server
const Task = require('./classes').Task;//module containing the task class
const mWare = require('./middleware/middleware')// module containing middleware used with http requests
const api = require('./api');// module containing all functions for creating arrays of api queries
const oAuth = require('./oAuth');//module for github oAuth

// global variables github information
const repoNames = [] //used to store the repository names of repositories user can access


let apiUserInfo;//used to store all user info about user that logged in (username, profile picture, github profile url)
let apiUserRepos;//used to store users repositories
const repoOwner = [];//used to store the repository owner for rendering projects page
let repositoryName;//used to store selected repository 
const taskArray = [];//task objects ar pushed to this array when a new task is created
let commitMessage;//used to store selected repository commitmessages
let members;//used to store selected repository collaborators


//global variables
let colorblind = "disabled" // used to store colorblind state.

app.set('view engine', 'ejs')//expressJS uses ejs(Embedded javascript templaets) to render HTML documents
app.use(bodyParser.urlencoded({ extended: true })); //used to parse HTTP messages and extract information to be used on the server
app.use(express.static(__dirname + '/public')); //sends the static css, img, and script files to the client

//routers
app.use('/oAuth', oAuth)//router that handles all of oAuth authentication when user logs in - see oAuth.js

//function for sending api query to an api endpoint. - reference: https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
const requestAsync = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));//parse the callback response from API and resolve it
        });
    });
};

//function used for api post requests. This function is only used for creating a new repository on GitHub
const requestPost = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve((body));
        });
    });
};

//function for doing a sequence of api querys based on arrays passed to it - reference: https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
const getParallel = async function(urls) {
    try {
        data = await Promise.all(urls.map(requestAsync));
    }catch (err) {
        console.error(err);
    }
    return data
}

//root route for page. Renders the login-page
app.get('/',  (req, res, next) => {
    res.render('login');
});

//route used for setting colorblind style on page and remember it when user navigates site. 
app.get('/colorblind', (req, res, next) => {    
    colorblind = req.query.colorblind;//returns disabled or "". if "" colorblind mode is active
});

app.get('/dashboard', mWare.asyncMiddleware(async (req, res, next) =>{  
    //removes reponames from repoNames array so that duplicates doesnt appear when refreshing page
    while(repoNames.length > 0) {
        repoNames.pop();
    }
    //getting username based on access token that was supplied by github oAuth during authorization
    apiUserInfo = await getParallel(api.getUserInfo(oAuth.access.token));
    // getting repositories user owns and collaborates on through the github api
    apiUserRepos = await getParallel(api.getUserRepos(oAuth.access.token))
    // pushing repo name and owner username into array to be able to check if authorized user is owner of repo or not
    for(let i = 0; i < apiUserRepos[0].length; i++){
        repoNames.push({
            name: apiUserRepos[0][i].name, 
            owner: apiUserRepos[0][i].owner.login
            })
      }
    // renders dashboard page and sends api callback data to the ejs file for further processing
    res.render('dashboard', {
        // Variables to be sendt to the EJS file for processing
        repoNames: repoNames, //all repository names the user is connected to (owner or collaborator)
        userName: apiUserInfo[0].login, //users username on github
        profilePicture: apiUserInfo[0].avatar_url,//users profile picture on Github
        githubProfile: apiUserInfo[0].html_url, //users profile url to github profile
        colorblind: colorblind //colorblind state (disables or "")
    });
}));

//route to create new repo on github
app.post('/newRepo', mWare.asyncMiddleware(async (req, res, next) => {
    let repoName = req.body.repoName; // saves the reponame that the user wrote in new repo form
    let description = req.body.description;//save the description about the new repository  
    let privateBool = (req.body.privateBool == "on") ? true : false; // checks if user chose to create a private repo 
    let readme = (req.body.readme == "on") ? true : false; // checks if user wanted to create a readme on repo creation
    // creates new repo with the github API
    await requestPost(api.createNewRepo(oAuth.access.token, repoName, description, privateBool, readme)); // async function for GitHub API call.
    res.redirect('/dashboard');//redirects user back to dashboard with updated repositories
}));

//route for fetching the chosen repository's name and stores it in repositoryName for use when rendering mainpage
app.post('/inputName', (req, res, next) => {
    repositoryName = req.body.repo; //saves the repository name the user clicked on in dashboard
    res.redirect('/mainpage');
});

// route for rendering mainpage aka Task view
app.get('/mainpage', mWare.asyncMiddleware(async (req, res, next) => {
    repoOwner.pop()
    //checking the owner of selected repo and supplying it to the getMainContent function
    repoOwner.push(repoNames[(repoNames.findIndex(x => x.name === repositoryName))].owner)
    //saves callback data from getMainContent() queries to be used when rendering mainpage
    let mainPageContent = await getParallel(api.getMainContent(oAuth.access.token, repositoryName, repoOwner[0]));

    // get and saves number of commits done in repository per week
    let repositoryStats = await getParallel(api.repositoryStats(oAuth.access.token, repoOwner[0], repositoryName))
    let collaborators =[]; // array to store the collaborators in the chosen repository.
    for(let i = 0; i < mainPageContent[1].length; i++){
        collaborators.push(helpers.upperCase(mainPageContent[1][i].login));
    }
    // check if there are 5 or more commits in repo before doing for loop array.push
    let checkNumberOfCommits = (mainPageContent[2].length < 5) ? mainPageContent[2].length : 5
    //push 5 last commit messages and user who committed as an objects to latestCommiMsg array.
    const lastCommitMsg = [];
    for(let i = 0; i < checkNumberOfCommits; i++){
        lastCommitMsg.push({
            message: mainPageContent[2][i].commit.message,
            user: mainPageContent[2][i].commit.committer.name});
        }

    res.render('mainpage', {
        // Variables to be sendt to the EJS file for processing
        repo: repositoryName, //repository name that the user clicked on in dashboard
        userName: apiUserInfo[0].login,//users username on Github
        githubProfile: apiUserInfo[0].html_url,// users 
        profilePicture: apiUserInfo[0].avatar_url,//users profile url to github profile
        collaborators: collaborators,//collaborators in chosen github repository
        tasks: taskArray, //all task on the chosen repository. Empty if no tasks are created
        repoLanguage: Object.keys(mainPageContent[0]), //The programming languages used in the chose repository
        docs: languageDocs, //object containing links to programming language documentation
        commits: lastCommitMsg,//array of 5 last commits to chosen repository
        repositoryStats: repositoryStats[0].all[repositoryStats[0].all.length - 1], //number of commits to chosen repository in the last week
        colorblind: colorblind //colorblind state (disables or "")
    });
}));

//route to get the collaborators in the chosen repository to be able to show and filter them on project site
app.get('/collaborators', mWare.asyncMiddleware(async (req, res, next) => {
    let mainPageContent = await getParallel(api.getMainContent(oAuth.access.token, repositoryName, repoOwner));
    let collaborators = [];
    for(let i = 0; i < mainPageContent[1].length; i++){
        collaborators.push(helpers.upperCase(mainPageContent[1][i].login));
    }
    res.send(collaborators);
}));

//route for creating a new task when client submits new task form.
app.post('/newTask', (req, res, next) => {    
    let id = randomString.generate()
    
    //constructs new task with the task class constructor - see classes.js
    taskArray.push(new Task(id, req.body.taskName, req.body.owner, req.body.category, req.body.description, repositoryName, req.body.dueDate, "to-do"));
    console.log("Task created");
    res.redirect('/mainpage');//redirect user back to mainpage after task creation
});

//route to edit task by using the setters specified in the task class in classes.js
app.post('/editTask', (req, res, next) => {    
    let editedTask = taskArray[(taskArray.findIndex(x => x.id === req.body.taskID))]
    //set the task edited information supplied by the edit task form using setters in the task class
    editedTask.setTitle(req.body.taskName) 
    editedTask.setOwner(req.body.owner)
    editedTask.setCategory(req.body.category)
    editedTask.setTitle(req.body.taskName)
    editedTask.setDescription(req.body.description)
    editedTask.setDueDate(req.body.dueDate)    
    console.log(editedTask)
    res.redirect('/mainpage');
});

//route for deleting task when "confirm deletion" is clicked on the project site
app.post('/deleteTask', (req, res, next) => {
    //get the taskID sendt from client 
    taskID = req.query.taskID 
    //removes the object  with the specified task id from taskArray
    taskArray.splice((taskArray.findIndex(x => x.id === taskID)), 1); 
    res.redirect('/mainpage');
});

//route task status changes when dragged to a new column in the kanban board
app.post('/changeTaskStatus', (req, res, next) => { 
    //gets the taskID sendt from client   
    taskID = req.query.taskID;
    //gets the task status from client
    let status = req.query.status;
    //changes the status on the task with the specified task id
    taskArray[taskArray.findIndex(x => x.id === taskID)].setStatus(status)
    res.redirect('/mainpage');
});

app.listen(port, () => {
  console.log(`Server listening on port :${port}`);
});
