import React, { Component } from 'react'
import { Tooltip } from 'antd';
import PieCharts from './PieCharts';

export class IndexCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
      }

    componentDidMount(){
    }

    render() {
        const { chartConfig = [], title = '', data = [] } = this.props;
        let totalNum = 0,finishNum = 0;
        if(data.length > 0){
            data.forEach(item => {
                totalNum += Number.parseInt(item.COUNT);
                if(item.STATE !== '0'){
                    finishNum += Number.parseInt(item.COUNT);
                }
            });
        }
        return (
            <div className="ax-card flex-c">
                <div className="pos-r">
                    <div className="card-title title-c">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                        {chartConfig.length && chartConfig[0].chartNote ?
                            (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : title
                        }
                    </div>
                </div>
                <div className="flex1 flex-r fs-ic">
                    <div className="wid60 flex-c">
                        <div className="fs-ic-title">完成进度</div>
                        <div className="flex-r" style={{ fontSize: '1.5rem', height: '4rem', lineHeight: '4rem' }}>
                            <div style={{ marginRight: '9rem',fontSize:'1.7rem'}}><span style={{ fontSize: '4rem',color:'#00ACFF' }}>{Number.isNaN(finishNum)?0:finishNum} </span> / {Number.isNaN(totalNum)?0:totalNum}</div>
                            <div className="flex-r flex1" style={{ alignItems: 'center',fontSize:'1.7rem' }} >
                                <div className="fs-ic-dot" style={{ backgroundColor: '#AAAAAA'}}></div>未完成 {data[0]?data[0].COUNT:0}
                            </div>
                        </div>
                        <div className="flex-r fs-ic-tip">
                            <div className="flex-r flex1" style={{ paddingLeft: '2rem', alignItems:'center' }}>
                                <div className="fs-ic-dot" style={{ backgroundColor: '#00ACFF' }}></div>
                                <div className="item-title-state" style={{ fontSize: '1.633rem' }}>正常 {data[1]?data[1].COUNT:0}</div>
                            </div>
                            <div className="flex-r flex1" style={{ paddingLeft: '2rem', alignItems:'center' }}>
                                <div className="fs-ic-dot" style={{ backgroundColor: '#E23C39' }}></div>
                                <div className="item-title-state" style={{ fontSize: '1.633rem' }}>异常 {data[2]?data[2].COUNT:0}</div>
                            </div>
                            <div className="flex-r flex1" style={{ paddingLeft: '0 2rem', alignItems:'center' }}>
                                <div className="fs-ic-dot" style={{ backgroundColor: '#F7B432' }}></div>
                                <div className="item-title-state" style={{ fontSize: '1.633rem' }}>手工确认 {data[3]?data[3].COUNT:0}</div>
                            </div>
                            <div className="border-tri"
                                style={{ borderColor: "transparent transparent rgba(0, 172, 255, 0.6)" }}>
                            </div>
                        </div>
                    </div>
                    <div className="flex1">
                        <PieCharts chartData = {data} title = {this.props.title}/>
                    </div>
                </div>

            </div>
        )
    }
}

export default IndexCheck
