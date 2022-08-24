import React from 'react';
import {Button, DatePicker, Row, Col, Input, Select} from 'antd';
import { connect } from 'dva';
const { RangePicker } = DatePicker;

class OperationList extends React.Component {
    state = {
    };

    handleClick(){
      window.location.href = `/#/pms/manage/WeeklyReportSummary`
    }

    render() {

        const { } = this.props;

        return (
            <Row style={{backgroundColor: 'white', height: '8rem'}}>
              {/*<Col span={10} style={{height:'100%',display:'flex',alignItems: 'center',paddingLeft: '2.5rem'}}>*/}
              {/*<Button*/}
              {/*  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>修改提交*/}
              {/*</Button>*/}
              {/*&nbsp;&nbsp;&nbsp;*/}
              {/*<Button*/}
              {/*  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>删除*/}
              {/*</Button>*/}
              {/*&nbsp;&nbsp;&nbsp;*/}
              {/*<Button*/}
              {/*  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={this.handleClick}>返回*/}
              {/*</Button>*/}
              {/*</Col>*/}
              <Col span={7} style={{height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '2.5rem'}}>
                <div>选择日期&nbsp;&nbsp;<RangePicker/></div>
              </Col>
              <Col span={7} style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'end',
                paddingRight: '3rem'
              }}>
                <Input.Group compact>
                  <Select defaultValue="筛选">
                    <Option value="筛选">筛选</Option>
                    <Option value="筛选">筛选</Option>
                  </Select>
                  <Input.Search allowClear style={{width: '75%'}} defaultValue="项目信息综合管理系统"/>
                </Input.Group>
              </Col>

            </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
