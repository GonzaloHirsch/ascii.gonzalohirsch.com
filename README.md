# ascii.gonzalohirsch.com

This repository contains a very simple video to ASCII converter in real time.

To run the project locally, just open `index.html` on any browser.


## Deploying

### Configuration

In order to get the best of the performance, I recommend running the publishing script, which copies and minifies all required files to a `/dist` folder.

To do this, `UglifyJS` and `UglifyCSS` are required. You can install them using the following commands:
```bash
npm install uglify-js -g
npm install -g uglifycss
```

### Actual Deployment

As NPM is not used here to reduce the bundle size, local generation of the files is required. In order to do this, the `publish.sh` bash script can be used.

To give permissions:
```bash
chmod 755 publish.sh
```

To run:
```bash
./publish.sh
```

## Contribute

Fork the repo, make the changes, and then create a Pull Request for the changes.

Inspiration: https://www.youtube.com/watch?v=55iwMYv8tGI