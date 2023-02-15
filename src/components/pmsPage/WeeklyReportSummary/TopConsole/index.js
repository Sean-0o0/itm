import React, { useState } from 'react';
import { Button, Icon, DatePicker, Select } from 'antd';
const { MonthPicker } = DatePicker;
const { Option } = Select;
import moment from 'moment';

export default function TopConsole(props) {
    const { 
        queryTableData,
        projectData,
        currentXmid,
        setCurrentXmid,
        setTableLoading,
        monthData,
        setMonthData,
        txrData,
    } = props;

    const [open, setOpen] = useState(false);

    const handleMonthChange = (txt) => {
        let time = monthData;
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
        queryTableData(Number(time.format('YYYYMM')), currentXmid, txrData);
    };
    const handleDateChange = (d, ds) => {
        setMonthData(d)
        setTableLoading(true);
        queryTableData(Number(d.format('YYYYMM')), currentXmid, txrData);
    };
    const handleProjectChange = (value) => {
        setCurrentXmid(Number(value));
        setTableLoading(true);
        queryTableData(Number(monthData.format('YYYYMM')), Number(value), txrData);
    };
    return (
        <div className='top-console'>
            <div className='console-title'>周报汇总</div>
            <Button onClick={handleMonthChange.bind(this, 'current')} style={{ marginRight: '2.3808rem', marginLeft: 'auto' }}>回到本月</Button>
            <Button onClick={handleMonthChange.bind(this, 'last')}>
                <Icon type="left" />
                上月
            </Button>
            <MonthPicker
                value={monthData}
                onChange={handleDateChange}
                style={{ margin: '0 1.488rem', width: '16.368rem' }} />
            <Button onClick={handleMonthChange.bind(this, 'next')}>
                下月
                <Icon type="right" />
            </Button>
            <Select
                style={{ width: '34rem', borderRadius: '1.1904rem !important', marginLeft: '2.3808rem' }}
                showSearch
                placeholder="请选择项目名称"
                optionFilterProp="children"
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
