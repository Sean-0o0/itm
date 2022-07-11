import React from 'react';
import LegendGroup from './LegendGroup';

class LeftBlock extends React.Component {
  render() {
    const {  optIdxStateStat = [] }  = this.props;
    return (
      <div className="flex-c h100">
        <div className=" flex-c wid100 pd10">
          <LegendGroup optIdxStateStat={optIdxStateStat}/>
        </div>
      </div>

    );
  }
}
export default LeftBlock;
