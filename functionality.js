// baseUrl = http://api.openweathermap.org/data/2.5/weather?id=5128581&mode=JSON&units=metric&appid=42662a125c8a2e1a68ae6706016e85ec

// Assign constants and globals, then fetch weather data to display and set a 5 minute interval for fetching new weather data
console.log("👋🏽 Hello!")
var location;
var unit = "metric"
const resultsTray = document.getElementById("resultsTray")
const search = document.getElementById("location")
var locations = await fetchLocations()
import {APIkey} from "./secret.js"
fetchWeather(); setInterval(fetchWeather(), 300000);

// Add listeners for unit conversions, search bar
document.getElementById('unitChangeBack')
    .addEventListener('click', () => {
        unitConversion(
            document.getElementById("tempLow").innerText,
            document.getElementById("tempCurrent").innerText,
            document.getElementById("tempHigh").innerText,
            document.getElementById("tempFeelsLike").innerText,
            document.getElementById("windSpeed").innerText,
            document.getElementById("unitChangeBack").innerText
        )
    });
document.getElementById('unitChangeForth')
    .addEventListener('click', () => {
        unitConversion(
            document.getElementById("tempLow").innerText,
            document.getElementById("tempCurrent").innerText,
            document.getElementById("tempHigh").innerText,
            document.getElementById("tempFeelsLike").innerText,
            document.getElementById("windSpeed").innerText,
            document.getElementById("unitChangeForth").innerText
        )
    });
search
    .addEventListener('input', (e) => {
        if (e.target.value.trim().length === 0) search.setAttribute("placeholder", "City, Country") // If there is nothing in the search bar make the placeholder a user prompt
        else search.setAttribute('placeholder', e.target.value)                                     // If not make the placeholder the current location
        search.setAttribute('size', search.getAttribute('placeholder').length)                      // Set the size of the search bar to the length of the placeholder regardless
        
        // Retrieve relevant locations and empty the results tray
        let results = searchLocations(e.target.value)
        while (resultsTray.firstChild) resultsTray.removeChild(resultsTray.firstChild)
        
        // For each relevant location, add it to the resultsTray and assign it a listener to fetch the weather for that location
        for (let i = 0; i < results.length; i++) {
            let result = document.createElement('li')
            result.appendChild(document.createTextNode(results[i].name + ", " + results[i].country))
            result.style.cursor = "pointer"
            result.addEventListener('click', () => {
                location = results[i]
                fetchWeather()
            });
            resultsTray.appendChild(result)
        }
    });

// Retrieve and store city objects from city.list.json in an array for later searching
async function fetchLocations() {
    try {locations = await (await fetch("./city.list.json")).json(); return locations}
    catch (error) {console.error(error)}
}

// Retrieve weather data from the Open Weather Map API, make UI changes accrdoing to weather data
async function fetchWeather() {
    if (!location) location = locations[163679] // Default city is Ottawa, Canada
    
    // Fetch, parse the weather data
    var response = await fetch("https://api.openweathermap.org/data/2.5/weather?id=" + location.id + "&mode=JSON&units=" + unit + "&appid=" + APIkey, {
        referrerPolicy: "no-referrer",
    }).then(response => response.json());

    // Set width of search bar to be length of selected location by using placeholder attribute
    search.setAttribute('placeholder', location.name + ", " + location.country);
    search.setAttribute('size', search.getAttribute('placeholder').length);

    // Check to see if it is daytime in the target city and change the background accordingly
    var fetchTime = Math.floor(Date.now() / 1000);
    var sunrise = response.sys.sunrise;
    var sunset = response.sys.sunset;
    if (fetchTime > sunrise && fetchTime < sunset) document.body.style.backgroundImage = "url(img/Daytime.jfif)";
    else document.body.style.backgroundImage = "url(img/NightSky.jpg)";
    
    displayWeather(response); // Display the results of our request
}

// Return relevant cities by checking for matches to user query
function searchLocations(query) {
    let results = []
    let regex = RegExp("^" + query, "i")
    query = query.trim()
    if (query && query.length > 0) {
        results = locations.filter(location => {
            return regex.test(location.name + ", " + location.country)
        })
    } return results
}

