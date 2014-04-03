var GitHubApi = require('github');

var gh = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
});

exports.repos = function(req, res){
    gh.repos.getFromOrg({
        org: req.query.org
    }, function(err, resp){
        if(err){
            res.json(err);
        }else{
            res.json(resp);
        }
    });
};

exports.commits = function(req, res){
  gh.repos.getCommits({
      user: req.query.user,
      repo: req.query.repo
  }, function(err, resp){
      if(err){
          res.json(err);
      }else{
          res.json(resp);
      }
  });
};

