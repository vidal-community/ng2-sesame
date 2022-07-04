Vidal Sesame for Angular
===

![alt travis](https://api.travis-ci.org/vidal-community/ng2-sesame.svg?branch=master)

# Use It

Install this library :

    npm install @vidal-community/ng2-sesame
    
## Angular compatibility

You have to use the `ng2-sesame` version that is compatible with your version of [Angular](https://github.com/angular/angular).

You need `@angular` dependencies to use this library.

Here is the compatibility matrix:

| ng2-sesame | Angular  |
|------------|----------|
| ^1         | <=4      |
| ^2         | >=6      |
| ^3         | >=8.2.0  |
| ^4         | >=10.1.0 |
| ^5         | >=11.2.0 |
| ^12        | >=12     |
| ^13        | >=13     |

See compatible versions on [npm semver calculator](https://semver.npmjs.com).

# Build It

    npm install
    
# How to build and publish

To publish a pre-release, run:

    npm run prerelease
    
To publish a release, run:

    npm run major-release
    
It will increase version with chosen strategy, then build and package your 
local workspace, and finally publish it on `npm`.
