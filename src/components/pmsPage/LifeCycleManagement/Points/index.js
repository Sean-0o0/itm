import React from 'react';
import {Button, Input, Select, Row, Col, Tooltip} from 'antd';
import {connect} from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';

const {Option} = Select;

class Points extends React.Component {
  state = {};

  render() {

    const {status} = this.props;

    return (
      <div>
        {
          status !== " " && <div className='cont-row-point' style={{borderColor: 'rgba(51, 97, 255, 1)', backgroundColor: 'rgba(51, 97, 255, 1)'}}/>
        }
        {
          status === " " &&
          <div className='cont-row-point' style={{borderColor: 'rgba(192, 196, 204, 1)'}}/>
        }
      </div>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(Points);
