//handles GitHub Oauth authorization to be able to make authorized api request (reference: https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/)

const express = require('express');
const app = express();
const server = require('./app')
const router = express.Router()
const session = require('express-session');
const qs = require('querystring');
const request = require('request'); // module for making HTTP calls to an api

const randomString = require('randomstring');
const csrfString = randomString.generate();
const access = {token: ""};//used to store the access token from github oAuth callback
const hostname = '178.62.193.44' //ip-address for server
const redirect_uri = 'http://'+ hostname + ':3000' + '/oAuth/redirect'; //uri for github oauth redirect
const client = {id: "a7bd17430ccafbea1df9",secret: "85f152b50698af03f7553426df5887574bfd1b23"} //should be stored more securely but for protoype purposes this i okay.


//oAuth uses session to confirm that the session the user came from is the same as after login 
router.use(
    session({
        secret: randomString.generate(),//random string to have a unique id for the user session
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

router.get('/authorize', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
      //github api url to start authorization process
      const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: client.id,//client id supplied by github 
            redirect_uri: redirect_uri,
            //State is an unguessable random string. It is used to protect against cross-site request forgery attacks.
            state: req.session.csrf_string,
             /*scope defines what kind of access the app will get to the users information.
            public_repo gives the server access to query data from users public repos and access for creating new repo. 
            read:user gives the app access to read profile info. */
            scope: 'public_repo, read:user'
        });
    //redirects the user to github oauth login
    res.redirect(githubAuthUrl);
  });
    //after user login github sends the user to the redirect uri specified on github.com for our app 
    router.all('/redirect', (req, res) => {
        const code = req.query.code;
        const returnedState = req.query.state;
        //checks if the user is in the same session, if not the user is sendt back to login screen
        if (req.session.csrf_string === returnedState) {
          /*sends a post request to the github api containing client id,secret and code supplied by github API earlier. 
          Github Api answers with the user access token*/
          request.post(
            {
              url:
                    'https://github.com/login/oauth/access_token?' +
                    qs.stringify({
                        client_id: client.id,
                        client_secret: client.secret,// client secret supplied by github
                        code: code,//recived as respons to authorization from github api 
                        redirect_uri: redirect_uri,// uri for page github redirects to after login
                        state: req.session.csrf_string //state from session used for 
                })
            },
            //gets the token from the api callback and saves to the user session and an object for later use
            (error, response, body) => {
                    console.log('Your Access Token: ');
                    console.log(qs.parse(body));
                    req.session.access_token = qs.parse(body).access_token; 
                    access.token = 'token ' + req.session.access_token //saves access token for later use in api requests
                    res.redirect('/dashboard');
            }
          );
        }else {
            res.redirect('/');
        }
});

module.exports = router;//exports router to the main app file - app.js
module.exports.access = access; //exports access token to be used in api calls
module.exports.client = client; // exports client secret and client id to be used in api request - api.js