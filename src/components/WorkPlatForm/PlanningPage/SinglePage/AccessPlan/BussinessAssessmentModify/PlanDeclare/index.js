import React from 'react';
import { Select, Tooltip } from 'antd'
import { FetchQueryUserList } from '../../../../../../../services/planning/planning';
class PlanDeclare extends React.Component {
    state = {
        headArray: [],
        orgIdHistory: '',
    };


    componentWillReceiveProps(nextProps) {
        const { header: { orgId = '', planType = '' } } = nextProps
        const { orgIdHistory } = this.state
        orgId !== orgIdHistory && FetchQueryUserList({
            "current": 1,
            "orgId": orgId,
            "pageSize": 1000,
            "paging": 1,
            "sort": "",
            "total": -1,
            "type": planType === '1'||planType === '4' ? planType : 0,
        }).then((ret) => {
            let headArray = [];
            ret.records.forEach((ele, index) => {
                headArray.push({
                    // key: ele.head,
                    value: ele.userId,
                    name: ele.userName,
                    orgId: ele.orgId,
                    orgName: ele.orgName,
                })
            });
            this.setState({
                headArray: headArray,
                orgIdHistory: orgId,
            })
        })


    }

    handleHeadChange(obj) {
        this.props.handleHeadIdChange(obj)
    }
    render() {
        const { headArray = [] } = this.state
        const { header = {}, headId } = this.props
        return (
            <div className='dp-header clearfix'>
                { header.planType === '2' && <div className='fl header-dept'>适用业务条线:&nbsp;&nbsp;
                <span>{header.orgName}</span>
                    {/* <Select style={{ width: '10rem' }} id='select' onChange={(e) => { this.handleOrgChange(e) }}>
                        {bussinessArray.map((item, index) => {
                            return <Select.Option key={item.key} value={item.value} >{item.name}</Select.Option>;
                        })}
                    </Select> */}
                </div>}
                <div className='fl header-year' style={{ marginLeft: '' }}>年度:&nbsp;&nbsp;<span>{header.yr}</span></div>
                <div className='fl header-dept'>负责人:&nbsp;&nbsp;
                <Select style={{ width: '10rem' }} onChange={e => this.handleHeadChange(e)}
                        showSearch allowClear={true} value={headId}
                        filterOption={(input, option) =>
                            option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                        {headArray.map((item, index) => {
                            return <Select.Option value={item.value} ><Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>{item.name}</Tooltip></Select.Option>;
                        })}
                    </Select>
                </div>
            </div>
        );
    }
}
export default PlanDeclare;
