#!/bin/bash

# Create the dist folder
echo "Creating folders..."
mkdir -p dist/assets
mkdir -p dist/assets/js
mkdir -p dist/assets/css

# Copy all required files there
echo "Copying static assets..."
cp index.html dist/index.html
cp favicon.png dist/favicon.png
cp meta-img.jpeg dist/meta-img.jpeg
cp robots.txt dist/robots.txt
cp sitemap.xml dist/sitemap.xml

# Minify the JS files
echo "Minifying JS..."
uglifyjs --compress --mangle --no-annotations --keep-fnames --output dist/assets/js/video.js assets/js/video.js
cp assets/js/dom-to-image.min.js dist/assets/js/dom-to-image.min.js

# Minify the CSS files
echo "Minifying CSS..."
uglifycss --ugly-comments assets/css/colors.css > dist/assets/css/colors.css
uglifycss --ugly-comments assets/css/main.css > dist/assets/css/main.css