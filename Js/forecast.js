const key = "uDhBVkMPB3YXF1uz1Fp04sY5627VlBRq";
//let state = {};

//get current weather info
const getWeather = async cityCode => {
  const base = "http://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${cityCode}?apikey=${key}`;

  const response = await fetch(`${base}${query}`);
  const data = await response.json();

  return data[0];
};

//get city info
const getCity = async city => {
  const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${key}&q=${city}`;

  const response = await fetch(`${base}${query}`);
  const data = await response.json();
  //console.log(data[0].Key);

  return data[0];
};
