var GitHubApi = require('github');

var gh = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
});

/* GET home page. */
exports.index = function(req, res){

    //setting defaults
    var resp = {
        org: null, 
        repos: [], 
        success: 0,
        errors: []
    }; 

    if(req.params.org){

        //get repos
        //if we know the org
        //bootstrap data for speed
        gh.repos.getFromOrg({
            org: req.params.org
        }, function(err, repos){
            if(!err){
                resp.repos = repos;
                resp.org = {login: req.params.org};
            }else{
                resp.errors.push(err);
            }
            res.render('index', resp);
        });

    }else{
        res.render('index', resp);
    }
};
