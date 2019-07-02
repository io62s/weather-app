const form = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");

const updateUI = data => {
  const { cityDetails, weather } = data;
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

  //remove display: none class from card div
  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }

  //update image night or day
  let timeSrc = IsDayTime ? "img/day.svg" : "img/night.svg";

  time.setAttribute("src", timeSrc);

  //update weather icon
  let iconSrc = `img/icons/${WeatherIcon}.svg`;
  icon.setAttribute("src", `${iconSrc}`);
};

const updateCity = async city => {
  const cityDetails = await getCity(city);
  const weather = await getWeather(cityDetails.Key);

  return {
    cityDetails,
    weather
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
      console.log(data);

      updateUI(data);
    })
    .catch(error => console.log(error));
});