// Display the weather data we've retrieved or converted
function displayWeather(response, tempLow, tempCurrent, tempHigh, tempFeelsLike, windSpeed) {
    if (isNaN(arguments[0])) { // Check if an API response is passed - response will be NaN and the first argument, none of the other args will because I say so and I wrote the code >:(
        search.value = response.name + ", " + response.sys.country
        document.getElementById("weather").innerText = capitalizeEachWord(response.weather[0].description);
        document.getElementById("weatherIcon").src = "img/icons/" + response.weather[0].icon + ".png"
        document.getElementById("pressure").innerText = response.main.pressure + " hPa";
        document.getElementById("humidity").innerText = response.main.humidity + "%";
        if (unit === "metric") { // Display the results with metric units
            document.getElementById("tempLow").innerText = round(response.main.temp_min) + " °C";
            document.getElementById("tempCurrent").innerText = round(response.main.temp) + " °C";
            document.getElementById("tempHigh").innerText = round(response.main.temp_max) + " °C";
            document.getElementById("tempFeelsLike").innerText = response.main.feels_like + " °C";
            document.getElementById("windSpeed").innerText = response.wind.speed  + " m/s " + getBearing(response.wind.deg);
        } else if (unit === "imperial") { // Display the results with imperial units
            document.getElementById("tempLow").innerText = round(response.main.temp_min) + " °F";
            document.getElementById("tempCurrent").innerText = round(response.main.temp) + " °F";
            document.getElementById("tempHigh").innerText = round(response.main.temp_max) + " °F";
            document.getElementById("tempFeelsLike").innerText = response.main.feels_like + " °F";
            document.getElementById("windSpeed").innerText = response.wind.speed  + " mph " + getBearing(response.wind.deg);
        } else if (unit === "standard") { // Display the results with standard units
            document.getElementById("tempLow").innerText = round(response.main.temp_min) + " K";
            document.getElementById("tempCurrent").innerText = round(response.main.temp) + " K";
            document.getElementById("tempHigh").innerText = round(response.main.temp_max) + " K";
            document.getElementById("tempFeelsLike").innerText = response.main.feels_like + " K";
            document.getElementById("windSpeed").innerText = response.wind.speed  + " m/s " + getBearing(response.wind.deg);
        }
    } else { // If no response is present, we are presenting existing values we've converted
        var splitWind = document.getElementById("windSpeed").innerText.split(" ");;
        if (unit === "metric") { // Display the results with metric units
            document.getElementById("tempLow").innerText = round(tempLow) + " °C";
            document.getElementById("tempCurrent").innerText = round(tempCurrent) + " °C";
            document.getElementById("tempHigh").innerText = round(tempHigh) + " °C";
            document.getElementById("tempFeelsLike").innerText = tempFeelsLike + " °C";
            document.getElementById("windSpeed").innerText = windSpeed + " m/s " + splitWind[splitWind.length - 1];
        } else if (unit === "imperial") { // Display the results with imperial units
            document.getElementById("tempLow").innerText = round(tempLow) + " °F";
            document.getElementById("tempCurrent").innerText = round(tempCurrent) + " °F";
            document.getElementById("tempHigh").innerText = round(tempHigh) + " °F";
            document.getElementById("tempFeelsLike").innerText = tempFeelsLike + " °F";
            document.getElementById("windSpeed").innerText = windSpeed + " mph " + splitWind[splitWind.length - 1];
        } else if (unit === "standard") { // Display the results with standard units
            document.getElementById("tempLow").innerText = round(tempLow) + " K";
            document.getElementById("tempCurrent").innerText = round(tempCurrent) + " K";
            document.getElementById("tempHigh").innerText = round(tempHigh) + " K";
            document.getElementById("tempFeelsLike").innerText = tempFeelsLike + " K";
            document.getElementById("windSpeed").innerText = windSpeed + " m/s " + splitWind[splitWind.length - 1];
        }
    }
}

