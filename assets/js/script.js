var testButton = document.getElementById("testButton");
var testText = document.getElementById("testID");
var weatherApiKey = "bfcf3c1f54781a5d45ad618d1c8a4da9";
var testURI = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=bfcf3c1f54781a5d45ad618d1c8a4da9"

testButton.addEventListener("click", getWeatherByLocation);

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
}