import React from 'react';
import { Button, Input,Select,Row,Col } from 'antd';
import { connect } from 'dva';
const { Option } = Select;

class OperationList extends React.Component {
    state = {
    };

    render() {

        const { } = this.props;

        return (
            <Row style={{backgroundColor: 'white',height:'100%'}}>
              <Col span={12} style={{height:'100%',display:'flex',alignItems: 'center',paddingLeft: '2.5rem'}}>
                <Button
                        className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>里程碑调整</Button>
              </Col>
              <Col span={12} style={{height:'100%',display:'flex',alignItems: 'center',textAlign:'end',paddingRight: '3rem'}}>
                <Input.Group compact>
                  <Select defaultValue="筛选">
                    <Option value="筛选">筛选</Option>
                    <Option value="筛选">筛选</Option>
                  </Select>
                  <Input.Search allowClear style={{ width: '40%' }} defaultValue="项目信息综合管理系统" />
                </Input.Group>
              </Col>

            </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