// Switch units when the user requests a conversion
function unitConversion(tempLow, tempCurrent, tempHigh, tempFeelsLike, windSpeed, newUnit) {
    if (newUnit === "°F") {
        switch (unit) {
            case "metric": // Convert from metric to imperial
                unit = "imperial";
                document.getElementById("unitChangeBack").innerText = "K";
                document.getElementById("unitChangeForth").innerText = "°C";
                tempLow = round(parseFloat(tempLow) * (9/5) + 32);
                tempCurrent = round(parseFloat(tempCurrent) * (9/5) + 32);
                tempHigh = round(parseFloat(tempHigh) * (9/5) + 32);
                tempFeelsLike = round(parseFloat(tempFeelsLike) * (9/5) + 32, 2);
                windSpeed = round(parseFloat(windSpeed) * 2.236936, 2);
                break;
            case "standard": // Convert from standard to imperial
                unit = "imperial";
                document.getElementById("unitChangeBack").innerText = "K";
                document.getElementById("unitChangeForth").innerText = "°C";
                tempLow = round((parseFloat(tempLow) + 273.15) * (9/5) + 32);
                tempCurrent = round((parseFloat(tempCurrent) + 273.15) * (9/5) + 32);
                tempHigh = round((parseFloat(tempHigh) + 273.15) * (9/5) + 32);
                tempFeelsLike = round(((parseFloat(tempFeelsLike) + 273.15) * (9/5) + 32), 2);
                windSpeed = round(parseFloat(windSpeed) * 2.236936, 2);
                break;
        }
    } else if (newUnit === "K") {
        switch (unit) {
            case "metric": // Convert from metric to standard
                unit = "standard";
                document.getElementById("unitChangeBack").innerText = "°C";
                document.getElementById("unitChangeForth").innerText = "°F";
                tempLow = round(parseFloat(tempLow) - 273.15);
                tempCurrent = round(parseFloat(tempCurrent) - 273.15);
                tempHigh = round(parseFloat(tempHigh) - 273.15);
                tempFeelsLike = round(parseFloat(tempFeelsLike) - 273.15, 2);
                windSpeed = parseFloat(windSpeed);
                break;
            case "imperial": // Convert from imperial to standard
                unit = "standard";
                document.getElementById("unitChangeBack").innerText = "°C";
                document.getElementById("unitChangeForth").innerText = "°F";
                tempLow = round((parseFloat(tempLow) - 32) * 5/9 - 273.15);
                tempCurrent = round((parseFloat(tempCurrent) - 32) * 5/9 - 273.15);
                tempHigh = round((parseFloat(tempHigh) - 32) * 5/9 - 273.15);
                tempFeelsLike = round((parseFloat(tempFeelsLike) - 32) * 5/9 - 273.15, 2);
                windSpeed = round(parseFloat(windSpeed) / 2.236936, 2);
                break;
        }
    } else if (newUnit === "°C") {
        switch (unit) {
            case "imperial": // Convert from imperial to metric
                unit = "metric";
                document.getElementById("unitChangeBack").innerText = "°F";
                document.getElementById("unitChangeForth").innerText = "K";
                tempLow = round((parseFloat(tempLow) - 32) * 5/9);
                tempCurrent = round((parseFloat(tempCurrent) - 32) * 5/9);
                tempHigh = round((parseFloat(tempHigh) - 32) * 5/9);
                tempFeelsLike = round((parseFloat(tempFeelsLike) - 32) * 5/9, 2);
                windSpeed = round(parseFloat(windSpeed) / 2.236936, 2);
                break;
            case "standard": // Convert from standard to metric
                unit = "metric";
                document.getElementById("unitChangeBack").innerText = "°F";
                document.getElementById("unitChangeForth").innerText = "K";
                tempLow = round(parseFloat(tempLow) + 273.15);
                tempCurrent = round(parseFloat(tempCurrent) + 273.15);
                tempHigh = round(parseFloat(tempHigh) + 273.15);
                tempFeelsLike = round(parseFloat(tempFeelsLike) + 273.15, 2);
                windSpeed = parseFloat(windSpeed);
                break;
        }
    } displayWeather(0, tempLow, tempCurrent, tempHigh, tempFeelsLike, windSpeed); // Display the converted values
}

// Round the raw data to display it more neatly
function round(num, digits = 1) {
    let rounded = Math.pow(10, digits);
    return (Math.round(num * rounded) / rounded).toFixed(digits);
}

// Capitalize each word in the given string to make it presentable
function capitalizeEachWord(sentence) {
    var words = sentence.split(" ");                                        // Split the sentence by spaces into an array of words
    for (let word = 0; word < words.length; word++)                         // For each word...
        words[word] = words[word][0].toUpperCase() + words[word].substr(1); // ... capitalize the first letter
    return words.join(" ");                                                 // Join them back into a sentence and return the result
}

// Convert degrees to a compass bearing
function getBearing(degrees) {
    if (340 < degrees && degrees <= 360 || 0 <= degrees && degrees <= 20) return "N";
    else if (20 < degrees && degrees <= 70) return"NE";
    else if (70 < degrees && degrees <= 110) return "E";
    else if (110 < degrees && degrees  <= 160) return "SE";
    else if (160 < degrees && degrees  <= 200) return "S";
    else if (200 < degrees && degrees  <= 250) return "SW";
    else if (250 < degrees && degrees  <= 290) return "W";
    else if (290 < degrees && degrees  <= 340) return "NW";
    else {console.log("The input is not a valid degrees measurement."); return "ERR"}
}