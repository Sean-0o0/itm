import React, { useState } from 'react';
import { Button, Icon, DatePicker, Select } from 'antd';
const { MonthPicker } = DatePicker;
const { Option } = Select;
import moment from 'moment';

export default function TopConsole(props) {
    const { dateRange,
        queryTableData,
        projectData,
        currentXmid,
        setCurrentXmid,
        setTableLoading,
        setEdited,
        monthData,
        setMonthData,
    } = props;

    const [open, setOpen] = useState(false);

    const handleWeekChange = (txt) => {
        let time = new moment();
        if (txt === 'last') {//上
           time = monthData.subtract(1, "month");
        } else if (txt === 'next') {//下
            time = monthData.add(1, "month");
        } else if (txt === 'current') {//当前
            time = new moment();
        } else {
            return;
        }
        setMonthData(time);
        setTableLoading(true);
        console.log('lklkl;',time);
        queryTableData(Number(time.startOf('month').format('YYYYMMDD')), Number(time.endOf('month').format('YYYYMMDD')), currentXmid);
    };
    const handleDateChange = (d, ds) => {
        setMonthData(d);
        setTableLoading(true);
        queryTableData(Number(d.startOf('month').format('YYYYMMDD')), Number(d.endOf('month').format('YYYYMMDD')), currentXmid);
    };
    const handleProjectChange = (value) => {
        if (value) {
            setCurrentXmid(Number(value));
            queryTableData(Number(monthData.startOf('month').format('YYYYMMDD')),Number(monthData.endOf('month').format('YYYYMMDD')), Number(value));
        } else {
            setCurrentXmid(-1);
            queryTableData(Number(monthData.startOf('month').format('YYYYMMDD')), Number(monthData.endOf('month').format('YYYYMMDD')), -1);
        }
        setTableLoading(true);
        setEdited(false);
    };
    return (
        <div className='top-console'>
            <div className='console-title'>数字化专班月报</div>
            <Button onClick={handleWeekChange.bind(this, 'current')} style={{ marginRight: '2.3808rem', marginLeft: 'auto' }}>回到本月</Button>
            <Button onClick={handleWeekChange.bind(this, 'last')}>
                <Icon type="left" />
                上月
            </Button>
            <MonthPicker
                value={monthData}
                onChange={handleDateChange}
                style={{ margin: '0 1.488rem', width: '16.368rem' }} />
            <Button onClick={handleWeekChange.bind(this, 'next')}>
                下月
                <Icon type="right" />
            </Button>
            <Select
                style={{ width: '34rem', borderRadius: '1.1904rem !important', marginLeft: '2.3808rem' }}
                showSearch
                allowClear
                placeholder="请选择项目名称"
                optionFilterProp="children"
                // key={projectData.length !== 0 && projectData[0]?.xmid || ''}
                // defaultValue={projectData.length !== 0 && projectData[0]?.xmmc || ''}
                onChange={handleProjectChange}
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                open={open}
                onDropdownVisibleChange={(visible) => { setOpen(visible); }}
            >
                {
                    projectData?.map((item = {}, ind) => {
                        return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                    })
                }
            </Select>
        </div>
    )
}
