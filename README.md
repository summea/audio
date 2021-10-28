# Audio
A simple, web-based audio player.

This project started out as a way to make some past music recordings of mine more accessible. A lot of the music has been available online for a while, but it might be hard to access. This project gives people the ability to hear more songs in an easier format.

For now, this is a personal project that is specific to my current use case. There are probably better ways to build this type of application, but I'm trying to use a simple approach for the time being and have been learning a lot along the journey!

## Deployment on Personal Website
1. `git fetch origin`
2. `git reset --hard origin/main` (or if there is a version number, use `v1.2.3` type of version number instead of `origin/main`)
3. `cp $HOME/settings.js modules/`

Note: That last step is used to copy over a local settings.js file to the modules folder.

## Testing
1. `cd` to audio project directory
2. `./node_modules/mocha/bin/mocha test --recursive`

- ref: https://mochajs.org/#the-test-directory
