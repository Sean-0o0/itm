import React from 'react';
import { connect } from 'dva';
import { Progress, Tooltip } from 'antd';


class Asset extends React.Component {
    state = {

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {


        return (
            <div className="h100 pd10">
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className="card-title title-c">兴证基金</div>
                    </div>
                    <div className="flex-r h30 mt20" style={{justifyContent:"space-around"}}>
                        <div className="pos-r">
                            <Tooltip title="基金行情复核">
                                <Progress type="dashboard" percent={100}
                                    format={() => <div className="blue">16/16<br /><span className="fs16">已完成</span></div>}
                                    strokeColor="#00ACFF" />
                            </Tooltip>
                            <div className="pos-a pgs-pos">
                                估值核算
                            </div>
                        </div>
                        <div className="pos-r">
                            <Tooltip title="基金行情复核">
                                <Progress type="dashboard" percent={25}
                                    format={() => <div className="orange">4/16<br /><span className="fs16">进行中</span></div>}
                                    strokeColor="#F7B432" />
                            </Tooltip>
                            <div className="pos-a pgs-pos">
                                登记注册
                            </div>
                        </div>
                    </div>
                    <div className="flex-r h30" style={{justifyContent:"space-around"}}>
                        <div className="pos-r">
                            <Tooltip title="基金行情复核">
                                <Progress type="dashboard" percent={0}
                                    format={() => <div className="grey">0/16<br /><span className="fs16">未开始</span></div>}
                                    strokeColor="#383F5F" />
                            </Tooltip>
                            <div className="pos-a pgs-pos">
                                资金清算
                            </div>
                        </div>
                        <div className="pos-r">
                            <Tooltip title="基金行情复核">
                                <Progress type="dashboard" percent={25}
                                    format={() => <div className="red">4/16<br /><span className="fs16">异常</span></div>}
                                    strokeColor="#E23C39" />
                            </Tooltip>
                            <div className="pos-a pgs-pos">
                                投资交易<br/>清算
                            </div>
                        </div>
                    </div>
                    <div className="flex1 flex-r">
                        <div className="flex-c flex1 sec-pos">
                             <div className="fs18" >
                                <span style={{float:"left"}}>FA指标监控</span>
                                <span style={{float:"right"}}><span className="fs24" style={{fontWeight:"bold"}}>20</span>/27</span>
                            </div>
                            <div className="flex-r" style={{height:".4rem",borderRadius:"2px"}}>
                                <div style={{width:"70%",backgroundColor:"#157EF4",display:"inline",borderRadius:"2px 0px 0px 2px"}}></div>
                                <div style={{width:"30%",backgroundColor:"#383F5F",display:"inline",borderRadius:"0px 2px 2px 0px"}}></div>
                            </div>
                            <div className="flex-r" style={{height:"1.2rem",borderRadius:"2px",margin:".5rem 0"}}>
                                <div style={{width:"40%",backgroundColor:"#157EF4",display:"inline",borderRadius:"6px 0px 0px 6px"}}></div>
                                <div style={{width:"20%",backgroundColor:"#E23C39",display:"inline"}}></div>
                                <div style={{width:"10%",backgroundColor:"#F7B432",display:"inline"}}></div>
                                <div style={{width:"30%",backgroundColor:"#383F5F",display:"inline",borderRadius:"0px 6px 6px 0px"}}></div>
                            </div>
                            <div className="fs18">
                                <span className="blue">正常:17</span>/<span className="red">异常:1</span>/<span className="orange">手工确认:2</span><br/><span className="grey">未完成:7</span>
                            </div>
                        </div>
                        <div className="flex-c flex1 sec-pos">
                             <div className="fs18" >
                                <span style={{float:"left"}}>TA指标监控</span>
                                <span style={{float:"right"}}><span className="fs24" style={{fontWeight:"bold"}}>20</span>/27</span>
                            </div>
                            <div className="flex-r" style={{height:".4rem",borderRadius:"2px"}}>
                                <div style={{width:"70%",backgroundColor:"#157EF4",display:"inline",borderRadius:"2px 0px 0px 2px"}}></div>
                                <div style={{width:"30%",backgroundColor:"#383F5F",display:"inline",borderRadius:"0px 2px 2px 0px"}}></div>
                            </div>
                            <div className="flex-r" style={{height:"1.2rem",borderRadius:"2px",margin:".5rem 0"}}>
                                <div style={{width:"40%",backgroundColor:"#157EF4",display:"inline",borderRadius:"6px 0px 0px 6px"}}></div>
                                <div style={{width:"20%",backgroundColor:"#E23C39",display:"inline"}}></div>
                                <div style={{width:"10%",backgroundColor:"#F7B432",display:"inline"}}></div>
                                <div style={{width:"30%",backgroundColor:"#383F5F",display:"inline",borderRadius:"0px 6px 6px 0px"}}></div>
                            </div>
                            <div className="fs18">
                                <span className="blue">正常:17</span>/<span className="red">异常:1</span>/<span className="orange">手工确认:2</span><br/><span className="grey">未完成:7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(Asset);
