import React from 'react';
import { Col, } from 'antd';
import ReactEcharts from "echarts-for-react"
class AssessmentTrackingChart extends React.Component {
    state = {
    };

    componentDidMount() {
    }
    render() {
        const { width, height, span, option, haedParam } = this.props;
        return (
            <div>
                <Col span={span} style={{ backgroundColor: 'white', marginTop: '1rem' }} >
                    {haedParam &&
                        <div >
                            <div className='ass' style={{ lineHeight: '2rem', fontSize: '1.1rem', fontWeight: '600', color: 'black', width: width, marginBottom: '-3rem' }}>
                                <span style={{ fontSize: '1.4rem' }}>当月完成/累计完成：<span style={{ color: '#00B2EE' }}>{haedParam.INDI_VAL}/{haedParam.TOTL_VAL}</span></span><br />
                                {/* <span style={{ fontSize: '1.4rem', color: '#00B2EE', marginTop: '0.5rem' }}>{haedParam.COMP_SECHED}</span> <br /> */}
                            年度分解目标：<span style={{ color: '#00B2EE' }}>{haedParam.BREAK_GOAL}</span>
                                <div style={{ float: 'right', display: 'inline-block', marginRight: '3rem', position: 'relative' }}>
                                    累计完成
                            <div className='bluerot' />
                                </div>
                                <br />
                            达成目标：<span style={{ color: '#00B2EE' }}>{haedParam.COMP_SECHED}</span>
                                <div style={{ float: 'right', display: 'inline-block', marginRight: '3rem', position: 'relative' }}>
                                    当月完成
                            <div className='redrot' />
                                </div><br />
                            </div>
                        </div>}
                    <ReactEcharts
                        option={option}
                        style={{ height: height, width: width, margin: '0 auto', }}
                    />
                </Col>

            </div>
        );
    }
}
export default AssessmentTrackingChart;
