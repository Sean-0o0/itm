import React from 'react';
import { Select, Tooltip } from 'antd'
import { FetchQueryOrgList, FetchQueryUserList } from '../../../../../../../services/planning/planning';
class PlanDeclare extends React.Component {
    state = {
        bussinessArray: [],
        orgList: [],
        headArray: [],
        defaultHead: {},

        orgId: 0,
        headId: 0,
        year: 2021,
    };


    componentDidMount() {
        const { orgId } = this.state
        const { params } = this.props
        FetchQueryOrgList({
            "current": 1,
            "pageSize": 1000,
            "paging": 1,
            "planType": params === 2 ? 2 : 1,
            "sort": "",
            "total": -1
        }).then((ret) => {
            let bussinessArray = [];
            ret.records.forEach((ele, index) => {
                bussinessArray.push({
                    key: ele.head,
                    value: ele.orgId,
                    name: ele.orgName,
                })

            });
            this.setState({
                bussinessArray: bussinessArray,
                orgList: ret.records,
                orgId: bussinessArray.length > 0 ? bussinessArray[0].value : 0,
                headId: params === 2 ? ret.records[0].head : ''
            })
        })
        if (params === 1 || params === 4) {//高管//高管助理
            FetchQueryUserList({
                "current": 1,
                "orgId": 1,
                "pageSize": 1000,
                "paging": 1,
                "sort": "",
                "total": -1,
                "type": params
            }).then((ret) => {
                let headArray = [];
                ret.records.forEach((ele, index) => {
                    headArray.push({
                        key: ele.userId,
                        value: ele.userId,
                        name: ele.userName,
                        orgName: ele.orgName,
                        orgId: ele.orgId,
                    })
                });
                this.setState({
                    headArray: headArray,
                    defaultHead: { key: headArray[0].value, label: headArray[0].name },
                    orgId: 1,
                    headId: headArray[0].value,
                }, () => {
                    this.props.changeHeadParams(orgId, this.state.headId)
                })
            })
        }
    }
    handleOrgChange = (value = 1) => {
        FetchQueryUserList({
            "current": 1,
            "orgId": value,
            "pageSize": 1000,
            "paging": 1,
            "sort": "",
            "total": -1,
            "type": 0
        }).then((ret) => {
            let headArray = [];
            ret.records.forEach((ele, index) => {
                headArray.push({
                    key: ele.userId,
                    value: ele.userId,
                    name: ele.userName,
                    orgName: ele.orgName,
                    orgId: ele.orgId,
                })
            });
            this.setState({
                headArray: headArray,
                defaultHead: headArray.length === 0 ? {} : { key: headArray[0].value, label: headArray[0].name },
                orgId: value,
                headId: headArray.length === 0 ? '' : headArray[0].value,
            }, () => {
                this.props.changeHeadParams(this.state.orgId, this.state.headId)
            })
        })

    }
    //表头信息改变 调用父类
    handleHeadChange(obj) {
        const headId = obj.key
        this.setState({
            defaultHead: obj,
            headId: headId,
        }, () => {
            this.props.changeHeadParams(this.state.orgId, this.state.headId)
        })

    }
    handleYearChange(year) {
        this.setState({
            year: year
        }, () => {
            this.props.changeYearParams(this.state.year)
        })
    }
    render() {
        const { bussinessArray, headArray, defaultHead = '', year } = this.state
        const { params } = this.props
        const curYear = new Date().getFullYear()
        let yearArray = []
        for (var i = 0; i < 5; i++) {
            yearArray.push(curYear + i)
        }
        return (
            <div className='dp-header clearfix'>
                {params === 2 && <div className='fl header-dept'>适用业务条线：
                    <Select style={{ width: '17rem' }} id='select' showSearch
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={(e) => { this.handleOrgChange(e) }}>
                        {bussinessArray.map((item, index) => {
                            return <Select.Option key={item.key} value={item.value} >{item.name}</Select.Option>;
                        })}
                    </Select>
                </div>}
                <div className='fl header-year'>年度：
                 <Select style={{ width: '10rem' }} onChange={e => this.handleYearChange(e)}
                        value={year} >
                        {
                            yearArray.map((item, index) => {
                                return <Select.Option key={item} value={item} >{item}</Select.Option>;
                            })

                        }
                    </Select></div>
                <div className='fl header-dept'>负责人：
                <Select style={{ width: '10rem' }} onChange={e => this.handleHeadChange(e)}
                        showSearch allowClear={true} labelInValue value={defaultHead}
                        filterOption={(input, option) =>
                            option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                        {headArray.map((item, index) => {
                            return <Select.Option key={item.key} value={item.value} >
                                <Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>{item.name}</Tooltip>
                            </Select.Option>;
                            //</Tooltip>
                        })}
                    </Select>
                </div>
            </div>
        );
    }
}
export default PlanDeclare;
