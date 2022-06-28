import React from 'react';
import { Select ,Tooltip} from 'antd'

class DepartmentHeader extends React.Component {
    state = {
    };



    componentWillReceiveProps(nextProps) {


    }




    render() {
        const { orgName, headId, year, BussinessArray } = this.props
        return (
            <div className='dp-header clearfix'>
                <div className='fl header-dept'>适用部门:&nbsp;&nbsp;{orgName}
                    {/* <Select defaultValue="**部门" style={{ width: '15rem' }} onChange={this.handleChange}>
                        <Select.Option value="0">**部门</Select.Option>
                        {this.state.BussinessArray.map((item, index) => {
                            return <Select.Option key={item.orgId} value={item.orgId} >{item.orgName}</Select.Option>;
                        })}
                    </Select> */}
                </div>
                <div className='fl header-year'>年度:&nbsp;&nbsp;<span>{year}</span></div>
                <div className='fl header-fzr'>负责人:&nbsp;&nbsp;
                {/* {head} */}
                    <Select defaultValue="**部门" value={headId} style={{ width: '10rem' }} onChange={this.props.handleFzrChange}>
                        {/* <Select.Option value='0'>负责人</Select.Option> */}
                        {BussinessArray.map((item, index) => {
                            return <Select.Option key={item.head} value={item.head} >
                                <Tooltip overlayClassName="selected-toolTip" placement="right" title={item.orgName}>
                                    {item.headName}</Tooltip>
                            </Select.Option>;
                        })}
                    </Select>
                </div>
            </div>
        );
    }
}
export default DepartmentHeader;
