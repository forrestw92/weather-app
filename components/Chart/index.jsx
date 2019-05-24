import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  number, arrayOf, array, func,
} from 'prop-types';

const CustomizedLabel = () => ({
  getType(type) {
    if (type === 0) {
      return '°';
    }
    if (type === 1) {
      return '%';
    }
    return 'mph';
  },
  fixPosition(x, index) {
    const { length } = this.props;
    if (index === 0) {
      return x + 15;
    }
    if (index === length - 1) {
      return x - 15;
    }
    return x;
  },

  render() {
    const {
      x,
      y,
      value,
      index,
      selectedOption,
      selectedVal,
      handleValChange,
    } = this.props;
    return (
      <text
        x={this.fixPosition(x, index)}
        y={y}
        dy={-4}
        cursor="pointer"
        width="20px"
        fontSize="14"
        fill={selectedVal === index ? 'rgb(85, 85, 85)' : 'rgb(181, 181, 181)'}
        textAnchor="middle"
        onClick={() => handleValChange(index)}
      >
        {value}
        {this.getType(selectedOption)}
      </text>
    );
  },
});
class Chart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      length: props.data[props.selectedOption].length,
    };
  }

  render() {
    const {
      data, selectedOption, selectedVal, handleValChange,
    } = this.props;
    const { length } = this.state;
    const chartData = data[selectedOption];
    const maxVal = Math.max(
      ...chartData.map(obj => obj[Object.keys(chartData[0])[1]]),
      0,
    );

    return (
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis hide domain={[0, maxVal + 50]} />
          <Area
            type="monotone"
            dataKey={Object.keys(chartData[0])[1].toString()}
            label={(
              <CustomizedLabel
                selectedOption={selectedOption}
                length={length}
                handleValChange={handleValChange}
                selectedVal={selectedVal}
              />
)}
            stroke="#ffcc00"
            fill="#fff5d6"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
Chart.propTypes = {
  data: arrayOf(array).isRequired,
  selectedOption: number.isRequired,
  selectedVal: number.isRequired,
  handleValChange: func.isRequired,
};
export default Chart;
