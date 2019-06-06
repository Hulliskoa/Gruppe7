//handles GitHub Oauth authorization to be able to make authorized api request (reference: https://shiya.io/how-to-do-3-legged-oauth-with-github-a-general-guide-by-example-with-node-js/)

const express = require('express');
const app = express();
const router = express.Router()
const session = require('express-session');
const qs = require('querystring');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const access = {token: ""};//used to store the access token from github oAuth callback

router.get('/authorize', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
      //github api url to start authorization process
      const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: CLIENT_ID,
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
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        code: code,
                        redirect_uri: redirect_uri,
                        state: req.session.csrf_string 
                })
            },
            //gets the token from the api callback and saves to the user session and an object for later use
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

module.exports = access;
module.exports = router;

