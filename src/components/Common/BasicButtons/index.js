import React from 'react';
import Button from './Button';

class Buttons extends React.Component {
  render() {
    const { buttons, dispatch } = this.props;
    return (
      <div className="btn-list-header" style={{ textAlign: 'left' }}>
        {buttons.map((item) => {
          return <Button dispatch={dispatch} {...item} />;
        })}
      </div>
    );
  }
}

export default Buttons;
