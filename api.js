let CLIENT_ID = "a7bd17430ccafbea1df9"
let CLIENT_SECRET = "85f152b50698af03f7553426df5887574bfd1b23"

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
            url:'https://api.github.com/user/repos?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET + '&per_page=100',
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
  ];
},

getMainContent: function (accessToken, repo, owner){
    return [
        {//API query to get programming languages used in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/languages?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET,
            method: 'GET',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        },
        {// api query to list out collaborators in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/collaborators?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET,
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        },
        {// api query to list out collaborators in repo
            url: 'https://api.github.com/repos/' + owner + '/' + repo + '/commits?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET,
            method: 'GET',
            headers: {'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ];
},

getAuthorization: function (accessToken){
   return [
        {//remove accesToken
            url: 'https://api.github.com/applications/grants?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET,
            method: 'GET',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
 
},
// log out by revoking the applications access to user profile data  DELETE /applications/:client_id/grants/:access_token
revokeGrant: function (accessToken){
   return [
        {//remove accesToken
            url: 'https://api.github.com/applications/' + CLIENT_ID + '/grants/' + accessToken + '?client_id=' + CLIENT_ID + '&client_secret='  + process.env.CLIENT_SECRET,
            method: 'DELETE',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
},

createNewRepo: function (accessToken, name, description, privateRepo, readme){
  return [
        {//create new repository on github
            url: 'https://api.github.com/user/repos?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET ,
            json:{name: name, description: description, private: privateRepo, auto_init: readme},
            method: 'POST',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    ]
},

repositoryStats: function (accessToken, owner, repo){
   return [
        {//get the github profilepicture/user/repos
            url: 'https://api.github.com/repos/' + owner  +'/' + repo +'/stats/participation?client_id='+CLIENT_ID+'&client_secret=' +CLIENT_SECRET,
            method: 'GET',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        },
        
    ]
}



}
