# Setup For Development & Deployment

Pull from git and then run the following:

    $ npm i -g gulp-cli
    $ cd src
    $ npm i
    $ gulp build

For ImageOptim run the following:
	
	$ gulp imageoptim

Whilst developing, you may use just `gulp` to both do the initial build and watch the files for changes.

Keep in mind NodeJS and NPM have to be installed in the system for gulp to run.

An important note is to remember that in this template, compiled CSS, JS and HTML are not included in the repo and therefore should not be committed. This is done to ensure that the correct files are always deployed consciously.

## /htdocs/landing

- Images are copied from `/src/public/images/` to `images/`.
- Assets are copied from `/src/public/assets/` to `assets/`.
- Compiled CSS goes to `css/`.
- Compiled JS goes to `js/`.
- Compiled HTML goes to `/`.
