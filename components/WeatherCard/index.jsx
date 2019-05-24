import React from 'react';
import {
  string, arrayOf, object, shape, date,
} from 'prop-types';
import ButtonGroup from '../ButtonGroup';
import Chart from '../Chart';

class WeatherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedButton: 0,
      selectedDay: 0,
      chartData: undefined,
      nowForecast: undefined,
      daysInfo: undefined,
    };
    this.handleButtonSelection = this.handleButtonSelection.bind(this);
    this.handleDaySelection = this.handleDaySelection.bind(this);
    this.changeDay = this.changeDay.bind(this);
    this.getDaysInfo = this.getDaysInfo.bind(this);
    this.handleVal = this.handleVal.bind(this);
  }

  handleDaySelection(selection) {
    this.setState({ selectedDay: selection }, () => this.changeDay());
  }

  handleButtonSelection(selection) {
    this.setState({
      selectedButton: selection,
    });
  }

  componentDidMount() {
    this.changeDay();
    this.getDaysInfo();
  }

  changeDay() {
    const { selectedDay } = this.state;
    const { weekForecast } = this.props;
    const now = new Date();
    const forecast = weekForecast.map(({ data }) => data.forecast.filter(
      d => (selectedDay === 0
        ? new Date(d.utcTime).getHours() >= now.getHours()
              && new Date(d.utcTime).getDate() >= now.getDate()
        : d),
    ));
    const options = { hour: '2-digit' };
    const language = window.navigator.userLanguage || window.navigator.language || 'en-US';

    const tempData = forecast[selectedDay]
      .map((day) => {
        const time = new Date(day.utcTime)
          .toLocaleDateString(language, options)
          .split(', ')[1];
        const { temperature } = day;
        return {
          time,
          temperature: Math.round(temperature),
        };
      })
      .filter((nada, idx) => idx % 2 === 0 && nada !== undefined);
    const precipitationData = forecast[selectedDay]
      .map((day) => {
        const time = new Date(day.utcTime)
          .toLocaleDateString(language, options)
          .split(', ')[1];
        const { precipitationProbability } = day;
        return { time, precipitationProbability };
      })
      .filter((nada, idx) => idx % 2 === 0 && nada !== undefined);

    const windData = forecast[selectedDay]
      .map((day) => {
        const time = new Date(day.utcTime)
          .toLocaleDateString(language, options)
          .split(', ')[1];
        const { windSpeed } = day;
        return { time, windSpeed: Math.round(windSpeed) };
      })
      .filter((nada, idx) => idx % 2 === 0 && nada !== undefined);
    this.setState({
      chartData: [tempData, precipitationData, windData],
      nowForecast: forecast[0][0],
    });
  }

  getDaysInfo() {
    const { weekForecast } = this.props;
    const { selectedDay } = this.state;

    const now = new Date();
    const language = window.navigator.userLanguage || window.navigator.language || 'en-US';

    const forecast = weekForecast
      .map(({ data }) => data.forecast.filter(
        d => new Date(d.utcTime).getHours() >= now.getHours()
            && new Date(d.utcTime).getDate() >= now.getDate(),
      ))
      .map((day) => {
        const maxVal = day.reduce(
          (prev, curr) => (prev.temperature > curr.temperature ? prev : curr),
        );
        const minVal = day.reduce(
          (prev, curr) => (prev.temperature < curr.temperature ? prev : curr),
        );
        return {
          minTemp: Math.round(minVal.temperature),
          maxTemp: Math.round(maxVal.temperature),
          weekday: new Date(maxVal.utcTime).toLocaleString(language, {
            weekday: 'short',
          }),
          icon: maxVal.icon,
        };
      });
    this.setState({ daysInfo: forecast });
  }

  handleVal(val) {
    this.setState({ selectedVal: val });
  }

  render() {
    const { city, region_code } = this.props;

    const {
      selectedButton,
      selectedDay,
      chartData,
      nowForecast,
      daysInfo,
      selectedVal,
    } = this.state;

    if (!nowForecast) {
      return '';
    }

    const {
      weekday,
      utcTime,
      description,
      icon,
      skyDescription,
      temperature,
      precipitationProbability,
      humidity,
      windSpeed,
    } = nowForecast;
    const toLocalTime = new Date(utcTime).toLocaleTimeString();
    return (
      <div className="card">
        <div className="selectedTime">
          <span className="location">{`${city}, ${region_code}`}</span>
          <span className="tempTime">{`${weekday} ${toLocalTime}`}</span>
          <span className="tempDesc">{description}</span>
          <div className="todayInfo">
            <div className="temp">
              <img src={`/static/icons/${icon}.png`} alt={skyDescription} />
              {Math.round(temperature)}
              <sup>&#176;F</sup>
            </div>
            <div className="info">
              <div>{`Precipitation: ${precipitationProbability}%`}</div>
              <div>{`Humidity ${humidity}%`}</div>
              <div>{`Wind Speed: ${Math.round(windSpeed)} mph`}</div>
            </div>
            <div className="graph-selection">
              <ButtonGroup
                currentlySelected={selectedButton}
                handleSelection={this.handleButtonSelection}
              />
            </div>
          </div>
        </div>
        <div className="chartInfo">
          {chartData && (
            <Chart
              data={chartData}
              selectedOption={selectedButton}
              selectedVal={selectedVal}
              handleValChange={this.handleVal}
            />
          )}
        </div>
        <ul className="weekdays">
          {daysInfo.map(({
            weekday: weekdayShort, icon: dayIcon, minTemp, maxTemp,
          }, idx) => (
            <li
              key={weekdayShort}
              className={idx === selectedDay ? 'day selected' : 'day'}
              onClick={() => this.handleDaySelection(idx)}
            >
              {weekdayShort}
              <img src={`/static/icons/${dayIcon}.png`} alt="skyDescription" />
              {`${minTemp}/${maxTemp}`}

            </li>
          ))}
        </ul>
        {/* language=CSS */}
        <style jsx>
          {`
            .card {
              display: flex;
              flex-flow: column nowrap;
              margin: auto;
              width: 100%;
              height: 466px;
              max-width: 640px;
              background: #ffffff;
              padding: 1em;
              border-radius: 0.25em;
              border: 1px solid #dfe1e5;
              box-shadow: 0 0 0.5em 0.25em rgba(0, 0, 0, 0.3);
            }
            .card .cardHeader {
              display: flex;
              justify-content: space-evenly;
              width: fit-content;
              flex-flow: column nowrap;
            }
            .graph-selection {
              position: relative;
              width: 100%;
            }
            .selectedTime {
              display: flex;
              flex-flow: column nowrap;
              position: relative;
              margin: 0.5rem;
              width: auto;
            }
            .todayInfo {
              display: flex;
              flex-flow: row wrap;
              align-items: center;
            }
            .location {
              font-size: x-large;
            }
            .temp {
              display: flex;
              font-size: 3em;
            }
            .temp sup {
              font-size: 1.5rem;
            }
            .temp img {
              margin: auto;
              width: 51px;
              height: 51px;
            }
            .info {
              margin: 0 0 0 10em;
            }
            .chartInfo {
              width: 100%;
              height: 100px;
              margin: 3em 0 0 0;
              overflow: hidden;
            }
            .weekdays {
              list-style: none;
              display: flex;
              flex-flow: row nowrap;
              padding: 0;
              margin: 0;
            }
            .day {
              cursor: pointer;
              border: 0;
              background: #ffffff;
              display: flex;
              justify-content: center;
              flex: 1 0 0;
              flex-flow: column nowrap;
              align-items: center;
            }
            .day.selected {
              background-color: #fcfcfc;
              border: 1px solid #e9e9e9;
              border-radius: 1px;
            }
            .day img {
              width: 51px;
              height: 51px;
              margin: auto;
            }
            .card .title {
            }
          `}
        </style>
      </div>
    );
  }
}
WeatherCard.propTypes = {
  weekForecast: shape({
    description: string.isRequired,
    temperature: string.isRequired,
    temperatureDesc: string.isRequired,
    humidity: string.isRequired,
    precipitationProbability: string.isRequired,
    windSpeed: string.isRequired,
    iconLink: string.isRequired,
    dayOfWeek: string.isRequired,
    weekday: string.isRequired,
    utcTime: string.isRequired,
  }).isRequired,
  city: string.isRequired,
  region_code: string.isRequired,
};
export default WeatherCard;
