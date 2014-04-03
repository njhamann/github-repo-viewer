'use strict';
// Declare app level module which depends on filters, and services
angular.module('RepoLister', [
  'ngRoute',
  'RepoLister.directives',
  'RepoLister.filters',
  'RepoLister.controllers'
]).config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
});

/* Controllers */
angular.module('RepoLister.controllers', [])
    .controller('Alert', ['$scope', function($scope) {
        
        if(githubListApp.errors.length){
            githubListApp.errors.forEach(function(error){
                error.message = JSON.parse(error.message);
            });
        }
        $scope.$root.errors = githubListApp.errors || [];
    
    }])
    .controller('Search', ['$scope', '$location', function($scope, $location) {
    
        $scope.org = githubListApp.org || {};
        $scope.clearRepos = function(){
            $scope.$root.$broadcast('clearRepos');
            $location.path('/');
        };
    
    }])
    .controller('RepoList', ['$scope', '$http', function($scope, $http) {
        
        $scope.repos = githubListApp.repos;
        $scope.requestRepos = function(e, login){
            if($scope.login && $scope.login === login) return;
        
            $scope.login = login;
            var url = '/api/repos';
            $http.get(url, {params: {
                org: login
            }}).success(function(d) {
                if(d.code && d.code == 403 || d.code == 404){
                    d.message = JSON.parse(d.message);
                    $scope.$root.errors = [d];
                    $scope.repos = [];
                }else{
                    $scope.$root.errors = [];
                    $scope.repos = d;
                }
            }).error(function(e) { 
            });
        
        };

        //events
        $scope.$on('requestRepos', $scope.requestRepos);
        $scope.$on('clearRepos', function(){ 
            $scope.repos = []; 
        });
    
    }])
    .controller('RepoListItem', ['$scope', '$http', function($scope, $http) {
    
        $scope.requestCommits = function(repo){
            if($scope.commits && $scope.commits.length) return;
            var url = '/api/commits';
            $http.get(url, {params: {
                user: repo.owner.login,
                repo: repo.name
            }}).success(function(d) { 
                $scope.commits = d;
            }).error(function(e) { 
                console.log(e);
            });
        };
        
        $scope.$on('requestCommits', function(e, index){
            if($scope.$index === index){
                $scope.requestCommits($scope.repo);
                $scope.showCommits = !$scope.showCommits;
            }
        });
    }])
    .controller('CommitList', function() {})
    .controller('CommitListItem', function() {});

/* Directives */
angular.module('RepoLister.directives', [])
    .directive('enterSubmit', ['$location', function($location) {
        return function(scope, elm, attrs) {
        
            elm.bind('keyup', function(e){
                if(e.which === 13){
                    //take action
                    scope.$root.$broadcast('requestRepos', scope.org.login);
                    $location.path('/' + scope.org.login);
                    
                }
            });
        
        };
    }])
    .directive('keyCapture', ['$location', function($location) {
        return function(scope, elm, attrs) {
    
            scope.$root.selectIndex = -1; 
            elm.bind('keydown', function(e){
                if(e.which === 13){
                    e.preventDefault();
                    if(scope.$root.selectIndex > -1){
                        scope.$apply(function(){
                            scope.$root.$broadcast('requestCommits', scope.$root.selectIndex);
                    
                        });
                    }
                }else if(e.which === 40){
                    e.preventDefault();
                    scope.$apply(function(){
                        scope.$root.selectIndex++;
                    });
                    window.location.hash = 'repo_' + scope.$root.selectIndex;
                }else if(e.which === 38){
                    e.preventDefault();
                    if(scope.$root.selectIndex > -1){
                        scope.$apply(function(){
                            scope.$root.selectIndex--;
                        });
                        window.location.hash = 'repo_' + scope.$root.selectIndex;
                    }
                }
            });
            
            scope.$on('clearRepos', function(e){
               document.getElementById('org_name').focus(); 
            });
            
            scope.$watch('$root.selectIndex', function(index){
                if(index === -1){
                   document.getElementById('org_name').focus(); 
                }else{
                   document.getElementById('org_name').blur(); 
                }
            });

        };
    }]);

/* Filters */
angular.module('RepoLister.filters', [])
    .filter('shortSha', function() {
        return function(input) {
            return input.substr(0, 7);
        };
    });
