import React from 'react';
import { Select, Col, Row } from 'antd';

class AssessmentTracking extends React.Component {
    state = {
        BussinessArray: [],
    };

    componentDidMount() {
    }
    render() {
        const { headParam:{orgName='',yr='2020'} } = this.props
        return (
            <div className='dp-header clearfix'>
                {/* height: '4rem',lineHeight: '4rem',color: '#333', fontSize: '1.333rem', fontWeight: 'bold', border-bottom: '1px solid #e8e8e8' */}
                <div style={{ height: '4rem', marginLeft: '0.5rem', lineHeight: '4rem', color: '#333', fontSize: '1.444rem', fontWeight: 'bold', borderBottom: '1px solid #e8e8e8', }}>适用业务条线：{orgName}&nbsp;&nbsp;
                <div style={{ display: 'inline-block', marginLeft: '2rem' }}>年度:&nbsp;&nbsp;<span>{yr}</span></div>
                </div>

            </div>
        );
    }

    // componentWillMount() {
    //     let BussinessArray = ['投资银行', '金融服务']
    //     this.setState(
    //         {
    //             BussinessArray: BussinessArray
    //         }
    //     )
    // }
    // render() {
    //     const option = {
    //         title: {
    //             text: '折线图堆叠'
    //         },
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         legend: {
    //             data: ['净收入', '净利率', '回购规模', '新业务收入']
    //         },
    //         grid: {
    //             left: '3%',
    //             right: '4%',
    //             bottom: '3%',
    //             containLabel: true
    //         },
    //         toolbox: {
    //             feature: {
    //                 saveAsImage: {}
    //             }
    //         },
    //         xAxis: {
    //             type: 'category',
    //             boundaryGap: false,
    //             data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    //         },
    //         yAxis: {
    //             type: 'value'
    //         },
    //         series: [
    //             {
    //                 name: '净收入',
    //                 type: 'line',
    //                 stack: '总量',
    //                 data: [120, 132, 101, 134, 90, 230, 210]
    //             },
    //             {
    //                 name: '净利率',
    //                 type: 'line',
    //                 stack: '总量',
    //                 data: [220, 182, 191, 234, 290, 330, 310]
    //             },
    //             {
    //                 name: '回购规模',
    //                 type: 'line',
    //                 stack: '总量',
    //                 data: [150, 232, 201, 154, 190, 330, 410]
    //             },
    //             {
    //                 name: '新业务收入',
    //                 type: 'line',
    //                 stack: '总量',
    //                 data: [320, 332, 301, 334, 390, 330, 320]
    //             },
    //             // {
    //             //     name: '搜索引擎',
    //             //     type: 'line',
    //             //     stack: '总量',
    //             //     data: [820, 932, 901, 934, 1290, 1330, 1320]
    //             // }
    //         ]
    //     };
    //     return (
    //         <div>
    //             <div className='dp-header clearfix'>
    //                 {/* height: '4rem',lineHeight: '4rem',color: '#333', fontSize: '1.333rem', fontWeight: 'bold', border-bottom: '1px solid #e8e8e8' */}
    //                 <div style={{ height: '4rem', lineHeight: '4rem', color: '#333', fontSize: '1.333rem', fontWeight: 'bold', borderBottom: '1px solid #e8e8e8', }}>适用业务条线:&nbsp;&nbsp;
    //             <Select defaultValue="投资银行" style={{ width: '10rem' }} onChange={this.handleChange}>
    //                         {this.state.BussinessArray.map((item, index) => {
    //                             return <Select.Option key={item} value={item} >{item}</Select.Option>;
    //                         })}
    //                     </Select>
    //                     <div style={{ display: 'inline' }}>年度:&nbsp;&nbsp;<span>2021</span></div>
    //                 </div>

    //             </div>

    //             <Col span={12} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
    //                 <div style={{ position: 'relative', height: '40px', lineHeight: '40px', fontWeight: '900' }}><span style={{ width: '6px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />投资银行目标完成进度</div>
    //                 {/* <div>投资银行目标完成进度<i className="icon-font icon-font-cash" /><span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span></div> */}
    //                 {/* <span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span> */}
    //                 <ReactEchartsCore
    //                     echarts={echarts}
    //                     style={{ height: '25rem', width: '100%' }}
    //                     option={option}
    //                     notMerge
    //                     lazyUpdate
    //                 />
    //             </Col>
    //             <Col span={12} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
    //                 <div style={{ position: 'relative', height: '40px', lineHeight: '40px', fontWeight: '900' }}><span style={{ width: '6px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />经营指标变化情况</div>
    //                 {/* <div>投资银行目标完成进度<i className="icon-font icon-font-cash" /><span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span></div> */}
    //                 {/* <span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span> */}
    //                 <ReactEchartsCore
    //                     echarts={echarts}
    //                     style={{ height: '25rem', width: '100%' }}
    //                     option={option}
    //                     notMerge
    //                     lazyUpdate
    //                 />
    //             </Col>
    //         </div>
    //     );
    // }
}
export default AssessmentTracking;
