# Peezy

Peezy is a micro-CMS for Node.js. 

This is an experiment in building a minimalist flat-file publishing engine built on Express.js. Inspired heavily by WordPress, Jekyll and Harp.

## Get Started:

**Step 1 - Install**

Clone this repo and do an ```npm install```.

**Step 2 - Add content**

Add content files to /site/content, in ```.html``` format.

Example:

- /site/content/index.html (homepage)
- /site/content/about.html (/about page)
- /site/content/credits.html (/credits page)

Peezy will turn your filenames into clean "permalink"-style URLs. 

**Step 3 - Customize the theme**

There is a default theme in /themes/default. It's structured like this:

- /site/themes/default/index.ejs
- /site/themes/default/favicon.ico 
- /site/themes/default/css (css files)
- /site/themes/default/js (js files)
- /site/themes/default/lib (library files)

Customize and add files as needed. Peezy will wrap the theme around your content files.

**Step 4 - Start the server**

```node app.js```

(see default at http://localhost:8000)

--

Alpha version. Work in progress!

by @dylanized

