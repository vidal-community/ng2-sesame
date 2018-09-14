Vidal Sesame for Angular
===

![alt travis](https://api.travis-ci.org/vidal-community/ng2-sesame.svg?branch=master)

# Build It

    npm install

# Use It

Install this library :

    npm install @vidal-community/ng2-sesame
    
# How to build and publish

To publish a pre-release, run:

    npm run prepare-prerelease
    npm run build-and-publish
    
To publish a release, run:

    npm run prepare-release
    npm run build-and-publish
    
It will increase version with chosen strategy, then build and package your 
local workspace, and finally publish it on `npm`.
