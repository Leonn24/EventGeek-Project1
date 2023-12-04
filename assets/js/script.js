//Event variables
const eventAPI_KEY = 'Mzg0NzY2Mjl8MTcwMDcwNDA4NS45NjQ1Mzg'; 
const eventApiUrl = `https://api.seatgeek.com/2/events?client_id=${eventAPI_KEY}`; 

//Weather variables
const weatherApiKey = "bfcf3c1f54781a5d45ad618d1c8a4da9";
const testURL = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=bfcf3c1f54781a5d45ad618d1c8a4da9"

// Local storage keys

const LAST_SEARCHED_ITEM = 'lastInput';

//-------EVENTS API CODE-------//

// Function to fetch events data //
async function fetchEvent(events) {
    return fetch(`${eventApiUrl}&q=${events}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
        var today = new Date()
           return data.events.filter(function (event){
            var eventDate = new Date (event.datetime_utc.substring(0,10))
            return eventDate > today
            })
        })
        .catch(function (error) {
            console.log(error);
        });
}

function openTickets(url) {
    window.open(url, '_blank');
}
// Search button event listener 

var searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    var textInput = document.getElementById('search-input');
    onSearch(textInput.value);
});

var previousSearchButton = document.getElementById('previous-search-button');
previousSearchButton.addEventListener('click', function () {
    var previousSearchInput = JSON.parse(localStorage.getItem(LAST_SEARCHED_ITEM));
    console.log('test')

    if (previousSearchInput !== null) {
        document.getElementById('search-input').value = previousSearchInput;
        var lastInput = JSON.parse(localStorage.getItem(LAST_SEARCHED_ITEM));
        if(lastInput.length > 2) {
            var city = lastInput[lastInput.length -2]
            document.getElementById('search-input').value = city
            onSearch(city);
        } else {
            alert('No Previous Search Input')
        }
     
    } else {
        alert('No previous search input found.');
    }
})

async function onSearch(value){
    
    

    if (value === "") {

        alert('Please Enter City');
    } else {
        try {
            var eventData = await fetchEvent(value);
            createEvent(eventData); // Pass eventData to createEvent
            createLastSearchInput(value)
        } catch (error) {
            console.log(error);
        }
    }
}

function createLastSearchInput(value) {
   var lastInput = JSON.parse(localStorage.getItem(LAST_SEARCHED_ITEM)) ?? []
   console.log('test', lastInput)
   if(lastInput.indexOf(value) === -1){
    lastInput.push(value)
   localStorage.setItem(LAST_SEARCHED_ITEM, JSON.stringify(lastInput));
   }
   
   
}

// Function to create event and appends to element //
async function createEvent(events) {

    document.getElementById('event-data').innerHTML = "";

    if (events && events.length > 0) {
        var limit = Math.min(events.length, 4);

        for (var i = 0; i < limit; i++) {
            var listData = events[i];
            
            
            var eventElement = document.createElement('div');
            eventElement.className = 'event-data';
            eventElement.innerHTML = `
                <h3 id="event-list">${listData.title}</h3>
                <p>Date: ${listData.datetime_utc.substring(0,10)}</p>
                <p>Venue: ${listData.venue.name}</p>
                <button class="ticketButton" data-url="${listData.venue.url}">Get Tickets</button>
               
                 `;
            eventElement.appendChild(getWeatherCard(listData.venue.city, listData.datetime_utc));
            document.getElementById('event-data').appendChild(eventElement);
        }

        var ticketButtons = document.querySelectorAll('.ticketButton');
        ticketButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                openTickets(this.getAttribute('data-url'));
            });
        });
    
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
            // console.log('test', response);
            return response.json();
        }
        throw new Error('Could not grab weather information!');
    })
    .then(function (data){
        newIcon = document.createElement('i');
        console.log(newCard, 'text')
        newIcon.innerHTML = 
        `<img src="https://openweathermap.org/img/wn/${data.list[getDateIndex(data.list,date)].weather[0].icon}.png" alt="weather-icon">
        <h6 style = "font-size: 10px"> ${Math.round(data.list[0].main.temp)}°F </h6>`;
        //getDateIndex(data.list, date);
        newCard.appendChild(newIcon);
    })
    .catch((error) => {
        // console.log(`Error finding ${loc}`)
        console.log("Error: " + error);
    });
    return newCard;
}
//returns the index within data.list where the item's date links up with the event date
function getDateIndex(list, date){
    console.log('list', list)
    console.log('date', date)
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