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
require('dotenv').config(); //Github Oauth APP client id and client secret is stored in the .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const request = require('request'); // module for making HTTP calls to an api

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

// global variables
const redirect_uri = process.env.HOST + '/redirect';
const repoNames = []
const access = {token: ""};
const repoOwner = [];
const taskArray = [];
let apiUserRepos;
let repositoryName;
let commitMessage;
let members;
let assignemnts;
let apiUserInfo;

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use(
    session({
        secret: randomString.generate(),
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

//function for sending api query to an api endpoint - reference: https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
const requestAsync = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
        });
    });
};

const requestPost = async function(url) {
       return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(body);
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

app.get('/',  (req, res, next) => {
    res.render('login');
});

app.get('/logout', mWare.asyncMiddleware(async  (req, res, next) => {
    //const checkAuth = await api.getParallel(api.getAuthorization(access.token));
    res.redirect('/');
}));


app.get('/dashboard', mWare.asyncMiddleware(async (req, res, next) =>{  
    //removes reponames from repoNames array so that duplicates doesnt appear when refreshing page
    while(repoNames.length > 0) {
        repoNames.pop();
    }
    //getting username based on access token that was supplied by github oAuth during authorization
    apiUserInfo = await getParallel(api.getUserInfo(access.token));
    // getting repositories user owns and collaborates on through the github api
    apiUserRepos = await getParallel(api.getUserRepos(access.token))
    // pushing repo name and owner username into array to be able to check if authorized user is owner of repo or not
    for(let i = 0; i < apiUserRepos[0].length; i++){
        repoNames.push({
            name: apiUserRepos[0][i].name, 
            owner: apiUserRepos[0][i].owner.login
            })
      }
    // renders dashboard page and sends repoNameOwnerArray and username to the ejs file for further processing
    res.render('dashboard', {
        repoNames: repoNames, 
        userName: apiUserInfo[0].login,
        profilePicture: apiUserInfo[0].avatar_url,
        githubProfile: apiUserInfo[0].html_url
    });
}));

app.post('/inputName', (req, res, next) => {
    repositoryName = req.body.repo;
    res.redirect('/mainpage');
});

//Create new repo on github
app.post( '/newRepo', mWare.asyncMiddleware(async (req, res, next) => {
    let repoName = req.body.repoName;
    let description = req.body.description;

    //let colabMembers = req.body.colabMembers;
    let privateBool = (req.body.privateBool == "on") ? true : false;
    // creates new repo with the github API
    await requestPost(api.createNewRepo(access.token, repoName, description, privateBool));

    res.redirect('/dashboard');
}));



app.get('/mainpage', mWare.asyncMiddleware(async (req, res, next) => {
    repoOwner.pop()
    //checking the owner of selected repo and supplying it to the getMainContent function
    repoOwner.push(repoNames[(repoNames.findIndex(x => x.name === repositoryName))].owner)
    //saves callback data from getMainContent() queries to be used when rendering mainpage
    let mainPageContent = await getParallel(api.getMainContent(access.token, repositoryName, repoOwner[0]));

    // saves number of commits done in repository per week
    let repositoryStats = await getParallel(api.repositoryStats(access.token, repoOwner[0], repositoryName))
    let collaborators =[];
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
        repo: repositoryName, 
        userName: apiUserInfo[0].login,
        githubProfile: apiUserInfo[0].html_url,
        profilePicture: apiUserInfo[0].avatar_url,
        collaborators: collaborators,
        tasks: taskArray,
        repoLanguage: Object.keys(mainPageContent[0]), 
        docs: languageDocs, 
        commits: lastCommitMsg,
        repositoryStats: repositoryStats[0].all[repositoryStats[0].all.length - 1]
    });
}));

//gets the collaborators in the chosen repository to be able to show and filter them on project site
app.get('/collaborators', mWare.asyncMiddleware(async (req, res, next) => {
    let mainPageContent = await getParallel(api.getMainContent(access.token, repositoryName, repoOwner));
    let collaborators = [];
    for(let i = 0; i < mainPageContent[1].length; i++){
        collaborators.push(helpers.upperCase(mainPageContent[1][i].login));
    }
    res.send(collaborators);
}));

//Creates a new task when client submits new task form.
app.post('/newTask', (req, res, next) => {    
    let id = randomString.generate()
    taskArray.push(new Task(id, req.body.taskName, req.body.owner, req.body.category, req.body.description, repositoryName, "to-do"));
    res.redirect('/mainpage');
});
//edits task by using the setters specified in the task class in classes.js
app.post('/editTask', (req, res, next) => {    
    let editedTask = taskArray[(taskArray.findIndex(x => x.id === req.body.taskID))]
    editedTask.setTitle(req.body.taskName)
    editedTask.setOwner(req.body.owner)
    editedTask.setCategory(req.body.category)
    editedTask.setTitle(req.body.taskName)
    editedTask.setDescription(req.body.description)
    editedTask.setDueDate(req.body.dueDate)    
    console.log(editedTask)
    res.redirect('/mainpage');
});

//Deletes task when "confirm deletion" is clicked on the project site
app.post('/deleteTask', (req, res, next) => {
    //get the taskID sendt from client 
    taskID = req.query.taskID 
    //removes the object  with the specified task id from taskArray
    taskArray.splice((taskArray.findIndex(x => x.id === taskID)), 1); 
    res.redirect('/mainpage');
});

//handles task status changes when dragged to a new column in the kanban board
app.post('/changeTaskStatus', (req, res, next) => { 
    //gets the taskID sendt from client   
    taskID = req.query.taskID;
    //gets the task status from client
    let status = req.query.status;
    //changes the status on the task with the specified task id
    taskArray[taskArray.findIndex(x => x.id === taskID)].setStatus(status)
    res.redirect('/mainpage');
});



// GitHub Oauth authorization to be able to make authorized api request (reference: https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/)
app.get('/authorize', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
      //github api url to start authorization process
      const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: process.env.CLIENT_ID,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string,
            scope: 'public_repo, read:user'//public_repo gives the server access to query data from users public repos. read:user gives the app access to read profile info. 
        });
    //redirects the user to github oauth login
    res.redirect(githubAuthUrl);
  });
    //after user login github answers with the redirect url specified for our app
    app.all('/redirect', (req, res) => {
        const code = req.query.code;
        const returnedState = req.query.state;
        //checks if the user is in the same session, if not the user is sendt back to login screen
        if (req.session.csrf_string === returnedState) {
          //sends a post request to the github api containing client id,secret and code supplied by github earlier. Github Api answers with the user access token
          request.post(
            {
              url:
                    'https://github.com/login/oauth/access_token?' +
                    qs.stringify({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code: code,
                        redirect_uri: redirect_uri,
                        state: req.session.csrf_string 
                })
            },
            //gets the token from the api callback and saves to an object it for later use
            (error, response, body) => {
                    console.log('Your Access Token: ');
                    console.log(qs.parse(body));
                    req.session.access_token = qs.parse(body).access_token;
                    access.token = 'token ' + req.session.access_token
                    res.redirect('/dashboard');
            }
          );
        }else {
            res.redirect('/');
        }
});


app.listen(port, () => {
  console.log('Server listening at port ' + port);
});

