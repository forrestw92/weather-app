import React from 'react';
import axios from 'axios';
import {
  arrayOf, object, number, string,
} from 'prop-types';
import Head from '../components/Head';
import WeatherCard from '../components/WeatherCard';

const partlyCloudNames = [
  'scattered_clouds',
  'partly_cloudy',
  'a_mixture_of_sun_and_clouds',
  'increasing_cloudiness',
  'afternoon_clouds',
  'morning_clouds',
  'decreasing_cloudiness',
  'passing_clounds',
  'clearing_skies',
];

const sunnyNames = [
  'sunny',
  'clear',
  'mostly_sunny',
  'mostly_clear',
  'breaks_of_sun_late',
  'partly_sunny',
  'hazy_sunshine',
];

const cloudyNames = [
  'more_sun_than_clouds',
  'high_level_clouds',
  'high_clouds',
  'broken_clouds',
  'more_clouds_than_sun',
  'cloudy',
  'overcast',
  'mostly_cloudy',
  'low_clouds',
];

const snowNames = [
  'snow_changing_to_rain',
  'snow_changing_to_an_icy_mix',
  'an_icy_mix_changing_to_snow',
  'an_icy_mix_changing_to_rain',
  'rain_changing_to_snow',
  'rain_changing_to_an_icy_mix',
  'light_icy_mix_early',
  'icy_mix_early',
  'light_icy_mix_late',
  'icy_mix_late',
  'snow_rain_mix',
  'scattered_flurries',
  'snow_flurries',
  'light_snow_showers',
  'snow_showers',
  'light_snow',
  'flurries_early',
  'snow_showers_early',
  'light_snow_early',
  'flurries_late',
  'snow_showers_late',
  'light_snow_late',
  'snow',
  'moderate_snow',
  'snow_early',
  'snow_late',
  'heavy_snow',
  'heavy_snow_early',
  'heavy_snow_late',
  'snowstorm',
  'blizzard',
  'sleet',
  'light_mixtures_of_precip',
  'icy_mix',
  'mixture_of_precip',
  'heavy_mixture_of_precip',
  'light_freezing_rain',
  'freezing_rain',
];

const rainNames = [
  'flash_floods',
  'flood',
  'drizzle',
  'sprinkles',
  'sprinkles_early',
  'sprinkles_late',
  'tornado',
  'tropical_storm',
  'hurricane',
  'hail',
  'rain_early',
  'heavy_rain_early',
  'strong_thunderstorms',
  'severe_thunderstorms',
  'thundershowers',
  'thunderstorms',
  'tstorms_early',
  'isolated_tstorms_late',
  'scattered_tstorms_late',
  'tstorms_late',
  'tstorms',
  'rain_showers',
  'showers',
  'widely_scattered_tstorms',
  'isolated_tstorms',
  'a_few_tstrorms',
  'scattered_tstorms',
  'heavy_rain',
  'lots_of_rain',
  'tons_of_rain',
  'heavy_rain_early',
  'heavy_rain_late',
  'light_rain',
  'light_rain_early',
  'light_rain_late',
  'rain',
  'numerous_showers',
  'showery',
  'showers_early',
  'rain_early',
  'showers_late',
  'rain_late',
  'scattered_showers',
  'a_few_showers',
  'light_showers',
  'passing_showers',
  'a_few_tstorms',
];

const fogNames = [
  'ice_fog',
  'early_fog_followed_by_sunny_skies',
  'early_fog',
  'light_fog',
  'fog',
  'dense_fog',
  'haze',
  'smoke',
  'low_level-haze',
  'night_haze',
  'night_smoke',
  'night_low_level_haze',
];

class Home extends React.PureComponent {
  static async getInitialProps() {
    try {
      const { data } = await axios.get('http://localhost:3000/api/ip2location');
      const {
        latitude, longitude, city, region_code,
      } = data;
      const { data: forecastInfo } = await axios.get(
        `http://localhost:3000/api/simple?latitude=${latitude}&longitude=${longitude}`,
      );

      const { forecast } = forecastInfo;
      return {
        latitude,
        longitude,
        city,
        region_code,
        forecast,
      };
    } catch (error) {
      return { error: 'ERROR_IP_LOCATION' };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      latitude: props.latitude,
      longitude: props.longitude,
      city: props.city,
      region_code: props.region_code,
      error: props.error,
      selectedDay: props.forecast[0],
      weekForecast: undefined,
      sevenDays: new Array(7)
        .fill(0)
        .map((nada, idx) => {
          const today = new Date();
          if (idx >= 1) {
            today.setHours(24 * idx, 0, 0, 0);
          }
          return today;
        }),
    };
    this.setLocation = this.setLocation.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.requestLocation = this.requestLocation.bind(this);
    this.generateBackground = this.generateBackground.bind(this);
    this.bgColors = this.bgColors.bind(this);
    this.getSevenDayForecast = this.getSevenDayForecast.bind(this);
  }

