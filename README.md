Vidal Sesame for Angular
===

# Requirements

- Java 17
- volta (https://volta.sh/)

# Use It

Install this library :

    npm install @vidal-community/ng2-sesame
    
## Angular compatibility

You have to use the `ng2-sesame` version that is compatible with your version of [Angular](https://github.com/angular/angular).

You need `@angular` dependencies to use this library.

Here is the compatibility matrix:

Please use the ng2-sesame branch corresponding to your Angular version.

| ng2-sesame | Angular  | Branch to develop |
|------------|----------|-------------------|
| ^1         | <=4      | N/A               |
| ^2         | >=6      | N/A               |
| ^3         | >=8.2.0  | N/A               |
| ^4         | >=10.1.0 | N/A               |
| ^5         | >=11.2.0 | N/A               |
| ^12        | >=12     | N/A               |
| ^13        | >=13     | angular13         |
| ^14        | >=14     | angular14         |
| ^15        | >=15     | N/A               |
| ^16        | >=16     | angular16         |
| ^17        | >=17     | angular17         |

See compatible versions on [npm semver calculator](https://semver.npmjs.com).

# Build It

    npm install
    
# How to build and publish

To publish a pre-release, run:

    npm run prerelease
    
To publish a release, run:

    npm run major-release
or 

    npm run minor-release

It will increase version with chosen strategy, then build and package your 
local workspace, and finally publish it on `npm`.
