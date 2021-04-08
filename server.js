// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
//const reload = require('livereload');
// app.use(reload);

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// bodyParser is deprecated, using new express method...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 3000;
/* Spin up the server*/
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});
// reload(app);
// var livereload = require('livereload');
// var lrserver = livereload.createServer();
// lrserver.watch(__dirname + "/website");


// GET route
app.get('/all', (request, response) => {
    response.send(projectData);
});

app.post('/addData', (request, response) => {
    let newEntry = {
        //key: 1,
        temperature: request.body.temperature,
        date: request.body.date,
        userResponse: request.body.userResponse,
    };

    projectData.push(newEntry);

    console.log(newEntry);
    response.send(newEntry);
});