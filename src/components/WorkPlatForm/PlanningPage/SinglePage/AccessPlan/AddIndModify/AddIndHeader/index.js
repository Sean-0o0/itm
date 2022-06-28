import React from 'react';
import { DatePicker  } from 'antd'
import { parseNumbers } from 'xml2js/lib/processors';
import moment from 'moment';
const { MonthPicker } = DatePicker;
class AddIndHeader extends React.Component {


    handleChange = (value) => {
    }

    componentDidMount() {
        
    }
    onChange = (date, dateString)=> {
        this.props.handleMonthPickerOnChange(parseNumbers(dateString));
    }
    
    render() {
        const dateFormat = 'YYYY年MM月';
        return (
            <div className='dp-header clearfix'>
                <div className='fl header-dept'>
                    适用业务条线：&nbsp;&nbsp;
                        <span>{this.props.orgName}</span>
                </div>
                <div className='fl header-year'>月份：&nbsp;&nbsp;{moment(this.props.mon).format(dateFormat)}
                        {/* <MonthPicker  defaultValue={moment(this.props.mon,dateFormat)}format={dateFormat} onChange={this.onChange}/> */}
                </div>
            </div>
        );
    }
}
export default AddIndHeader;