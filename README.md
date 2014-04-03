## Notes
Be sure to check out the key shortcuts. You can do just about everything with the Up, Down and Return key.

## Dependencies
#### App
* Node.js

#### Testing
* Selenium ChromeDriver

## Getting Starting
#### App
```
//installing node on osx
brew install node

//installing the app
git clone git@github.com:njhamann/github-repo-viewer.git
cd github-repo-viewer
node ./bin/www
```

#### Testing
With the server running
```
//first install ChromeDriver
//https://code.google.com/p/selenium/wiki/ChromeDriver
node_modules/mocha/bin/mocha tests/tests.js --reporter spec
```

## Frameworks Used
* Express.js
* node-github
* Angular.js
* Boostrap CSS

## Known Issues
* Hits the rate limit quickly (60 per hour)
