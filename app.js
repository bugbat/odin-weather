//api info
const apiKey = "R4HTPHF2RC7SHGLWH7MVEZDBU";

//dom elements
const searchform = document.querySelector("form")
const searchbox = document.querySelector("#citylookup");
const searchbutton = document.querySelector("#search");

//default data. figure out local storage to keep this
let searchTerm = "arlington";
getWeather(searchTerm);

searchform.addEventListener("submit", function(event) {
  event.preventDefault();
  searchTerm = searchbox.value;
  if (searchTerm) {
    hideError();
    getWeather(searchTerm);
  }
  else {
    showError("Please enter a city")
  }
})

async function getWeather(searchTerm) {
  try {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
      + searchTerm + "?unitGroup=us&key=" + apiKey + "&contentType=json", {
      mode: "cors"});
      const data = await response.json();
      updatePage(data);
  }
  catch {
    showError("Please try another search");
  }
}

function updatePage(data) {
  console.log(data);
  //set weather variables
  const [city, state, country] = data.resolvedAddress.split(",");
  const temp = data.currentConditions.temp;
  const precipProb = data.currentConditions.precipprob;
  const dayDescription = data.description;
  const iconData = data.currentConditions.icon;
  const weatherIcon = getWeatherEmoji(iconData);
  
  //set up header
  const weatherheader = document.querySelector("#weatherheader");
  clearElement(weatherheader);

  const location = document.createElement("h1");
  const icon = document.createElement("h1");

  location.textContent = `${city}, ${state}`;
  icon.textContent = weatherIcon;

  weatherheader.append(location, icon);

  //set up content
  const weathercontent = document.querySelector("#weathercontent");
  clearElement(weathercontent);
  
  const temperature = document.createElement("p");
  const precipitation = document.createElement("p");
  const condition = document.createElement("p");

  condition.classList.add("smallitalic");

  condition.textContent = dayDescription;
  temperature.textContent = temp + "° F";
  precipitation.textContent = precipProb + "% chance of rain";

  weathercontent.append(temperature, precipitation, condition);
}

function getWeatherEmoji(condition) {
  switch (true) {
    case (condition === "snow"):
      return "🌧️";
    case (condition === "rain"):
      return "🌧️";
    case (condition === "fog"):
      return "🌫️";
    case (condition === "wind"):
      return "🍃";
    case (condition === "cloudy"):
      return "☁️";
    case (condition === "partly-cloudy-day"):
      return "🌤️";
    case (condition === "partly-cloudy-night"):
      return "🌥️";
      case (condition === "clear-day"):
        return "☀️";
    case (condition === "clear-night"):
      return "🌙";
    default:
      return "❓";
  }
}

function clearElement(element) {
  while(element.firstChild) { 
    element.removeChild(element.firstChild);
  }
}

function showError(message) {
  const errorbox = document.querySelector("#error");
  const errormessage = document.createElement("p");
  clearElement(errorbox);

  errormessage.textContent = message;
  errorbox.appendChild(errormessage);
  errorbox.style.display = "flex";
}

function hideError() {
  const errorbox = document.querySelector("#error");
  clearElement(errorbox);
  errorbox.style.display = "none";
}