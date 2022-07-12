import React from 'react';
import { Button, DatePicker,Row,Col } from 'antd';
import { connect } from 'dva';
const { RangePicker } = DatePicker;

class OperationList extends React.Component {
    state = {
    };

    render() {

        const { } = this.props;

        return (
            <Row style={{backgroundColor: 'white',height:'100%'}}>
              <Col span={16} style={{height:'100%',display:'flex',alignItems: 'center',paddingLeft: '2.5rem'}}>
                <Button
                  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>修改提交
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                  className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>删除
                </Button>
              </Col>
              <Col span={8} style={{height:'100%',display:'flex',alignItems: 'center',paddingRight: '3rem'}}>
                <div>选择日期&nbsp;&nbsp;<RangePicker /></div>
              </Col>

            </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
