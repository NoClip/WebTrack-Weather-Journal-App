/* Global Variables */
let generateButton = document.querySelector('#generate');

const apiKey = '16ea4ef88107d12dde737e969b660f97';
// Replace {apiKey} with the apiKey as well as {zipCode}
// see getWeatherData method
// also using units=imperial to return Fahrenheit
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid={apiKey}&zip={zipCode}`;

// get/fetch data from OpenWeatherMap using zip code
const getWeatherData = async (baseUrl = '', apiKey, zipCode) => {
    // Replace {apiKey} with the apiKey as well as {zipCode} 
    // with the input  parameters
    const url = baseUrl
        .replace('{apiKey}', apiKey)
        .replace('{zipCode}', zipCode);

    const request = await fetch(url);

    try {
        // get data and return only the temperature info
        // no need for other data
        const allData = await request.json();
        return allData.main.temp;
    }
    catch (error) {
        // if there is any error like wrong input zipCode
        // return null
        return null;
    }
};

// post the data recieved from the OpenWeather api
// to the local server using end point (/addData)
const postDataToServer = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

// async update UI method
// get request endpoint (/all) from local server
// and print the last/recent item in the array
const updateUI = async (recentData) => {
    // fetch all data from server
    const request = await fetch('/all');
    try {
        // convert it to JSON
        const data = await request.json();

        // get elements temp, date, and content
        const tempElement = document.querySelector('#temp');
        const dateElement = document.querySelector('#date');
        const contentElement = document.querySelector('#content');

        // set element values and add <br> to the end
        // &#176; is the temperature degree symbol
        // F for Fahrenheit
        console.log(data);
        tempElement.innerHTML = data.temperature + ' &#176;F <br>';
        dateElement.innerHTML = data.date + '<br>';
        // innerText to handle new lines
        contentElement.innerText = data.userResponse;
    } catch (error) {
        console.log("error", error);
    }
}

// the generate button onClick event listener
// which runs all the chain promises
generateButton.addEventListener('click', (e) => {
    // zipCode input
    let zipCodeTextInput = document.querySelector('#zip');
    // feelings input
    let feelingsTextInput = document.querySelector('#feelings');

    // get the weather data
    // pass the baseUrl apiKey, and the zipcode
    getWeatherData(baseUrl, apiKey, zipCodeTextInput.value)
        .then((temperature) => {
            // if the temperature returned from getWeatherData is not null
            // means everything is good
            // also check that the feelingsTextInput value is not empty
            if (temperature && feelingsTextInput.value) {
                let d = new Date();
                // Month is zero based, adding 1
                let currentDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

                // create the new entry
                let newEntry = {
                    temperature: temperature,
                    date: currentDate,
                    userResponse: feelingsTextInput.value,
                };

                // post new entry to server
                return postDataToServer('/addData', newEntry);
            }
            // else means that the temperature is null
            // or the feelingsTextInput value is empty
            return null;
        })
        .then((recentData) => {
            // if the recent data is null means there is error 
            // or null data or empty values from the user 
            if (recentData) {
                updateUI(recentData);
            }
        });
});