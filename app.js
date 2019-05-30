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

require('dotenv').config(); //Github Oauth APP client id and client secret is stored in the .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// local modules
const team = require('./users');// module containing static user object
const languageDocs = require('./languageDoc')//module containing links to programming language documentation
const helpers = require('./helpers/helpers')//module conatining premade functions that does no directly relate to the server
const classes = require('./classes');//module containing all classes used in application
const tasks = require('./tasks')// module containing an array of all tasks created
const mWare = require('./middleware/middleware')// module containing middleware used with http requests
const api = require('./api');// module containing all functions for creating arrays of api queries

// module for making HTTP calls to an api
const request = require('request');

// OAuth mot GitHub
const session = require('express-session');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const redirect_uri = process.env.HOST + '/redirect';
//---------------------------

// globale variabler
const repoNameOwner = []
let accessToken;
let apiUserRepos;
let repositoryName;
let commitMessage;
let members;
let assignemnts;

let apiUserInfo;
//----------------


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

//functions for api queries

//function for sending api query to an api endpoint - reference: https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
const requestAsync = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
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
//----------------------------------------------------------------------


app.get('/',  (req, res, next) => {
    res.render('login');
});

app.get('/logout', mWare.asyncMiddleware(async  (req, res, next) => {
    const checkAuth = await api.getParallel(api.getAuthorization(accessToken));
    console.log(checkAuth)
    res.redirect('/');
}));


app.get('/dashboard', mWare.asyncMiddleware(async (req, res, next) =>{  
    accessToken = 'token ' + req.session.access_token
    while(repoNameOwner.length > 0) {
        repoNameOwner.pop();
    }
    //getting username based on access token that was supplied by github oAuth during authorization
    apiUserInfo = await getParallel(api.getUserInfo(accessToken));
    // getting repositories user owns and collaborates on through the github api
    apiUserRepos = await getParallel(api.getUserRepos(accessToken))
    // pushing repo name and owner username into array to be able to check if authorized user is owner of repo or not
    for(let i = 0; i < apiUserRepos[0].length; i++){
        repoNameOwner.push({
            name: apiUserRepos[0][i].name, 
            owner: apiUserRepos[0][i].owner.login});
      }
    // renders dashboard page and sends repoNameOwnerArray and username to the ejs file for further processing
    res.render('dashboard', {
        repoNames: repoNameOwner, 
        userName: apiUserInfo[0].login,
        profilePicture: apiUserInfo[0].avatar_url
    });
}));

app.post('/inputName', (req, res, next) => {
    repositoryName = req.body.repo;
    res.redirect('/mainpage');
});

app.get('/mainpage', mWare.asyncMiddleware(async (req, res, next) => {
    //checking the owner of selected repo and supplying it to the getMainContent function
    let repoOwner = repoNameOwner[(repoNameOwner.findIndex(x => x.name === repositoryName))].owner
    //saves callback data from getMainContent() queries to be used when rendering mainpage
    let mainPageContent = await getParallel(api.getMainContent(accessToken, repositoryName, repoOwner));
    let collaborators =[];
    for(let i = 0; i < mainPageContent[1].length; i++){
        collaborators.push(helpers.upperCase(mainPageContent[1][i].login));
    }

    console.log(mainPageContent[2]);
    //push 10 last commit messages and user who committed as an objects to latestCommiMsg array.
    let checkNumberOfCommits = (mainPageContent[2].length < 10) ? mainPageContent[2].length : 10
    const lastCommitMsg = [];
    for(let i = 0; i < checkNumberOfCommits; i++){
        lastCommitMsg.push({
            message: mainPageContent[2][i].commit.message,
            user: mainPageContent[2][i].commit.committer.name});//username
        }
    
    res.render('mainpage', {
        repo: repositoryName, 
        userName: apiUserInfo[0].login,
        collaborators: collaborators,
        profilePicture: apiUserInfo[0].avatar_url,
        repoLanguage:Object.keys(mainPageContent[0]), 
        docs: languageDocs, 
        commits: lastCommitMsg,
    });
}));

app.post('/newTask', (req, res, next) => {
    //let id = randomString.generate(),
    //tasks.taskArray.push(new classes.task(id, req.body.title, req.body.owner, req.body.category, req.body.content))
    res.redirect('/mainpage');
});

// GitHub Oauth authorization to be able to make authorized api request (reference: https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/)
app.get('/authorize', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
      const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: process.env.CLIENT_ID,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string,
            scope: 'public_repo, read:user'//public_repo gives the server access to query data from users public repos. read:user gives the app access to read profile info. 
        });
      res.redirect(githubAuthUrl);
  });

    app.all('/redirect', (req, res) => {
        const code = req.query.code;
        const returnedState = req.query.state;

        if (req.session.csrf_string === returnedState) {
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
            (error, response, body) => {
                    console.log('Your Access Token: ');
                    console.log(qs.parse(body));
                    req.session.access_token = qs.parse(body).access_token;
                    res.redirect('/dashboard');
            }
          );
        }else {
            res.redirect('/');
        }
});
//--------------------------------------

app.listen(port, () => {
  console.log('Server listening at port ' + port);
});