  async componentDidMount() {
    try {
      await this.getSevenDayForecast();
    } catch (error) {
      this.setState({ error: 'Error Getting 7 Day Forecast' });
    }
  }

  async getSevenDayForecast() {
    try {
      const { latitude, longitude, sevenDays } = this.state;

      const promises = sevenDays.map(date => axios.get(
        `/api/hourly?latitude=${latitude}&longitude=${longitude}&metric=false&hourlydate=${date.toISOString().substr(0, 10)}`,
      ));
      const resolvedPromises = await Promise.all([...promises]);

      this.setState({ weekForecast: resolvedPromises });
    } catch (error) {
      this.setState({ error: 'Error getting 7 day forecast.' });
    }
  }

  setLocation(position) {
    const { latitude, longitude } = position.coords;
    this.setState({ latitude, longitude });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation);
    }
  }

  async getWeather() {
    const { latitude, longitude } = this.state;
    try {
      const { data } = await axios.get(
        `/api/simple?latitude=${latitude}&longitude=${longitude}&metric=true`,
      );
      const { forecast } = data;
      return forecast;
    } catch (error) {
      return error;
    }
  }

  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation);
    }
  }

  bgColors(start, end) {
    if (!end) {
      return `background:${start};`;
    }
    return `
    background:${start};
    background:linear-gradient(to right, ${start}, ${end});
    background:-webkit-linear-gradient(to right, ${start}, ${end});
    `;
  }

  generateBackground() {
    const { selectedDay } = this.state;
    const { iconName } = selectedDay;
    if (partlyCloudNames.indexOf(iconName) > -1) {
      return this.bgColors('#DAE2F8', '#D6A4A4');
    }
    if (cloudyNames.indexOf(iconName) > -1) {
      return this.bgColors('#ECE9E6', '#FFFFFF');
    }
    if (sunnyNames.indexOf(iconName) > -1) {
      return this.bgColors('#FF4E50', '#F9D423');
    }

    if (fogNames.indexOf(iconName) > -1) {
      return this.bgColors('#757F9A', '#D7DDE8');
    }
    if (snowNames.indexOf(iconName) > -1) {
      return this.bgColors('#E6DADA', '#274046');
    }
    if (rainNames.indexOf(iconName) > -1) {
      return this.bgColors('#616161', '#9BC5C3');
    }
    return this.bgColors('#FFFFFF');
  }

  render() {
    const {
      city, region_code, graphData, weekForecast,
    } = this.state;
    return (
      <React.Fragment>
        <Head title={`${city}, ${region_code} weather.`} />

        <div className="container">
          {weekForecast && (
            <WeatherCard
              city={city}
              chartData={graphData}
              region_code={region_code}
              weekForecast={weekForecast}
            />
          )}

        </div>

        {/* language=CSS */}
        <style global jsx>
          {`
            html,
            body {
              height: 100%;
              width: 100%;
              padding: 0;
              margin: 0;
              font-family: "Roboto Mono", monospace;
              font-size: 16px;
            }
            #__next {
              height: 100%;
              width: 100%;
            }
            .container {
              display: flex;
              height: 100%;
              width: 100%;
              ${this.generateBackground()};
              transition: all 0.4s ease;
            }
          `}
        </style>
      </React.Fragment>
    );
  }
}
Home.defaultProps = {
  error: undefined,
  latitude: 30.2672,
  longitude: -97.7431,
  city: 'Austin',
  region_code: 'TX',
  forecast: undefined,
};
Home.propTypes = {
  latitude: number,
  longitude: number,
  city: string,
  region_code: string,
  error: string,
  forecast: arrayOf(object),
};
export default Home;
