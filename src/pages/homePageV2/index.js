import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { withRouter } from 'dva/router';
// import DynamicReminding from '../../components/HomePage/DynamicReminding';
import Notification from '../../components/HomePage/Notification';
import TodoBusiness from '../../components/HomePage/TodoBusiness';
import CommonFunction from '../../components/HomePage/CommonFunction';
class HomePage extends React.Component {
    render() {
        const { dispatch, BaseNewClass } = this.props;

        return (
            <div className='home-index' style={{ height: 'calc(100vh - 10rem)' }}>
                {/* <DynamicReminding /> */}
                {/* 水波球 */}
                <Row style={{ height: '100%', width: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Col xs={24} sm={24} lg={24} xl={12} className='m-main-left' style={{ height: '23%', width: '100%', marginTop: '1rem' }}>
                        {/* <Liquidfill liquidfillDatas={liquidfillDatas} dispatch={dispatch} />
                        */}
                        <div style={{ height: '100%' }}>
                            <TodoBusiness />
                        </div>
                    </Col>
                    {/*<Row style={{ width: '100%', display: 'flex', flexDirection: 'row', height: '2rem' }} />*/}
                    <Row style={{ width: '100%', display: 'flex', flexDirection: 'row', height: '77%',marginTop:'2rem' }}>
                        <Col xs={24} sm={24} lg={24} xl={12} className='m-main-right' style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '60.5%' }}>
                                <div style={{ height: '100%' }}>
                                    {/* 通知公告 */}
                                    <Notification BaseNewClass={BaseNewClass} dispatch={dispatch} />
                                </div>
                            </div>
                            {/*<div style={{ height: '100%', width: '2rem' }} />*/}
                            <div style={{ background: '#F2F2F2', width: '40%' ,marginLeft:'2rem' }}>
                                {/* 常用操作 */}
                                <div style={{ height: '100%', backgroundColor: '#fff', borderRadius: '2rem' }}>
                                    <CommonFunction />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Row>
            </div>
        );
    }
}

export default withRouter(connect(({ homePage }) => ({
    liquidfillDatas: homePage.liquidfillDatas,
    BaseNewClass: homePage.BaseNewClass,
}))(HomePage));

