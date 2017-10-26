const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

app.set('view engine', 'hbs');


//registerPartials i going to take the directory you want to use for all of your handlebars partial files. This needs to be the absolute directory
//we are going to store our partial files inside our directory, in a folder called partials, in the views folder
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

//using helper, we can create function that do or do not take arguments
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});



//on the request object we have access to everything about the request. the http method, the path, query parameters, ie anything that comes from the client
//whether that client is an app, a browser or an iphone, it is all going to be available in that request object
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  //append file needs 3 arguements. 1.the file name = server.log, whichis a log file 2.the actual content = the log message
  //we also want to move on to the next line after evey single request gets logged, so will concatenate the 'new line' character --> \n
  //3. a callback function. in our case our callback function takes an error argument (just to fill the required callback function with something)
  //calling an asynchronous function without a callback is depricated
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//maintenance middleware. it is going to stop everythng after it from executing. we don't call next, so the actual handlers are never going to get executed
app.use((req, res, next) => {
  res.render('maintenance.hbs')
});


app.use(express.static(__dirname + '/public'));//this is a middleware that serves up a directory
//middleware is executed in the order you call app.use
//the help.html file in the public folder remains.because currently the express surver is responding inside of the express.static middleware
//so the maintenance middleware down below, does not get a chance to execute
//if the app.use(express.static) is moved to after we render the maintenance file to the screen, we will get the maintenance page, like now
//once done with maintenance middleware, can commentit out and website can function as normal



//views is the default directory express uses for your template
//HTTP method RENDER is going to let you render any of the templates you have set up with your current view engine. In this case
//we do have the about.hbs template found in the views folder. So we render about.hbs
//we have a route for /about
app.get('/about', (req, res) => {
  //pass in data into the template by including a second argument to res.render. This argument is an OBJECT with key:value pairs
  res.render('about.hbs', {
    pageTitle: 'About Page',
    //currentYear: new Date().getFullYear()
  });
});


app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg: 'Welcome to my website',
    someText: 'I hope you are enjoying the page'
    //currentYear: new Date().getFullYear()
  });
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
  //now it's clear, to the person who started the app, that the server is ready to go
});
