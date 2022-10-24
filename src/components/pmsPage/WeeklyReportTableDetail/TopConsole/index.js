import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
const { RangePicker, WeekPicker } = DatePicker;
import moment from 'moment';

export default function TopConsole(props) {
    const { dateRange, setDateRange, queryTableData } = props;

    const [open, setOpen] = useState(false);

    const handleWeekChange = (txt) => {
        let startDayStamp = dateRange[0].valueOf();
        let endDaystamp = Number(dateRange[1].endOf('day').format('x'));
        const oneDayStamp = 86400000;//ms
        let newStart = null, newEnd = null;
        if (txt === 'last') {
            newStart = startDayStamp - oneDayStamp * 7;
            newEnd = endDaystamp - oneDayStamp * 7;
        } else if (txt === 'next') {
            newStart = startDayStamp + oneDayStamp * 7;
            newEnd = endDaystamp + oneDayStamp * 7;
        } else {
            return;
        }
        setDateRange(pre => [...[moment(newStart), moment(newEnd)]]);
        // console.log('222');
        queryTableData(Number(moment(newStart).format('YYYYMMDD')), Number(moment(newEnd).format('YYYYMMDD')), -1);
    };
    const handleDateChange = (d, ds) => {
        // setDateRange(pre => [...d]);
        // console.log('111');
        // queryTableData(Number(d[0].format('YYYYMMDD')), Number(d[1].format('YYYYMMDD')), -1);
        let timeStamp = d.valueOf();
        let currentDay = d.day();
        let monday = 0, sunday = 0;
        if (currentDay !== 0) {
            monday = new Date(timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000);
            sunday = new Date(timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000);
        } else {
            monday = new Date(timeStamp - (7 - 1) * 60 * 60 * 24 * 1000);
            sunday = new Date(timeStamp + (7 - 7) * 60 * 60 * 24 * 1000);
        }
        let currentWeek = [moment(monday), moment(sunday)];
        setDateRange(pre => [...currentWeek]);
        queryTableData(Number(currentWeek[0].format('YYYYMMDD')), Number(currentWeek[1].format('YYYYMMDD')), -1);
    };
    const handleDisabledDate = (date) => {
        if ([0, 1].includes(date.day())) {
            return false;
        }
        return true;
    };
    return (
        <div className='top-console'>
            <div className='console-title'>数字化专班周报</div>
            <Button onClick={() => { getCurrentWeek(new Date); }} style={{ marginRight: '2.3808rem', marginLeft: 'auto' }}>回到本周</Button>
            <Button onClick={handleWeekChange.bind(this, 'last')}>
                <Icon type="left" />
                上周
            </Button>
            {/* <RangePicker disabled style={{ margin: '0 1.488rem' }} value={dateRange} onChange={(d, ds) => { handleDateChange(d, ds); }} disabledDate={handleDisabledDate} /> */}
            <WeekPicker
                value={dateRange[1]}
                onChange={handleDateChange}
                style={{ margin: '0 1.488rem', width: '110px' }} />
            <Button onClick={handleWeekChange.bind(this, 'next')}>
                下周
                <Icon type="right" />
            </Button>
            <Select
                style={{ width: '34rem', borderRadius: '8px !important', marginLeft: '2.3808rem' }}
                showSearch
                placeholder="请选择项目名称"
                optionFilterProp="children"
                //   key={defaultValue ? defaultValue : data[0]?.xmmc}
                //   defaultValue={defaultValue ? defaultValue : data[0]?.xmmc}
                //   onChange={this.onChange}
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                open={open}
                onDropdownVisibleChange={(visible) => { setOpen(visible); }}
            >
                {/* {
                data?.map((item = {}, ind) => {
                  return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                })
              } */}
            </Select>
        </div>
    )
}
