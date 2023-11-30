//Event variables
var eventAPI_KEY = 'Mzg0NzY2Mjl8MTcwMDcwNDA4NS45NjQ1Mzg'; 
var eventApiUrl = `https://api.seatgeek.com/2/events?client_id=${eventAPI_KEY}`; 

//Weather variables
var weatherApiKey = "bfcf3c1f54781a5d45ad618d1c8a4da9";
var testURI = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=bfcf3c1f54781a5d45ad618d1c8a4da9"

//-------EVENTS API CODE-------//

// Function to fetch events data //
async function fetchEvent(events) {
    return fetch(`${eventApiUrl}&q=${events}`)
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Search button event listener 

var searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    var textInput = document.getElementById('search-input');

    if (textInput.value === "") {
        alert('Please Enter City');
    } else {
        try {
            var eventData = await fetchEvent(textInput.value);
            createEvent(eventData); // Pass eventData to createEvent
        } catch (error) {
            console.log(error);
        }
    }
});


// Function to create event and appends to element //
async function createEvent(data) {

    document.getElementById('event-data').innerHTML = "";

    if (data && data.events && data.events.length > 0) {
        var limit = Math.min(data.events.length, 4);

        for (var i = 0; i < limit; i++) {
            var listData = data.events[i];

            var eventElement = document.createElement('div');
            eventElement.className = 'event-data';
            eventElement.innerHTML = `
                <h3 id="event-list">${listData.title}</h3>
                <p>Date: ${listData.datetime_utc}</p>
                <p>Venue: ${listData.venue.name}</p>
                <p><a href="${listData.venue.url}" target="_blank">${listData.venue.url}</a></p>
            `;
            document.getElementById('event-data').appendChild(eventElement);
        }
    } else {
        console.log('No events found.');
    }
}

//-------WEATHER API CODE-------//

//searchBtn.addEventListener("click", getWeatherByLocation);

function getWeatherByLocation(){
    //will need to get the city name from the card the button being pressed is in (eventually)
    loc = "Trenton";
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${weatherApiKey}&units=imperial`;
    fetch(url)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Something did not work.');
    })
    .then(function (data) {
        var cityName = data.name;
        var cityWeather = data.weather[0].main;
        var cityTemp = data.main.temp;

        console.log(`City Name: ${cityName}`);
        console.log(`City Name: ${cityWeather}`);
        console.log(`City Name: ${cityTemp}`);
    })
};


