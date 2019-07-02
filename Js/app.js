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
    <div class="my-3">${WeatherText}</div>
    <div class="display-4 my-4">
      <span>${Value}</span>
      <span>&deg;C</span>
    </div>
  `;

  let extFor = extended.slice(1);
  let output = "";

  extFor.map(day => {
    output += `
      <div class="text-muted">
        <div><strong>${new Date(day.Date)
          .toString()
          .substr(0, 10)}</strong></div>
        <div class="icon-small mx-auto text-center">
          <img src="img/icons/${day.Day.Icon}.svg" />
        </div>
        <p>${day.Day.IconPhrase}</p>
        <div class="my-1">
          <span>min: <strong>${
            day.Temperature.Minimum.Value
          }&deg;C</strong></span>
        </div>
        <div class=" my-1">
          <span>max: <strong>${
            day.Temperature.Maximum.Value
          }&deg;C</strong> </span>
        </div>
      </div>
  `;

    extendedDiv.innerHTML = output;
  });

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
  const day = "#e0ebf0";
  const night = "#383650";
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
      console.log(data.extended);

      updateUI(data);
    })
    .catch(error => console.log(error));
});

forecastBtn.addEventListener("click", () => {
  extendedDiv.classList.toggle("open");
});
