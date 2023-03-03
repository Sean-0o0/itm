import React, { Component } from 'react'
import { message, Timeline } from 'antd';
import { QueryProjectInfoAll } from '../../../../../../services/pmsServices'
import DataItem from './DataItem';
import {
    FetchQueryMilepostInfo,
} from "../../../../../../services/projectManage";

class ViewCont extends Component {
    state = {
        fxxxRecord: [],
        milePostInfo: []
    }
    componentDidMount() {
        const { xmid = 321 } = this.props;
        this.queryProjectInfoAll(xmid);
        this.fetchQueryMilepostInfo();

    }

    queryProjectInfoAll = (xmid) => {
        QueryProjectInfoAll({
            xmid: xmid,
            cxlx: 'TAB2'
        })
            .then((result) => {
                const { code = -1, fxxxRecord = [] } = result;
                if (code > 0) {
                    const arr = this.sortArr(JSON.parse(fxxxRecord), 'GLLCBID');
                    this.setState({
                        fxxxRecord: arr
                    })
                }
            }).catch((error) => {
                message.error(!error.success ? error.message : error.note);
            });
    }

    // 查询里程碑信息
    fetchQueryMilepostInfo() {
        const { xmid = 321, type = 1, biddingMethod = 1, budget = 0 } = this.props;
        FetchQueryMilepostInfo({
            type: type,
            xmid: xmid,
            biddingMethod: biddingMethod,
            budget: budget,
            label: '',
            queryType: "ALL"
        }).then((record) => {
            const { code = -1, result = '' } = record;
            if (code > 0) {
                let data = JSON.parse(result);
                // const arr = this.filterGridLayOut(data);
                this.setState({ milePostInfo: data });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    sortArr = (arr, name) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][name]) {
                if (!map[arr[i][name]]) {
                    myArr.push({
                        [name]: arr[i][name],
                        data: [arr[i]]
                    });
                    map[arr[i][name]] = arr[i]
                } else {
                    for (let j = 0; j < myArr.length; j++) {
                        if (arr[i][name] === myArr[j][name]) {
                            myArr[j].data.push(arr[i]);
                            break
                        }
                    }
                }
            }
        }
        return myArr;
    }

    render() {
        const { fxxxRecord = [], milePostInfo = [] } = this.state;

        return (<div>
            <Timeline>
                {milePostInfo.map((item, index) => {
                    const { lcbid = '' } = item;
                    const fxxxItem = fxxxRecord.filter(item => {
                        return lcbid === item.GLLCBID
                    })
                    return <DataItem data={item} key={index} fxxxItem={fxxxItem.length?fxxxItem[0].data:[]}/>
                })
                }
            </Timeline>
        </div>);
    }
}

export default ViewCont;