Vidal Sesame for Angular
===

![alt travis](https://api.travis-ci.org/vidal-community/ng2-sesame.svg?branch=master)

# Use It

Install this library :

    npm install @vidal-community/ng2-sesame
    
## Angular compatibility

You have to use the `ng2-sesame` version that is compatible with your version of [Angular](https://github.com/angular/angular).
Here is the compatibility matrix:

| ng2-sesame | Angular |
| ---------- | ------- |
| ^1         | <=4     |
| ^2         | ^6      |

See compatible versions on [npm semver calculator](https://semver.npmjs.com).

# Build It

    npm install
    
# How to build and publish

To publish a pre-release, run:

    npm run prepare-prerelease
    npm run build-and-publish
    
To publish a release, run:

    npm run prepare-release
    npm run build-and-publish
    
It will increase version with chosen strategy, then build and package your 
local workspace, and finally publish it on `npm`.
