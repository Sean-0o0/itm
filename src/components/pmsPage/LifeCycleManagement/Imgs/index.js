import React from 'react';
import {Button, Input, Select, Row, Col, Tooltip} from 'antd';
import {connect} from 'dva';
import icon_normal from '../../../../image/pms/icon_milepost_normal.png';
import icon_wrong from '../../../../image/pms/icon_milepost_wrong.png';
import icon_waiting from '../../../../image/pms/icon_milepost_waiting.png';

const {Option} = Select;

class Imgs extends React.Component {
  state = {};

  render() {

    const {status} = this.props;

    return (
      <div>
        {
          status === "4" &&
          <img src={icon_wrong} alt="" className='head-img'/>
        }
        {
          status === "2" &&
          <img src={icon_normal} alt="" className='head-img'/>
        }
        {
          status === "3" &&
          <img src={icon_normal} alt="" className='head-img'/>
        }
        {
          status === "1" &&
          <img src={icon_waiting} alt="" className='head-img'/>
        }
      </div>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(Imgs);
