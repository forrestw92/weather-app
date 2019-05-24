const Weather = require("here-weather");

const weather = new Weather();

function setSettingsFromQuery(query) {
  weather.oneobservation(undefined);
  weather.metric(true);
  weather.language(undefined);
  weather.hourlydate(undefined);
  const { oneobservation, metric, language, hourlydate } = query;
  if (oneobservation !== undefined) {
    weather.oneobservation(oneobservation);
  }
  if (metric !== undefined) {
    weather.metric(metric);
  }
  if (language !== undefined) {
    weather.language(language);
  }
  if (hourlydate !== undefined) {
    weather.hourlydate(hourlydate);
  }
}
function getLocationFromQuery(query) {
  const { name, latitude, longitude, zipcode } = query;
  if (name !== undefined) {
    return { name };
  }
  if (latitude !== undefined && longitude !== undefined) {
    return { latitude, longitude };
  }
  if (zipcode !== undefined) {
    return { zipcode };
  }
  return {};
}

module.exports = {
  getLocationFromQuery,
  setSettingsFromQuery,
  weather
};
