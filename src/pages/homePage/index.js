import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { withRouter } from 'dva/router';
// import DynamicReminding from '../../components/HomePage/DynamicReminding';
import Liquidfill from '../../components/HomePage/Liquidfill';
import CommonOperation from '../../components/HomePage/CommonOperation';
import Notification from '../../components/HomePage/Notification';

class HomePage extends React.Component {
    render() {
        const { liquidfillDatas, dispatch, BaseNewClass } = this.props;

        return (
            <div style={{ height: 'calc(100vh - 10rem)' }}>
                {/* <DynamicReminding /> */}
                {/* 水波球 */}
                <Row className="m-row" style={{ height: '100%' }}>
                    <Col xs={24} sm={24} lg={24} xl={12} className='m-main-left' style={{ height: '100%' }}>
                        <Liquidfill liquidfillDatas={liquidfillDatas} dispatch={dispatch} />
                        <div style={{ height: 'calc(100% - 18rem)' }}>
                            <div style={{ height: '100%', backgroundColor: '#fff' }}>
                                {/* 通知公告 */}
                                <Notification BaseNewClass={BaseNewClass} dispatch={dispatch} />
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} lg={24} xl={12} className='m-main-right' style={{ height: '100%' }}>
                        {/* 常用操作 */}
                        <div style={{ height: 'calc(100% - 1rem)', backgroundColor: '#fff', marginTop: '1rem' }}>
                            <CommonOperation />
                        </div>
                    </Col>

                </Row>

                {/* <Row gutter={18}  style={{ height: '100%' }}>
                    <Col >
                        


                    </Col>
                    
                </Row> */}

            </div>
        );
    }
}

export default withRouter(connect(({ homePage }) => ({
    liquidfillDatas: homePage.liquidfillDatas,
    BaseNewClass: homePage.BaseNewClass,
}))(HomePage));

