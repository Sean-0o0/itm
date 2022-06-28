import React from 'react';
import { Select, Tooltip } from 'antd';
import { FetchQueryUserList } from '../../../../../../../services/planning/planning';
class DepartmentHeader extends React.Component {
    state = {
        BussinessArray: [],
        secondOption: '',
        orgId: '',
        year: '',
        leadArray: [],
    };

    handleChange = (value) => {
        let { changeOptionHandle } = this.props
        FetchQueryUserList({
            "orgId": value,
            "type": 0,
        }).then(res => {
            this.setState({
                leadArray: res.records
            })
        })
        this.setState({
            orgId: value
        })
        changeOptionHandle(value)
        this.state.BussinessArray.forEach((item, index) => {
            if (item.orgId == value) {
                this.handleFzrChange(item.head)
                return
            }
        })

    }

    handleFzrChange = (value) => {
        this.setState({
            secondOption: value
        })
        this.props.handleFzrChange(value)
    }

    componentWillReceiveProps(nextProps) {
        let { BussinessArray } = nextProps
        this.setState({ BussinessArray: BussinessArray })

    }
    handleYearChange(year) {
        this.setState({
            year: year
        }, () => {
            this.props.changeYearParams(this.state.year)
        })
    }

    render() {
        const { secondOption, BussinessArray, orgId, leadArray } = this.state
        const curYear = new Date().getFullYear()
        let yearArray = []
        for (var i = 0; i < 5; i++) {
            yearArray.push(curYear + i)
        }
        return (
            <div className='dp-header clearfix'>
                <div className='fl header-dept'>适用部门:&nbsp;&nbsp;
                    <Select style={{ width: '15rem' }} onChange={this.handleChange}>
                        {/* <Select.Option value="0">**部门</Select.Option> */}
                        {BussinessArray.map((item, index) => {
                            return <Select.Option key={item.orgId} value={item.orgId} >{item.orgName}</Select.Option>;
                        })}
                    </Select>
                </div>
                <div className='fl header-year'>年度:&nbsp;&nbsp;
                    {/* <DatePicker defaultValue={moment(new Date(), yearFormat)} format={yearFormat} mode="year" /> */}
                    <Select style={{ width: '10rem' }} defaultValue={curYear} onChange={e => this.handleYearChange(e)}
                    >
                        {
                            yearArray.map((item, index) => {
                                return <Select.Option key={item} value={item} >{item}</Select.Option>;
                            })

                        }
                    </Select>
                </div>
                <div className='fl header-fzr'>负责人:&nbsp;&nbsp;
                    <Select defaultValue="**部门" value={secondOption} style={{ width: '10rem' }} onChange={this.handleFzrChange}>
                        {/* <Select.Option value='0'>负责人</Select.Option> */}
                        {orgId !== '' && leadArray.map((item, index) => {
                            return <Select.Option key={item.userId} value={item.userId} >
                                <Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>
                                    {item.userName}
                                </Tooltip>
                            </Select.Option>;
                        })}
                    </Select>
                </div>
            </div>
        );
    }
}
export default DepartmentHeader;
