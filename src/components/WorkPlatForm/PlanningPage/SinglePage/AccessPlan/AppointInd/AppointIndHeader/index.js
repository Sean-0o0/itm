import React from 'react';
import { DatePicker  } from 'antd'
import { parseNumbers } from 'xml2js/lib/processors';
import moment from 'moment';
const { MonthPicker } = DatePicker;
class AppointIndHeader extends React.Component {


    handleChange = (value) => {
    }

    componentDidMount() {

    }
    onChange = (date, dateString)=> {
        this.props.handleMonthPickerOnChange(parseNumbers(dateString));
    }

    render() {
        const dateFormat = 'YYYYMM';
        return (
            <div className='dp-header clearfix'>
                <div className='fl header-dept'>
                    适用业务条线：&nbsp;&nbsp;
                        <span>{this.props.orgName}</span>
                </div>
                <div className='fl header-year'>月份&nbsp;&nbsp;
                        <MonthPicker  defaultValue={moment(new Date().toLocaleDateString(),dateFormat)}format={dateFormat} onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}
export default AppointIndHeader;
