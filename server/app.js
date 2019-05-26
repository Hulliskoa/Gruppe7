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
//---------------------------

// globale variabler
const redirect_uri = process.env.HOST + '/redirect';
let accessToken;
let apiCallbackData;
let repositoryName;
let userName;
let commitMessage;
let members;
let assignemnts;
let colMembers;
let APIurls = [];
let data;
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


// functions

// middleware for å vente på callback fra github API før siden lastes
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

//legger bruker og repo inn i api kallet
const defineUserAndRepo = function (user, repo){
    return [
      {
      url:'https://api.github.com/user?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
      method: 'GET',
      headers: {'User-Agent': 'Login-App'},
      Authorization:'token ' + accessToken
    },

    {
      url:'https://api.github.com/repos/' + user + '/' + repo + '/languages?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
      method: 'GET',
      headers: {'User-Agent': 'request'},
      Authorization:'token ' + accessToken
    },
    {
      url: 'https://api.github.com/repos/' + user + '/' + repo + '/commits?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
      method: 'GET',
      headers: {'User-Agent': 'request'},
      Authorization:'token ' + accessToken
    },
    {
      url: 'https://api.github.com/repos/' + user + '/' + repo + '/collaborators?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
      method: 'GET',
      headers: {'Accept': 'application/vnd.github.hellcat-preview+json', 'User-Agent': 'request'},
      Authorization:'token ' + accessToken }
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



// renders the index html/ejs file
app.get('/index', asyncMiddleware(async (req, res, next) =>{
/*
   let username1 = request.get(
    {
      url: 'https://api.github.com/user',
      headers: {
        Authorization: 'token ' + req.session.access_token,
        'User-Agent': 'Login-App'
      }
    });
   console.log(username1)
*/
// getting languages and collaborators from specified github repo through github REST API
  apiCallbackData = await getParallel(defineUserAndRepo( req, userName, repositoryName))
  console.log(apiCallbackData)
  //Object.keys gjør objekt nøklene om til en array slik at dette kan rendres på siden
  res.render('index', {languageInfo: Object.keys(apiCallbackData[0]), commitInfo: apiCallbackData[1]});
}));


app.post('/inputName', (req, res, next) => {
  userName = req.body.user;
  repositoryName = req.body.repo;
  res.redirect('/index');
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
        accessToken = qs.parse(body).access_token;

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




/* Works as of Node 7.6 */

