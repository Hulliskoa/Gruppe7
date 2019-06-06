const oAuth = require('./oAuth')
let CLIENT_ID = oAuth.client.id
let CLIENT_SECRET = oAuth.client.secret



// functions for creating dynamic api querys based on authenticated user
module.exports = { 
	
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

createNewRepo: function (accessToken, name, description, privateRepo, readme){
  let newRepo =
        {//create new repository on github
            url: 'https://api.github.com/user/repos?client_id=' + CLIENT_ID + '&client_secret='  + CLIENT_SECRET ,
            json:{name: name, description: description, private: privateRepo, auto_init: readme},
            method: 'POST',
            headers:{'Authorization': accessToken, 'User-Agent': 'ProjectAdmin app'},
        }
    return newRepo;
    
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
