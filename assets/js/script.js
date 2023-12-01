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
            // var linkButton = document.createElement('button');
            // linkButton.addEventListener('click', async function (event) {
            //     preventDefault();
            
            

            var eventElement = document.createElement('div');
            eventElement.className = 'event-data';
            eventElement.innerHTML = `
                <h3 id="event-list">${listData.title}</h3>
                <p>Date: ${listData.datetime_utc}</p>
                <p>Venue: ${listData.venue.name}</p>
                <button onclick="window.open('${listData.venue.url}', '_blank')">Get Tickets</button>
                
            `;
            eventElement.appendChild(getWeatherCard(listData.venue.city, listData.datetime_utc));
            document.getElementById('event-data').appendChild(eventElement);
        }
    
    } else {
        console.log('No events found.');
    }
}

//-------WEATHER API CODE-------//

function getWeatherByLocation(){
    var textInput = document.getElementById('search-input');
    //will need to get the city name from the card the button being pressed is in (eventually)
    loc = textInput.value;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${weatherApiKey}&units=imperial`;
    fetch(url)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Something did not work.');
    })
    .then(function (data) {
        var locName = data.name;
        var locWeather = data.weather[0].main;
        var locTemp = data.main.temp;

        console.log(`City Name: ${locName}`);
        console.log(`City Name: ${locWeather}`);
        console.log(`City Name: ${locTemp}`);
    })
};
//returns a div HTML element of class "card" so that it can be implemented
//anywhere within building html of a event card
function getWeatherCard(loc, date){
    console.log(`Loc: ${loc}`);
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${weatherApiKey}&units=imperial`;
    var newCard = document.createElement('div');
    newCard.className = "card";

    fetch(url)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Could not grab weather information!');
    })
    .then(function (data){
        newIcon = document.createElement('i');
        newIcon.innerHTML = 
        `<img src="https://openweathermap.org/img/wn/${data.list[getDateIndex(data.list,date)].weather[0].icon}.png" alt="weather-icon">
        <h6 style = "font-size: 10px"> ${Math.round(data.list[0].main.temp)}°F </h6>`;
        //getDateIndex(data.list, date);
        newCard.appendChild(newIcon);
    })
    .catch((error) => {
        console.log(`Error finding ${loc}`)
        console.log("Error: " + error);
    });
    return newCard;
}
//returns the index within data.list where the item's date links up with the event date
function getDateIndex(list, date){
    var dateIndex = 0;
    for (let item of list){
        if (item.dt_txt !== null && date !== null
            && item.dt_txt.substring(0,10) === date.substring(0,10)){
            //console.log("Found a " + date.substring(0,10));
            break;
        }
        dateIndex++;
    };
    return dateIndex;
}