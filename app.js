// http://expressjs.com/en/4x/api.html#app  expressjs docs
// https://www.npmjs.com/package/request

// https://developer.github.com/v3/repos/collaborators/#list-collaborators 
// https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8 request several urls at once
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016  ASYNC MIDDLEWARE
// https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/ OAuth tutorial til github


require('dotenv').config(); //Github Oauth APP client id and client secret is stored in the .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// lokale moduler
const team = require('./users');

// HTTP callbacks for å gjøre API requests
const request = require('request');
//-------------

// OAuth mot GitHub
const session = require('express-session');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const redirect_uri = process.env.HOST + '/redirect';
//---------------------------

// globale variabler
const repoNameOwnerArray = []
let accessToken;
let apiCallbackData;
let repositoryName;
let commitMessage;
let members;
let assignemnts;
let data;
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

// middleware function to await api callback before continuing
const asyncMiddleware = fn =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    };

// function for creating API query to access username  
const getUserInfo = function (accessToken){
 return [
    {//api query to access username from github
        url:'https://api.github.com/user',
        method: 'GET',
        headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'}
    }
];
}

//function for creating API query for all repos using access token supplied by github
const getUserRepos = function (accessToken){
    return [
    {// API query for all repos user owns and collaborates on. 
        url:'https://api.github.com/user/repos?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET + '&per_page=100',
        method: 'GET',
        headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
    }
  ];
}

//function for creating API query. 
const getLanguageAndCollaborators = function (accessToken, repo, owner){
    return [
    {//API query to get programming languages used in repo
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/languages?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
        method: 'GET',
        headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
    },
    {// api query to list out collaborators in repo
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/collaborators/Hulliskoa/permission?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
        method: 'GET',
        headers: {'Authorization': accessToken, 'Accept':'application/vnd.github.hellcat-preview+json', 'User-Agent': 'ProjectAdmin app'},
    }
  ];
}

//function for sending api query
const requestAsync = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
        });
    });
};


//function for doing api querys based on arrays created
const getParallel = async function(urls) {
    try {
        data = await Promise.all(urls.map(requestAsync));
    } catch (err) {
        console.error(err);
    }
    return data
}

app.get('/',  (req, res, next) => {
    res.render('login');
});

app.get('/mainpage', asyncMiddleware(async (req, res, next) => {
    let repoOwner = repoNameOwnerArray[(repoNameOwnerArray.findIndex(x => x.name === repositoryName))].owner
    let collaboratorsAndLanguage = await getParallel(getLanguageAndCollaborators(accessToken, repositoryName, repoOwner));
    console.log(Object.keys(collaboratorsAndLanguage[0]));
    res.render('mainpage', {repo: repositoryName, userName: apiUserInfo[0].login, repoLanguage:Object.keys(collaboratorsAndLanguage[0])});
}));

app.get('/dashboard', asyncMiddleware(async (req, res, next) =>{  
    accessToken = 'token ' + req.session.access_token
    while(repoNameOwnerArray.length > 0) {
    repoNameOwnerArray.pop();
    }
    //henter brukernavn ved hjelp av Oauth token vi fikk fra github API
    apiUserInfo = await getParallel(getUserInfo(accessToken));
    // getting languages and collaborators from specified github repo through github REST API
    apiCallbackData = await getParallel(getUserRepos(accessToken))
    for(let i = 0; i < apiCallbackData[0].length; i++){
      repoNameOwnerArray.push({name: apiCallbackData[0][i].name, owner: apiCallbackData[0][i].owner.login});
    }
    res.render('dashboard', {repoNames: repoNameOwnerArray, userName: apiUserInfo[0].login});
}));


app.post('/inputName', (req, res, next) => {
    repositoryName = req.body.repo;
    res.redirect('/mainpage');
});

// GitHub Oauth autentisering for å få tilgang til mer data gjennom GitHub API
app.get('/authorize', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  //generer url for autentisering av bruker
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: 'user'
    });
  res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {
  const code = req.query.code;
  const returnedState = req.query.state;

  if (req.session.csrf_string === returnedState) {
    // Remember from step 5 that we initialized
    // If state matches up, send request to get access token
    // the request module is used here to send the post request
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
        // The response will contain your new access token
        // this is where you store the token somewhere safe
        // for this example we're just storing it in session
        console.log('Your Access Token: ');
        console.log(qs.parse(body));
        req.session.access_token = qs.parse(body).access_token;

        // Redirects user to /user page so we can use
        // the token to get some data.
        res.redirect('/dashboard');
      }
    );
  } else {
    // if state doesn't match up, something is wrong
    // just redirect to homepage
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log('Server listening at port ' + port);
});

