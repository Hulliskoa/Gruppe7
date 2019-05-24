// http://expressjs.com/en/4x/api.html#app

require('dotenv').config();
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const team = require('./users');

const port = process.env.PORT || 3000;
const redirect_uri = process.env.HOST + '/redirect';

//heisann

let repositoryName;
let userName;
let commitMessage;
let assignemnts;

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


// setup for autentisering via github hvis vi tenker å implementere det
/*

//const session = require('express-session');
//const qs = require('querystring');
//const url = require('url');
//const randomString = require('randomstring');
//const csrfString = randomString.generate();

var config = {
   client_id: process.env.github_client_id,
   client_secret: process.env.github_client_secret,
   redirect_url: 'http://localhost:3000/redirect',
   api_url: 'https://api.github.com', 
   authorize_url:'https://github.com/login/oauth/authorize?',
   token_url: 'https://github.com/login/oauth/access_token',
   user_url: 'https://api.github.com/user',
   scope: 'user:email'
 };
*/


// renders the index html/ejs file
app.get('/', (req, res, next) => {
        res.render('index', {data: commitMessage});
});


app.post('/inputName', (req, res) => {
  userName = req.body.user;
  repositoryName = req.body.repo;
  let options = {
  url: 'https://api.github.com/repos/' + userName + '/' + repositoryName + '/commits',
  method: 'GET',
  headers: {'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'request'}

  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);
      commitMessage = info[0].commit.message;
      console.log(info[0]);
      res.redirect('/');
    }else{
      let info = JSON.parse(body);
      commitMessage = "Could not find repo. Please try again"
      res.redirect('/');
      console.log("error");
    }
  });
});


app.listen(port, () => {
  console.log('Server listening at port ' + port);
});

