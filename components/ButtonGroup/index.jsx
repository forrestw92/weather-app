import React from 'react';
import {
  number, node, oneOfType, arrayOf, func,
} from 'prop-types';

class ButtonGroup extends React.Component {
  render() {
    const { children, currentlySelected, handleSelection } = this.props;

    return (
      <div className="button-group">
        {['Temperature', 'Precipitation', 'Wind'].map((btnText, idx) => {
          if (idx === currentlySelected) {
            return (
              <button
                key={btnText}
                type="button"
                onClick={() => handleSelection(idx)}
                className="button selected"
              >
                {btnText}
              </button>
            );
          }
          return (
            <button
              key={btnText}
              type="button"
              onClick={() => handleSelection(idx)}
              className="button"
            >
              {btnText}
            </button>
          );
        })}
        {/* language=CSS */}
        <style jsx>
          {`
            .button-group {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              margin: 1em 0 0 0;
              position: absolute;
              right: 6em;
            }
            .button {
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f5f5f5;
              border: 1px solid rgba(0, 0, 0, 0.1);
              color: #444;
              padding: 0.5em;
              flex: 0 0 33%;
            }
            .selected {
              background-color: #eee;
              background-image: -webkit-linear-gradient(top, #eee, #e0e0e0);
              border: 1px solid #ccc;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
              color: #222;
              margin: 0;
            }
          `}
        </style>
      </div>
    );
  }
}
ButtonGroup.defaultProps = {
  children: undefined,
};
ButtonGroup.propTypes = {
  children: oneOfType([arrayOf(node), node, undefined]),
  currentlySelected: number.isRequired,
  handleSelection: func.isRequired,
};
export default ButtonGroup;
