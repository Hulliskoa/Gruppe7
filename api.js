const qs = require('querystring');

module.exports = { // functions for creating dynamic api querys based on authenticated user ---------------
	
getUserInfo: function (accessToken){
    return [
        {//api query to access username with accessToken supplied by github
            url:'https://api.github.com/user',
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'}
        }
    ];
},

getUserRepos: function (accessToken){
    return [
        {// api query for all repos user owns and collaborates on. 
            url:'https://api.github.com/user/repos?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET + '&per_page=100',
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
  ];
},

getMainContent: function (accessToken, repo, owner){
    return [
        {//API query to get programming languages used in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/languages?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'GET',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        },
        {// api query to list out collaborators in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/collaborators?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        },
        {// api query to list out collaborators in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/commits?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ];
},

getAuthorization: function (accessToken){
   return [
        {//remove accesToken
            url: 'https://api.github.com/applications/grants?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'GET',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
 
},
// log out by revoking the applications access to user profile data  DELETE /applications/:client_id/grants/:access_token
revokeGrant: function (accessToken){
   return [
        {//remove accesToken
            url: 'https://api.github.com/applications/' + process.env.CLIENT_ID + '/grants/' + accessToken + '?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'DELETE',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
},

profilePicture: function (accessToken){
   return [
        {//get the github profilepicture
            url: 'https://api.github.com/users/?client_id=' + process.env.CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'DELETE',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
},

createNewRepo: function (accessToken, user, name, description, privateRepo){
   return [
        {//get the github profilepicture/user/repos
            url: 'https://api.github.com/' + user  +'/repos?' + qs.stringify({
                        
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        name: name,
                        description: description,
                        private: privateRepo
                        
                }),
            method: 'POST',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
}


}
