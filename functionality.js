(async function () { // IIFE (Immediately Invoked Function Expression) to initialize app
    console.log("👋🏽 Hello!") // Hello!
    var app = { // Object that represents the state of the app
        location: "",
        locations: await fetchLocations(),

        unit: "metric",
        bgImg: document.body.style.backgroundImage,
        unitChangeBack: document.getElementById("unitChangeBack"),
        unitChangeForth: document.getElementById("unitChangeForth"),

        resultsTray: document.getElementById("resultsTray"),
        search: document.getElementById("search"),
        searchBar: document.getElementById("searchBar"),

        weather: document.getElementById("weather"),
        weatherIcon: document.getElementById("weatherIcon"),

        tempLow: document.getElementById("tempLow"),
        tempCurrent: document.getElementById("tempCurrent"),
        tempHigh: document.getElementById("tempHigh"),
        tempFeelsLike: document.getElementById("tempFeelsLike"),
        pressure: document.getElementById("pressure"),
        windSpeed: document.getElementById("windSpeed"),
        windBearing: "N",
        humidity: document.getElementById("humidity")
    }; setInterval(fetchWeather(app), 1800000); // Refresh the data automatically every half hour 
    
    // Event listeners for unit conversions, search input, query submission
    app.unitChangeBack.addEventListener('click', () => {unitConversion(app, app.unitChangeBack.innerText)})
    app.unitChangeForth.addEventListener('click', () => {unitConversion(app, app.unitChangeForth.innerText)})

    app.search.addEventListener('input', () => {
        if (app.search.value.trim().length === 0) app.search.setAttribute("placeholder", "City, Country") // If there is nothing in the search bar make the placeholder a prompt
        else app.search.setAttribute('placeholder', app.search.value)                                     // Else make the placeholder the current location
        app.search.setAttribute('size', app.search.getAttribute('placeholder').length)                    // Set the size of the search bar to the length of the placeholder regardless
    })
    
    app.searchBar.addEventListener("submit", (e) => {
        // Prevent default form submission, retrieve relevant locations to user query and empty the results tray
        e.preventDefault()
        while (app.resultsTray.firstChild) app.resultsTray.removeChild(app.resultsTray.firstChild)
        let results = searchLocations(app)

        // For each relevant location, add it to the resultsTray and assign it a listener to fetch the weather for that location & empty results tray
        if (results.length !== 0) {
            for (let index = 0; index < results.length; index++) {
                let result = document.createElement('li')
                result.appendChild(document.createTextNode(results[index].name))
                result.style.cursor = "pointer"

                result.addEventListener('click', () => { // Remove all elements currently in the resultsTray
                    app.location = results[index]; 
                    fetchWeather(app); 
                    while (app.resultsTray.firstChild) app.resultsTray.removeChild(app.resultsTray.firstChild)
                }); app.resultsTray.appendChild(result)  // Populate the resultsTray with our new results
            }
        } else { // If there are no relevant locations, notify the user in place of the results
            let result = document.createElement('li')
            result.appendChild(document.createTextNode("No results"))
            result.style.cursor = "not-allowed"
            app.resultsTray.appendChild(result)
        }
    })
})()

// Retrieve and store city objects from city.list.json in an alphabetically sorted array
async function fetchLocations() {
    let locations = await (await fetch("./city.list.json")).json()
    for (let index = 0; index < locations.length; index++) {
        locations[index] = {
            name: locations[index].name + ", " + locations[index].country,
            id: locations[index].id,
            coord: locations[index].coord
        }
    } return locations
}

// Retrieve weather data from the Open Weather Map API, populate UI according to weather data
async function fetchWeather(app) {
    if (app.location === "") app.location = app.locations[Math.floor(Math.random() * (app.locations.length - 1))] // Select a random location to initially display
    
    // Retrieve weather data from OpenWeatherAPI
    var response = await fetch("http://jeweled-successful-nectarine.glitch.me/location=" + app.location.id, {
        method: "GET"
    }).then(response => response.json())

    // Set width of search bar to be length of selected location
    app.search.setAttribute('placeholder', app.location.name)
    app.search.setAttribute('size', app.search.getAttribute('placeholder').length)
    
    displayWeather(app, response) // Display the results of our request
}

