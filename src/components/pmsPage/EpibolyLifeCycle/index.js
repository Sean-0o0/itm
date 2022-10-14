import React, { useEffect, useState } from 'react';
import EpibolyProject from './EpibolyProject';
import { Input, Select, Pagination, Icon, Progress } from 'antd';

export default function EpibolyLifeCycle() {
    const [open, setOpen] = useState(false);

    return (
        <div className='epiboly-life-cycle'>
            <div className='top-item'>
            <Select
              style={{ width: '34rem', borderRadius: '8px !important' }}
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
            <div className='projects-box'>
            <EpibolyProject></EpibolyProject>
            </div>
        </div>
    );
}
