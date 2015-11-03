# Peezy

Peezy is a micro-CMS for Node.js. 

Using it is easy:

- clone this repo
- npm install
- add content to /site/content/
- customize the theme in /site/themes/default
- start the server

This is an experiment in building a minimalist flat-file publishing engine built on Express.js. Inspired heavily by WordPress, Jekyll and Harp.

Add html files to the /site/content folder. Peezy will turn the filenames into clean "permalink"-style URLs. So "content/about.html" becomes "yourdomain.com/about", and so on.

Peezy site organization:

- /site/content :: html files go here
- /site/themes/ :: dynamic theme files and static theme assets go here
- /site/public/ :: extra static files go here

Alpha version. Work in progress!

by @dylanized

