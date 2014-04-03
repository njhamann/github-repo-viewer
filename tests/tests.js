/*
    to use: node_modules/mocha/bin/mocha tests/RepoViewerTests.js
    chromedriver docs: http://selenium.googlecode.com/git/docs/api/javascript/index.html

    get page
    add netflix to input
    hit return
    check that the url changed
    check for more than 0 repo
    click on first item
    check for more than 0 commit
    hit repo api
    hit commits api 
*/
var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    request = require('request');

describe('Repo Viewer', function(){
    test.describe('Selenium', function() {
        
        test.before(function() {
            driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();
        });
        
        test.it('get repos', function() {

            driver.get('http://localhost:3000')
                .then(function(){
                    var inputEl = driver.findElement(webdriver.By.name('org_name'));
                    inputEl.sendKeys('netflix');
                    inputEl.sendKeys(webdriver.Key.RETURN);
                    driver.manage().timeouts().implicitlyWait(2000);                
                    driver.findElements(webdriver.By.className('repo'))
                        .then(function(elements){
                            assert((elements.length > 0 ? true : false), 'No repos returned');
                        });
                });

        });
        
        test.it('get commits', function() {
            
            driver.findElements(webdriver.By.className('repo'))
                .then(function(elements){
                    assert((elements.length > 0 ? true : false), 'No repos returned');
                    elements[0].click();
                    driver.manage().timeouts().implicitlyWait(2000);                
                    driver.findElements(webdriver.By.className('commit'))
                        .then(function(elements){
                            assert((elements.length > 0 ? true : false), 'No commits returned');
                        });
                });
        
        });
      
        test.after(function() { driver.quit(); });

    });

    describe('Api', function() {
        
        it('repo api', function(done) {
            request({
                url: 'http://localhost:3000/api/repos?org=netflix',
                json: true
            }, function (error, response, body) {
                assert(body.length, 'No repos returned');
                done(error);
            });
        });
        
        it('repo commits api', function(done) {
            request({
                url: 'http://localhost:3000/api/commits?repo=Cloud-Prize&user=Netflix',
                json: true
            }, function (error, response, body) {
                assert(body.length, 'No commits returned');
                done(error);
            });
        });
        
    });
});
