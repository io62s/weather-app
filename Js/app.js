const form = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");
const label = document.querySelector(".input-label");
const body = document.querySelector("body");
const forecastBtn = document.querySelector(".btn");
const extendedDiv = document.querySelector(".extended");

const updateUI = data => {
  const { cityDetails, weather, extended } = data;
  const { EnglishName } = cityDetails;
  const {
    WeatherText,
    IsDayTime,
    WeatherIcon,
    Temperature: {
      Metric: { Value }
    }
  } = weather;

  //update details template
  details.innerHTML = `
    <h5 class="my-3">${EnglishName}</h5>
    <div class="my-2">${WeatherText}</div>
    <div class="display-4">
      <span>${Math.floor(Value)}&deg;C</span>
    </div>
  `;

  let extFor = extended.slice(1);
  let output = "";

  extFor.map(day => {
    output += `
      <div class="text-muted temps">
        <div><strong>${new Date(day.Date)
          .toString()
          .substr(0, 10)}</strong></div>
        <div class="icon-small mx-auto text-center">
          <img src="img/icons/${day.Day.Icon}.svg" />
        </div>
        <p>${day.Day.IconPhrase}</p>
        <div class="my-1">
          <span class="max-temp">${Math.floor(
            day.Temperature.Maximum.Value
          )}&deg;c</span>
          <div>

          <span class="min-temp">${Math.floor(
            day.Temperature.Minimum.Value
          )}&deg;c</span>
          </div>
        </div>
        
      </div>
  `;
  });
  extendedDiv.innerHTML = output;

  //remove display: none class from card div
  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }

  if (extendedDiv.classList.contains("open")) {
    extendedDiv.classList.remove("open");
  }

  //update image night or day
  let timeSrc = IsDayTime ? "img/day.svg" : "img/night.svg";

  //change body bg
  const day = "#e6ecf6";
  const night = "#243046";
  IsDayTime
    ? (body.style.backgroundColor = `${day}`)
    : (body.style.backgroundColor = `${night}`);

  //change label color for day or night
  !IsDayTime ? (label.style.color = "white") : (label.style.color = "#151515");

  time.setAttribute("src", timeSrc);

  //update weather icon
  let iconSrc = `img/icons/${WeatherIcon}.svg`;
  icon.setAttribute("src", `${iconSrc}`);
};

const updateCity = async city => {
  const cityDetails = await getCity(city);
  const weather = await getWeather(cityDetails.Key);
  const extended = await extendedForecast(cityDetails.Key);
  return {
    cityDetails,
    weather,
    extended
  };
};

form.addEventListener("submit", e => {
  e.preventDefault();
  //get value of city input
  const city = form.city.value.trim();
  //clear input field
  form.reset();

  //update ui with new city
  updateCity(city)
    .then(data => {
      //console.log(data.extended);

      updateUI(data);
    })
    .catch(error => console.log(error));

  localStorage.setItem("city", city);
});

forecastBtn.addEventListener("click", () => {
  extendedDiv.classList.toggle("open");
});

if (localStorage.getItem("city")) {
  updateCity(localStorage.getItem("city"))
    .then(data => updateUI(data))
    .catch(err => console.log(err));
}
