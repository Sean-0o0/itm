import React, { Component } from 'react';
import { Tooltip } from 'antd';
import IndexItem from '../CoreBusIndex/IndexItem';
import { Scrollbars } from 'react-custom-scrollbars';

export class TAIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { chartConfig = [],dataList = [] } = this.props;
    
        let list1 = [], list2 = [], list3 = [], list4 = [], list5 = [];
        for(let i = 0; i < dataList.length; i++){
            if(dataList[i]){
                if(dataList[i].SUBGROUP === 'TA清算业务监控'){
                    list1.push(dataList[i]);
                }else if(dataList[i].SUBGROUP === 'TA批处理前数据核对'){
                    list2.push(dataList[i]);
                }else if(dataList[i].SUBGROUP === 'TA特殊业务监控'){
                    list3.push(dataList[i]);
                }else if(dataList[i].SUBGROUP === 'TA费用计算监控'){
                    list4.push(dataList[i]);
                }else{
                    list5.push(dataList[i]);
                }
            }
        }
        return (
            <div className="h100 pd10 wid33" >
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                            {chartConfig.length && chartConfig[0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : 'TA指标监控'
                            }
                        </div>
                    </div>
                    {dataList.length === 0 ?
                        (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{fontSize:'1.633rem'}}>暂无数据</div>
                        </React.Fragment>) :
                    (<Scrollbars
                        autoHide
                        style={{ width: '100%' }}>
                        <div className="flex-r" style={{ padding: '3rem 2rem 1rem 1rem' }}>
                            <div className="in-side-sub flex-c flex1"
                                 style={{ height: '100%', width: '45%' }}>
                                <div className="in-side-sub-title in-side-sub-item" style={{ padding: '0 0 1rem 0' }}>{list1[0]?list1[0].SUBGROUP:''}</div>
                                {list1.map(i => (
                                    <IndexItem itemData={i}/>))}
                                <div className="in-side-sub-title in-side-sub-item" style={{ padding: '0 0 1rem 0' }}>{list2[0]?list2[0].SUBGROUP:''}</div>
                                {list2.map(i => (
                                    <IndexItem itemData={i}/>))}
                                <div className="in-side-sub-title in-side-sub-item" style={{ padding: '0 0 1rem 0' }}>{list3[0]?list3[0].SUBGROUP:''}</div>
                                {list3.map(i => (
                                    <IndexItem itemData={i}/>))}
                                <div className="in-side-sub-title in-side-sub-item" style={{ padding: '0 0 1rem 0' }}>{list4[0]?list4[0].SUBGROUP:''}</div>
                                {list4.map(i => (
                                    <IndexItem itemData={i}/>))}
                            </div>
                            <div className="in-side-sub flex-c flex1"
                                 style={{ height: '100%', width: '45%' }}>
                                <div className="in-side-sub-title in-side-sub-item" style={{ padding: '0 0 1rem 0' }}>{list5[0]?list5[0].SUBGROUP:''}</div>
                                {list5.map(i => (
                                    <IndexItem itemData={i}/>))}
                            </div>
                        </div>
                      </Scrollbars>)}
                </div>
            </div>

        )
    }
}

export default TAIndex