// Display the weather data we've retrieved or converted
function displayWeather(app, response) {
    if (response) { // Check if an API response is passed, if it is populate UI w/ the new weather data
        app.search.value = app.location.name
        app.weather.innerText = capitalizeEachWord(response.weather[0].description)
        app.weatherIcon.src = "img/icons/" + response.weather[0].icon + ".png"
        app.pressure.innerText = response.main.pressure + " hPa"
        app.humidity.innerText = response.main.humidity + "%"
        app.windBearing = getBearing(response.wind.deg)
        if (app.unit === "metric") { // Display the results with metric units
            app.tempLow.innerText = round(response.main.temp_min) + " °C"
            app.tempCurrent.innerText = round(response.main.temp) + " °C"
            app.tempHigh.innerText = round(response.main.temp_max) + " °C"
            app.tempFeelsLike.innerText = response.main.feels_like + " °C"
            app.windSpeed.innerText = response.wind.speed  + " m/s " + app.windBearing
        } else if (app.unit === "imperial") { // Display the results with imperial units
            app.tempLow.innerText = round(response.main.temp_min) + " °F"
            app.tempCurrent.innerText = round(response.main.temp) + " °F"
            app.tempHigh.innerText = round(response.main.temp_max) + " °F"
            app.tempFeelsLike.innerText = response.main.feels_like + " °F"
            app.windSpeed.innerText = response.wind.speed  + " mph " + app.windBearing
        } else if (app.unit === "standard") { // Display the results with standard units
            app.tempLow.innerText = round(response.main.temp_min) + " K"
            app.tempCurrent.innerText = round(response.main.temp) + " K"
            app.tempHigh.innerText = round(response.main.temp_max) + " K"
            app.tempFeelsLike.innerText = response.main.feels_like + " K"
            app.windSpeed.innerText = response.wind.speed  + " m/s " + app.windBearing
        }
    } else { // If no response is present, we are populating the UI w/ converted values
        if (app.unit === "metric") { // Display the results with metric units
            app.tempLow.innerText = round(app.tempLow.innerText) + " °C"
            app.tempCurrent.innerText = round(tempCurrent.innerText) + " °C"
            app.tempHigh.innerText = round(app.tempHigh.innerText) + " °C"
            app.tempFeelsLike.innerText = app.tempFeelsLike.innerText + " °C"
            app.windSpeed.innerText = app.windSpeed.innerText + " m/s " + app.windBearing
        } else if (app.unit === "imperial") { // Display the results with imperial units
            app.tempLow.innerText = round(app.tempLow.innerText) + " °F"
            app.tempCurrent.innerText = round(app.tempCurrent.innerText) + " °F"
            app.tempHigh.innerText = round(app.tempHigh.innerText) + " °F"
            app.tempFeelsLike.innerText = app.tempFeelsLike.innerText + " °F"
            app.windSpeed.innerText = app.windSpeed.innerText + " mph " + app.windBearing
        } else if (app.unit === "standard") { // Display the results with standard units
            app.tempLow.innerText = round(app.tempLow.innerText) + " K"
            app.tempCurrent.innerText = round(app.tempCurrent.innerText) + " K"
            app.tempHigh.innerText = round(app.tempHigh.innerText) + " K"
            app.tempFeelsLike.innerText = app.tempFeelsLike.innerText + " K"
            app.windSpeed.innerText = app.windSpeed.innerText + " m/s " + app.windBearing
        }
    }
}

// Return relevant cities to user query
function searchLocations(app) {
    let query = app.search.value.trim()
    let regex = RegExp("^" + query, "i")
    let results = []
    if (query.length > 0) results = app.locations.filter(location => {return regex.test(location.name)})
    return results
}

