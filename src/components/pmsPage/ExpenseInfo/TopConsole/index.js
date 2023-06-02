import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, Icon, message, DatePicker } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QueryOutsourceRequirementList,
  QueryRequirementListPara,
  QueryUserRole,
  FetchQueryGysInZbxx,
  QueryOutsourceCostList,
} from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import { set } from 'store';
const InputGroup = Input.Group;
const { Option } = Select;
const { MonthPicker } = DatePicker;
import moment from 'moment';

export default forwardRef(function TopConsole(props, ref) {
  //下拉框数据
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [gysData, setGysData] = useState([]); //供应商名称
  //查询的值
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [gys, setGys] = useState(undefined); //供应商名称
  const [quarter, setQuarter] = useState(undefined); //季度
  const [dateRange, setDateRange] = useState([null, null]); //开始结束月份
  const { setTableLoading, setTableData, setTotal, setCurPage, setCurPageSize, xmid } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const quarterData = [
    {
      title: moment().year() + ' - 第一季度',
      range: [moment(moment().year() + '01'), moment(moment().year() + '03')],
    },
    {
      title: moment().year() + ' - 第二季度',
      range: [moment(moment().year() + '04'), moment(moment().year() + '06')],
    },
    {
      title: moment().year() + ' - 第三季度',
      range: [moment(moment().year() + '07'), moment(moment().year() + '09')],
    },
    {
      title: moment().year() + ' - 第四季度',
      range: [moment(moment().year() + '10'), moment(moment().year() + '12')],
    },
  ]; //季度数据
  console.log('🚀 ~ file: index.js:46 ~ TopConsole ~ quarterData:', quarterData);

  useEffect(() => {
    // console.log(
    //   moment().year(),
    //   moment()
    //     .add(-1, 'Q')
    //     .quarter(),
    //   moment().quarter(),
    // );
    getFilterData();
    return () => {};
  }, [xmid, LOGIN_USER_INFO.id]);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    [prjName, gys, quarter],
  );

  //顶部下拉框查询数据
  const getFilterData = () => {
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '' } = res;
            QueryRequirementListPara({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'XQLB',
              js: role,
            })
              .then(res => {
                if (res?.success) {
                  setPrjNameData([...JSON.parse(res.xmxx)]);
                }
              })
              .catch(e => {
                message.error('项目名称信息查询失败', 1);
              });
          }
        })
        .catch(e => {
          message.error('用户角色信息查询失败', 1);
        });

    FetchQueryGysInZbxx({
      paging: -1,
      sort: '',
      current: 1,
      pageSize: 10,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          console.log('🚀 ~ file: index.js:89 ~ getFilterData ~ rec:', rec);
          setGysData([...rec]);
        }
      })
      .catch(e => {
        message.error('供应商信息查询失败', 1);
      });
  };

  //查询按钮
  const handleSearch = (current = 1, pageSize = 20, sort = 'XMID DESC') => {
    setTableLoading(true);
    setCurPage(current);
    setCurPageSize(pageSize);

    let params = {
      current,
      cxlx: 'XM',
      pageSize,
      paging: 1,
      sort,
      total: -1,
    };

    if (prjName !== undefined && prjName !== '') {
      params.xmid = Number(prjName);
    }
    if (gys !== undefined && gys !== '') {
      params.gysid = Number(gys);
    }
    if (quarter !== undefined && quarter !== '') {
      params.kssj = Number(moment(dateRange[0]).format('YYYYMM'));
      params.jssj = Number(moment(dateRange[1]).format('YYYYMM'));
    }

    QueryOutsourceCostList(params)
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xmxx);
          // console.log('🚀 ~ file: index.js:50 ~ getTableData ~ res:', data);
          setTableData(p => data);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  //重置按钮
  const handleReset = v => {
    setGys(undefined); //供应商
    setPrjName(undefined); //项目名称
    setDateRange([null, null]); //季度范围
    setQuarter(undefined); //季度
  };

  // onChange-start
  //项目名称
  const handlePrjNameChange = v => {
    // console.log('handlePrjMngerChange', v);
    setPrjName(v);
  };
  //供应商
  const handleGysChange = v => {
    setGys(v);
  };
  const handleJdChange = (v, node) => {
    setDateRange([...(node?.props?.range ?? [])]);
    setQuarter(v);
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">项目名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handlePrjNameChange}
            value={prjName}
            placeholder="请选择"
          >
            {prjNameData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.XMMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">供应商名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleGysChange}
            value={gys}
            placeholder="请选择"
          >
            {gysData.map(x => (
              <Option key={x.id} value={x.id}>
                {x.gysmc}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">季度</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleJdChange}
            value={quarter}
            placeholder="请选择"
          >
            {quarterData.map((x, i) => (
              <Option key={i} value={x.title} range={x.range}>
                {x.title}
              </Option>
            ))}
          </Select>
        </div>
        <Button className="btn-search" type="primary" onClick={() => handleSearch()}>
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
});
