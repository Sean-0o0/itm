import React from 'react';
import { Button, Input,Select,Row,Col } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
const { Option } = Select;

class ProjectRisk extends React.Component {
  state = {
  };

  render() {

    const { state } = this.props;

    return (
      <div>
        {
          state !== "-1" && <div style={{display: 'flex'}}><i style={{color: 'red'}} className="iconfont icon-warning"/>
            <div style={{color: 'rgba(215, 14, 25, 1)'}}>&nbsp;存在</div>
          </div>
        }
        {
          state === "-1" && <div style={{display: 'flex'}}>
            <div style={{color: 'rgba(48, 49, 51, 1)'}}>&nbsp;暂无</div>
          </div>
        }
      </div>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(ProjectRisk);
