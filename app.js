// http://expressjs.com/en/4x/api.html#app  expressjs docs
// https://www.npmjs.com/package/request

// https://developer.github.com/v3/repos/collaborators/#list-collaborators 
// https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8 request several urls at once
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016  ASYNC MIDDLEWARE
// https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/ OAuth tutorial til github


require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

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
const repoNameArray = []
const repoOwnerArray = [];
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
app.use(express.static('public'))

app.use(
    session({
      secret: randomString.generate(),
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false
    })
);

// funksjon for å vente på callback fra API før siden lastes
const asyncMiddleware = fn =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    };

const getUserInfo = function (accessToken){
 return [
    {
        url:'https://api.github.com/user',
        method: 'GET',
        headers: {'Authorization': accessToken, 'User-Agent': 'request'}
    }
];
}

const getUserRepos = function (accessToken){
    return [
    {// spørring etter alle brukers repos
        url:'https://api.github.com/user/repos?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET + '&per_page=100',
        method: 'GET',
        headers: {'Authorization': accessToken, 'User-Agent': 'request'},
    }
  ];
}

//legger bruker og repo inn i api kallet
const getLanguageAndCollaborators = function (accessToken, repo, owner){
    return [
    {//spørring for alle programmeringsspråk brukt i repo
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/languages?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
        method: 'GET',
        headers: {'User-Agent': 'request'},
    },
    {
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/collaborators?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
        method: 'GET',
        headers: {'Authorization': accessToken, 'User-Agent': 'request'},
    }
  ];
}


const requestAsync = async function(url) {
    return new Promise((resolve, reject) => {
        let req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
        });
    });
};

const getParallel = async function(urls) {
    try {
        data = await Promise.all(urls.map(requestAsync));
    } catch (err) {
        console.error(err);
    }
    return data
}




app.get('/',  (req, res, next) => {
    res.render('start');
});

app.get('/dashboard', asyncMiddleware(async (req, res, next) => {
    let collaboratorsAndLanguage = await getParallel(getLanguageAndCollaborators(accessToken, repositoryName, apiUserInfo[0].login));
    console.log(collaboratorsAndLanguage);
    res.render('dashboard', {repo: repositoryName, userName: apiUserInfo[0].login});
}));

app.get('/index', asyncMiddleware(async (req, res, next) =>{  
    accessToken = 'token ' + req.session.access_token
    //henter brukernavn ved hjelp av Oauth token vi fikk fra github API
    apiUserInfo = await getParallel(getUserInfo(accessToken));

    // getting languages and collaborators from specified github repo through github REST API
    apiCallbackData = await getParallel(getUserRepos(accessToken))
    console.log(apiCallbackData[0])
    console.log(repoOwnerArray)
    for(let i = 0; i < apiCallbackData[0].length; i++){
      repoNameArray.push({name: apiCallbackData[0][i].name, owner: apiCallbackData[0][i].owner.login});
    }
    console.log(repoNameArray);
    res.render('index', {repoNames: repoNameArray, userName: apiUserInfo[0].login});
}));


app.post('/inputName', (req, res, next) => {
    repositoryName = req.body.repo;
    res.redirect('/dashboard');
});

// GitHub Oauth autentisering for å få tilgang til mer data gjennom GitHub API
app.get('/authorize', (req, res, next) => {
  req.session.csrf_string = randomString.generate();
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: 'read:user'
    });
  res.redirect(githubAuthUrl);
});

app.all('/redirect', (req, res) => {
  console.log('Request sent by GitHub: ');
  console.log(req.query);
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
        res.redirect('/index');
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
