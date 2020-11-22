const concurrently = require('concurrently');
concurrently(["node server.js", "npm start"])