// Switch units when the user requests a conversion
function unitConversion(app, newUnit) {
    if (newUnit === "°F") {
        switch (app.unit) {
            case "metric": // Convert from metric to imperial
                app.unit = "imperial"
                app.unitChangeBack.innerText = "K"
                app.unitChangeForth.innerText = "°C"
                app.tempLow.innerText = round(parseFloat(app.tempLow.innerText) * (9/5) + 32)
                app.tempCurrent.innerText = round(parseFloat(app.tempCurrent.innerText) * (9/5) + 32)
                app.tempHigh.innerText = round(parseFloat(app.tempHigh.innerText) * (9/5) + 32)
                app.tempFeelsLike.innerText = round(parseFloat(app.tempFeelsLike.innerText) * (9/5) + 32, 2)
                app.windSpeed.innerText = round(parseFloat(app.windSpeed.innerText) * 2.236936, 2)
                break
            case "standard": // Convert from standard to imperial
                app.unit = "imperial"
                app.unitChangeBack.innerText = "K"
                app.unitChangeForth.innerText = "°C"
                app.tempLow.innerText = round((parseFloat(app.tempLow.innerText) + 273.15) * (9/5) + 32)
                app.tempCurrent.innerText = round((parseFloat(app.tempCurrent.innerText) + 273.15) * (9/5) + 32)
                app.tempHigh.innerText = round((parseFloat(app.tempHigh.innerText) + 273.15) * (9/5) + 32)
                app.tempFeelsLike.innerText = round(((parseFloat(app.tempFeelsLike.innerText) + 273.15) * (9/5) + 32), 2)
                app.windSpeed.innerText = round(parseFloat(app.windSpeed.innerText) * 2.236936, 2)
                break
        }
    } else if (newUnit === "K") {
        switch (app.unit) {
            case "metric": // Convert from metric to standard
                app.unit = "standard"
                app.unitChangeBack.innerText = "°C"
                app.unitChangeForth.innerText = "°F"
                app.tempLow.innerText = round(parseFloat(app.tempLow.innerText) - 273.15)
                app.tempCurrent.innerText = round(parseFloat(app.tempCurrent.innerText) - 273.15)
                app.tempHigh.innerText = round(parseFloat(app.tempHigh.innerText) - 273.15)
                app.tempFeelsLike.innerText = round(parseFloat(app.tempFeelsLike.innerText) - 273.15, 2)
                app.windSpeed.innerText = parseFloat(app.windSpeed.innerText)
                break
            case "imperial": // Convert from imperial to standard
                app.unit = "standard"
                app.unitChangeBack.innerText = "°C"
                app.unitChangeForth.innerText = "°F"
                app.tempLow.innerText = round((parseFloat(app.tempLow.innerText) - 32) * 5/9 - 273.15)
                app.tempCurrent.innerText = round((parseFloat(app.tempCurrent.innerText) - 32) * 5/9 - 273.15)
                app.tempHigh.innerText = round((parseFloat(app.tempHigh.innerText) - 32) * 5/9 - 273.15)
                app.tempFeelsLike.innerText = round((parseFloat(app.tempFeelsLike.innerText) - 32) * 5/9 - 273.15, 2)
                app.windSpeed.innerText = round(parseFloat(app.windSpeed.innerText) / 2.236936, 2)
                break
        }
    } else if (newUnit === "°C") {
        switch (app.unit) {
            case "imperial": // Convert from imperial to metric
                app.unit = "metric"
                app.unitChangeBack.innerText = "°F"
                app.unitChangeForth.innerText = "K"
                tempLow.innerText = round((parseFloat(app.tempLow.innerText) - 32) * 5/9)
                tempCurrent.innerText = round((parseFloat(app.tempCurrent.innerText) - 32) * 5/9)
                tempHigh.innerText = round((parseFloat(app.tempHigh.innerText) - 32) * 5/9)
                tempFeelsLike.innerText = round((parseFloat(app.tempFeelsLike.innerText) - 32) * 5/9, 2)
                windSpeed.innerText = round(parseFloat(app.windSpeed.innerText) / 2.236936, 2)
                break
            case "standard": // Convert from standard to metric
                app.unit = "metric"
                app.unitChangeBack.innerText = "°F"
                app.unitChangeForth.innerText = "K"
                app.tempLow.innerText = round(parseFloat(app.tempLow.innerText) + 273.15)
                app.tempCurrent.innerText = round(parseFloat(app.tempCurrent.innerText) + 273.15)
                app.tempHigh.innerText = round(parseFloat(app.tempHigh.innerText) + 273.15)
                app.tempFeelsLike.innerText = round(parseFloat(app.tempFeelsLike.innerText) + 273.15, 2)
                app.windSpeed.innerText = parseFloat(app.windSpeed.innerText)
                break
        }
    } displayWeather(app) // Display the converted values
}

// Round data for display
function round(num, digits = 1) {
    let rounded = Math.pow(10, digits)
    return (Math.round(num * rounded) / rounded).toFixed(digits)
}

// Capitalize each word in the given string to make it presentable
function capitalizeEachWord(sentence) {
    let words = sentence.split(" ")                                        // Split the sentence by spaces into an array of words
    for (let word = 0; word < words.length; word++)                        // For each word capitalize the first letter
        words[word] = words[word][0].toUpperCase() + words[word].substr(1)
    return words.join(" ")                                                 // Join them back into a sentence and return the result
}

// Convert degrees to a compass bearing
function getBearing(degrees) {
    if (340 < degrees && degrees <= 360 || 0 <= degrees && degrees <= 20) return "N"
    else if (20 < degrees && degrees <= 70) return "NE"
    else if (70 < degrees && degrees <= 110) return "E"
    else if (110 < degrees && degrees  <= 160) return "SE"
    else if (160 < degrees && degrees  <= 200) return "S"
    else if (200 < degrees && degrees  <= 250) return "SW"
    else if (250 < degrees && degrees  <= 290) return "W"
    else if (290 < degrees && degrees  <= 340) return "NW"
    else return "ERR"
}