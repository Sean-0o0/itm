import React from 'react';
import { Button, Input,Select,Row,Col } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
const { Option } = Select;

class OperationList extends React.Component {
  state = {};

  onChange = (value) => {
    console.log(`selected ${value}`);
  };

  onSearch = (value) => {
    console.log('search:', value);
  };

  render() {

    const {} = this.props;

    return (
      <Row style={{backgroundColor: 'white', height: '8rem'}}>
        <Col span={20}
             style={{height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '2.5rem', fontSize: '14px'}}>
          <Input.Group compact>
            <Select defaultValue="筛选">
              <Option value="信息管理系统">项目信息综合管理系统</Option>
              <Option value="信息管理系统">信息管理系统</Option>
            </Select>
            <Select
              style={{width: '30rem'}}
              showSearch
              placeholder="请输入项目名称"
              optionFilterProp="children"
              defaultValue='项目信息综合管理系统'
              onChange={this.onChange}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                (option.props.children)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="企划平台">企划平台</Option>
              <Option value="项目信息综合管理系统">项目信息综合管理系统</Option>
              <Option value="信息管理系统">信息管理系统</Option>
            </Select>
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
