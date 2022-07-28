import React from 'react';
import { Button, Input,Select,Row,Col } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
const { Option } = Select;

class OperationList extends React.Component {
    state = {
    };

    render() {

        const { } = this.props;

        return (
            <Row style={{backgroundColor: 'white',height:'8rem'}}>
              <Col span={20} style={{height:'100%',display:'flex',alignItems: 'center',paddingLeft: '2.5rem',fontSize:'14px'}}>
                <Input.Group compact>
                  <Select defaultValue="筛选">
                    <Option value="筛选">筛选</Option>
                    <Option value="筛选">筛选</Option>
                  </Select>
                  <Input.Search allowClear style={{ width: '20%',fontSize:'14px' }} defaultValue="项目信息综合管理系统" />
                </Input.Group>
              </Col>
              <Col span={4} style={{height:'100%',display:'flex',alignItems: 'center',textAlign:'end',fontSize:'14px'}}>
                <img src={icon_flag} alt="" style={{width:'2rem',height:'2rem'}}/>
                &nbsp;<span style={{color:'rgba(144, 147, 153, 1)'}}>当前处于：<span style={{color:'rgba(48, 49, 51, 1)'}}>项目立项阶段</span></span>
              </Col>

            </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
