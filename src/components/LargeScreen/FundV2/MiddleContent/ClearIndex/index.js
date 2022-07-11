import React, { Component } from 'react';
//import ClearItem from './ClearItem';
import { Tooltip } from 'antd';
import PopoverChart from './PopoverChart';

export class ClearIndex extends Component {

    handleData = (qsywData) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < qsywData.length; i++) {
            if (!map[qsywData[i].GROUPNAME]) {
                myArr.push({
                    GROUPNAME: qsywData[i].GROUPNAME,
                    COMPLTSTEPNUM: qsywData[i].COMPLTSTEPNUM,
                    STARTDATE: qsywData[i].STARTDATE,
                    ENDDATE: qsywData[i].ENDDATE,
                    GROUPSTATUS: qsywData[i].GROUPSTATUS,
                    GROUPSTEPNUM: qsywData[i].GROUPSTEPNUM,
                    data: [qsywData[i]]
                });
                map[qsywData[i].GROUPNAME] = qsywData[i]
            } else {
                for (let j = 0; j < myArr.length; j++) {
                    if (qsywData[i].GROUPNAME === myArr[j].GROUPNAME) {
                        myArr[j].data.push(qsywData[i]);
                        break
                    }
                }
            }
        }
        return myArr;
    }

    render() {
        const { chartConfig = [], qsywData = [] } = this.props;
        const assetList = this.handleData(qsywData);
        return (
            <div className="pd10 h100 complete">
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className="card-title title-c">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                            {chartConfig.length && chartConfig[0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div>
                    {qsywData.length === 0 ?
                        (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
                        </React.Fragment>) :
                        (
                            <div className="flex-c circle flex1 pos-r h100">
                                <div className="flex1 flex-r circle" style={{ height: '50%' }}>
                                    <div className='pos-a' style={{ top: '30%', left: '12%', height: "46%" }}><PopoverChart data={assetList[0]} /></div>
                                    <PopoverChart data={assetList[1]} />
                                    <div className='pos-a' style={{ top: '30%', right: '12%', height: "46%" }}><PopoverChart data={assetList[2]} /></div>
                                </div>
                                <div className="flex1 flex-r circle" style={{ height: '50%' }}>
                                    <PopoverChart data={assetList[3]} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

        )
    }
}

export default ClearIndex
