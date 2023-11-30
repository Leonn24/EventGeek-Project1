// Variable for the API key //
var API_KEY = 'Mzg0NzY2Mjl8MTcwMDcwNDA4NS45NjQ1Mzg'; 
// Variable for URL with API Key //
var apiUrl = `https://api.seatgeek.com/2/events?client_id=${API_KEY}`; 

// Function to fetch events data //
async function fetchEvent(events) {
    return fetch(`${apiUrl}&q=${events}`)
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
                <p>Link: ${listData.venue.url}</p>
            `;
            document.getElementById('event-data').appendChild(eventElement);
        }
    } else {
        console.log('No events found.');
    }
}



//