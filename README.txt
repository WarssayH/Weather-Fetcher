What is this repo?
    This is a web app that fetches and displays weather data from OpenWeatherAPI
    for a requested location. It also can convert measurements to other metrics
    such as imperial if you don't want your weather in metric.

A run-down of this repo please?
    Glad you asked...
        index.html -> HTML (HyperText Markup Language) code for the app. Contains
        default values in case the weather isn't fetched which are NOT accurate.
        Just there to show the UI

        style.css -> External CSS (Cascading StyleSheets) file which handles all
        styling and responsiveness

        functionality.js -> External JS file which attatches and handles all listeners,
        handles logical operations such as fetching weather data, parsing and filtering
        for relevant locations from city.list.json based on user input, converting
        to/from measurement metrics, capitalizing/rounding off fetched data.

        city.list.json -> JSON file taken from OpenWeatherAPI containg all the
        locations they provide weather data for

        img -> Just a folder of images needed for the UI. Two for the background,
        and another folder full of icons for the UI.

How do I set it up and use it?
    Weather fetcher uses the Fetch API, so you need to be running it in an environment where
    CORS (Cross-Origin Requests) are supported. I used the live server extension in VS Code.
    Simply click "Go Live" at the bottom right while in VS Code in the folder containing all
    the files and the Live Server extension will handle the rest.

    Using weather fetcher is simple. Just input a location in the format "city, country"
    and all relevant locations will be displayed in a pop-up list select your desired location
    from the list and weather fetcher handles the rest. If you want to convert the measurements,
    simply click/tap on the button corresponding to your desired temperature metric.

Why did you make this app?
    I wanted to apply what I learned from my previous two personal projects and
    attempt to learn something new. The two specific things that drove me towards
    this specific concept was a desire to make something global in scope and to
    learn how to fetch data from an API using JavaScript. So, I wrote Weather Fetcher.

What makes this project interesting?
    Well...
        - Pick any location in the world and immediately get up-to-date weather for that
          location
        - Seamlessly convert measurements to other metrics
        - Responsive, beautiful UI
        - Made with love

What were/are some key challenges?
    Well...
        - The amount of locations OpenWeatherAPI has weather data for is HUGE
          (see city.list.json), and I don't want to cut any of them, I want all of them to
          be accessible. So, as of right now linearly going through and comparing them via
          regex takes a lot of time, especially on mobile even though it is O(n). My goal is
          to implement a more efficient searching algorithm to remedy this. I'm thinking a
          good first step is using a hash map instead of an array - more time and memory
          efficient that way
        - Since the API only contains city and country names, there are many duplicates.
          For example, querying Ottawa, USA will result in many results that look the same
          to the user. I'd rather not display the coordinates beside them so I would either
          have to:
            a) Leave it like this
            b) Remove duplicates, but this would be either extremely time-consuming if done
               manually or lead to very important locations being removed
            c) Use a different API
        - The learning! A lot of the things I accomplished in this project were things I had
          no idea how to even begin doing such as fetching data from an API, working with
          JSON, and impementing a search bar.