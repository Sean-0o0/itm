import React, { Component } from 'react';
import PopoverChart from './PopoverChart';
import { Tooltip } from 'antd';
export class LeftBlock extends Component {

    getAssetList = (arr) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (!map[arr[i].GROUPNAME]) {
                myArr.push({
                    STARTDATE: arr[i].STARTDATE,
                    ENDDATE: arr[i].ENDDATE,
                    IDX_CODE: arr[i].IDX_CODE,
                    IDX_NM: arr[i].IDX_NM,
                    GROUPSTATUS: arr[i].GROUPSTATUS,
                    data: [arr[i]]
                });
                // myArr.push({
                //     NORMALTASKS: arr[i].NORMALTASKS,
                //     GROUPNAME: arr[i].GROUPNAME,
                //     EXEPTTASKS: arr[i].EXEPTTASKS,
                //     COMPLTASKS: arr[i].COMPLTASKS,
                //     STARTDATE: arr[i].STARTDATE,
                //     ENDDATE: arr[i].ENDDATE,
                //     HANDTASKS: arr[i].HANDTASKS,
                //     TOTALTASKS: arr[i].TOTALTASKS,
                //     OUTSTTASKS:arr[i].OUTSTTASKS,
                //     data: [arr[i]]
                // });
                map[arr[i].GROUPNAME] = arr[i]
            } else {
                for (let j = 0; j < myArr.length; j++) {
                    if (arr[i].GROUPNAME === myArr[j].GROUPNAME) {
                        myArr[j].data.push(arr[i]);
                        break
                    }
                }
            }
        }
        return myArr
    }

    getSonGroupList = (arr) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (!map[arr[i].GROUPNAME]) {
                myArr.push({
                    GROUPNAME: arr[i].GROUPNAME,
                    STARTDATE: arr[i].STARTDATE,
                    ENDDATE: arr[i].ENDDATE,
                    data: [arr[i]]
                });
                map[arr[i].GROUPNAME] = arr[i]
            } else {
                for (let j = 0; j < myArr.length; j++) {
                    if (arr[i].GROUPNAME === myArr[j].GROUPNAME) {
                        myArr[j].data.push(arr[i]);
                        break
                    }
                }
            }
        }
        return myArr
    }

    render() {
        const { assetmMontSerComplt = [], chartConfig = {} } = this.props;
        const assetList = this.getSonGroupList(assetmMontSerComplt);
        return (
            <div className="wid100 h100 pd10 complete" >
                <div className="ax-card pos-r flex-c">
                    <div className="pos-r" style={{ marginBottom: "1rem" }}>
                        <div className="card-title title-l">{chartConfig.length && chartConfig[1].chartTitle ? chartConfig[1].chartTitle : ''}
                            {chartConfig.length && chartConfig[1].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[1].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div>
                    {assetList.length === 0 ?
                        (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{fontSize:'1.633rem'}}>暂无数据</div>
                        </React.Fragment>) :(
                            <div className="flex-r circle" style={{ height: 'calc(100% - 4.167rem)' }}>
                                {assetList.map((item, index) => {
                                    return <PopoverChart data={item} key={index} />
                                })}
                            </div>
                        )}
                </div>
            </div>
        )
    }
}
export default LeftBlock
