// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// bodyParser is deprecated, should use new express method...
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

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

// GET route to retrieve all data from projectData
app.get('/all', (request, response) => {
    response.send(projectData);
});

// POST route to add data from the client
// and save it to projectData
app.post('/addData', (request, response) => {
    let data = request.body;

    projectData["date"] = data.date;
    projectData["temperature"] = data.temperature;
    projectData["userResponse"] = data.userResponse;

    // return the new entry added
    response.send(projectData);
});