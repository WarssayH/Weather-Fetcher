What is this repo?
    This is a web app that fetches and displays weather data from OpenWeatherAPI
    for a requested location. It also can convert measurements to other metrics
    such as imperial if you don't want your weather in metric.

A run-down of this repo please?
    index.html -> HTML (HyperText Markup Language) code for the app. Contains
    default values in case the weather isn't fetched which are just placeholders.

    style.css -> External CSS (Cascading StyleSheets) which handles all
    styling and responsiveness.

    functionality.js -> External JavaScript which attatches and handles all listeners,
    handles operations including fetching weather data, parsing and filtering
    for relevant locations from city.list.json based on user input, converting
    to/from measurement metrics, capitalizing/rounding off fetched data.

    city.list.json -> JSON file taken from OpenWeatherAPI containg all the
    locations they provide weather data for.

    img -> Just a folder of images needed for the UI. Two for the background,
    and another folder full of icons for the UI.

How do I set it up and use it?
    You need to be running it in an environment where CORS (Cross-Origin Requests) are supported.
    I used the live server extension in VS Code. Simply click "Go Live" at the bottom right while
    in VS Code in the folder containing all the files and the Live Server extension will handle the rest.

    Using weather fetcher is simple. Just input a location in the format "City, Country"
    ex. "Kitchener, CA" and all relevant locations will be displayed in a pop-up list. Select
    your desired location from the list and weather fetcher handles the rest. If you want to
    convert the measurements, simply click/tap on the button corresponding to your desired
    temperature units.

Why did you make this app?
    I wanted to apply what I learned from my previous two personal projects and
    attempt to learn something new. The two specific things that drove me towards
    this idea was a desire to make something global in scope and to learn how to
    fetch data from a REST API using JavaScript. So, I wrote Weather Fetcher.

What makes this project interesting?
    Well...
        - Query for any location in the world and immediately get up-to-date weather for that
          location.
        - Seamlessly convert measurements to other metrics.
        - Responsive, beautiful UI.
        - Made with love.

What were/are some key challenges?
    Well...
        - The amount of locations OpenWeatherAPI has weather data for is HUGE
          (see city.list.json), and I don't want to cut any of them, I want all of them to
          be accessible. So, as of right now linearly going through and comparing them via
          regex takes a lot of time, especially on mobile even though it is O(n). My goal is
          to implement a more efficient searching algorithm to remedy this. I'm thinking a
          good first step is using a hash map instead of an array - more time and memory
          efficient that way.
          - I found that the truly time-comsuming operation was adding all of the results
            to the resultsTray on the page once the search completed, so I removed the automatic
            searching as the user types, minimizing the amount of results to be displayed at once.

        - Since the API only contains city and country names, there are many duplicates.
          For example, querying Ottawa, USA will result in many results that look the same
          to the user. I'd rather not display the coordinates beside them so I have chosen
          to live with it.
        
        - Keeping the API key a secret when deploying
          - Using middleware hosted on Glitch means I can keep private info private. See more at
            https://github.com/WarssayH/Weather-Fetcher-Node-Express-API

        - The learning! A lot of the things I accomplished in this project were things I
          didn't know how to accomplish beforehand such as fetching data from an API, working
          with JSON, and implementing a search bar.
