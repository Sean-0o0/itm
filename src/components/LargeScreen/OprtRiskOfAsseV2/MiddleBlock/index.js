import React, { Component } from 'react';
import { Tooltip } from 'antd';
import PopoverChart from '../TopContent/LeftBlock/PopoverChart';
export class MiddleBlock extends Component {

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
                    COMPLTSTEPNUM: arr[i].COMPLTSTEPNUM,
                    STARTDATE: arr[i].STARTDATE,
                    ENDDATE: arr[i].ENDDATE,
                    GROUPSTATUS: arr[i].GROUPSTATUS,
                    GROUPSTEPNUM: arr[i].GROUPSTEPNUM,
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

    render () {
        const { assetmMontSerComplt = [], chartConfig = {} } = this.props;
        const assetList = this.getSonGroupList(assetmMontSerComplt);
        return (
            <div className="wid100 h100 pd10 complete" >
                <div className="ax-card pos-r flex-c h100">
                    <div className="pos-r">
                        <div className="card-title title-c">{chartConfig.length && chartConfig[1].chartTitle ? chartConfig[1].chartTitle : ''}
                            {chartConfig.length && chartConfig[1].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[1].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div>
                    {assetList.length === 0 ?
                        (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无{chartConfig.length && chartConfig[1].chartTitle ? chartConfig[1].chartTitle : ''}</div>
                        </React.Fragment>) :
                        (
                            // <div className="h100">
                            //     <div style={{ height: "5%" }}></div>
                            //     <div className="flex-c circle" style={{ height: "90%" }}>
                            //         <div className="flex-r circle dotLine" style={{ height: '50%' }}>
                            //             {assetList.map((item, index) => {
                            //                 if (index < 3) {
                            //                     return <PopoverChart data={item} key={index} />
                            //                 }
                            //             })}
                            //         </div>
                            //         <div className="flex-r circle" style={{ height: '50%', paddingTop:'2rem'}}>
                            //             {assetList.map((item, index) => {
                            //                 if (index >= 3) {
                            //                     return <PopoverChart data={item} key={index} />
                            //                 }
                            //             })}
                            //         </div>
                            //     </div>
                            //     <div style={{ height: "5%" }}></div>
                            // </div>
                            <div className="flex-c circle flex1" >
                                <div className="flex1 flex-r circle dotLine" style={{ height: '50%', alignItems: 'center' }}>
                                    {assetList.map((item, index) => {
                                        if (index < 3) {
                                            return <PopoverChart data={item} key={index} />
                                        }
                                    })}
                                </div>
                                <div className="flex1 flex-r circle" style={{ height: '50%', alignItems: 'center' }}>
                                    {assetList.map((item, index) => {
                                        if (index >= 3) {
                                            return <PopoverChart data={item} key={index} />
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }
}
export default MiddleBlock
