import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, DatePicker, message } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QuerySupplierList,
  QueryUserRole,
  QueryRequirementListPara,
  QueryOutsourceMemberList,
  QueryOutsourceRankInfo,
  QueryMonthlyAssessment,
} from '../../../../services/pmsServices';
import moment from 'moment';

const { MonthPicker } = DatePicker;

const InputGroup = Input.Group;
const { Option } = Select;

export default forwardRef(function TopConsole(props, ref) {
  //下拉框数据
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [rymcData, setRymcData] = useState([]); //人员名称
  //查询的值
  const [rymc, setRymc] = useState(undefined); //人员名称
  const [pj, setPj] = useState(undefined); //评价
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [month, setMonth] = useState(undefined); //供应商名称
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const {
    setTableLoading,
    setTableData,
    setTotal,
    setCurPage,
    setCurPageSize,
    dictionary,
    setFilterData,
    setSortInfo,
  } = props;
  const { YDKHZHPJ = [] } = dictionary;

  useEffect(() => {
    getFilterData();
    return () => {};
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    [],
  );

  //顶部下拉框查询数据
  const getFilterData = () => {
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            QueryRequirementListPara({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'WBRYLB',
              js: zyrole === '暂无' ? role : zyrole,
            })
              .then(res => {
                if (res?.success) {
                  setPrjNameData([...JSON.parse(res.xmxx)]);
                  setRymcData([...JSON.parse(res.wbryxx)]);
                }
              })
              .catch(e => {
                console.error('QueryRequirementListPara', e);
              });
          }
        })
        .catch(e => {
          console.error('HomePage-QueryUserRole', e);
          message.error('用户角色信息查询失败', 1);
        });
  };

  //查询按钮
  const handleSearch = ({
    current = 1,
    pageSize = 20,
    sort = 'ID ASC',
    rymc,
    prjName,
    month,
    pj,
  }) => {
    setTableLoading(true);
    //获取用户角色
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', zyrole = '' } = res;
          setCurPage(current);
          setCurPageSize(pageSize);
          let params = {
            current,
            cxlx: 'ALL',
            js: zyrole === '暂无' ? role : zyrole,
            pageSize,
            paging: 1,
            sort,
            total: -1,
          };
          if (rymc !== undefined && rymc !== '') {
            params.rymc = Number(rymc);
          }
          if (prjName !== undefined && prjName !== '') {
            params.xmmc = Number(prjName);
          }
          if (month !== undefined && month !== '' && month !== null) {
            const yf = Number(moment(month, 'YYYYMM').format('YYYYMM'));
            params.yf = yf;
          }
          if (pj !== undefined && pj !== '') {
            params.zhpj = Number(pj);
          }
          QueryMonthlyAssessment(params)
            .then(res => {
              const { code, result, totalrows } = res;
              if (code > 0) {
                setTableData(p => [...JSON.parse(result)]);
                setTotal(totalrows);
                setTableLoading(false);
              }
            })
            .catch(e => {
              console.error('handleSearch', e);
              message.error('查询失败', 1);
              setTableLoading(false);
            });
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
  };

  //重置按钮
  const handleReset = () => {
    setRymc(undefined);
    setPj(undefined);
    setPrjName(undefined);
    setMonth(undefined);
  };

  // onChange-start
  //人员名称
  const handleRymcChange = v => {
    setRymc(v);
  };
  //综合评价
  const handlePjChange = v => {
    setPj(v);
  };
  //项目名称
  const handlePrjNameChange = v => {
    setPrjName(v);
  };
  //月份
  const handleMonthChange = v => {
    setMonth(v);
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
              <Option key={x.ID} value={x.ID}>
                {x.XMMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">人员名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleRymcChange}
            value={rymc}
            placeholder="请选择"
          >
            {rymcData.map((x, i) => (
              <Option key={i} value={x.RYID}>
                {x.RYMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">综合评价</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handlePjChange}
            value={pj}
            placeholder="请选择"
          >
            {YDKHZHPJ.map((x, i) => (
              <Option key={i} value={x.ibm}>
                {x.note}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          className="btn-search"
          type="primary"
          onClick={() => {
            handleSearch({
              rymc,
              prjName,
              month,
              pj,
            });
            setFilterData({
              rymc,
              prjName,
              month,
              pj,
            });
            setSortInfo({
              sort: undefined,
              columnKey: '',
            });
          }}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">月份</div>
          <MonthPicker
            className="item-selector"
            onChange={handleMonthChange}
            value={month}
            format="YYYY-MM"
          />
        </div>
      </div>
      {!filterFold && (
        <div className="item-box">
          <div className="filter-unfold" onClick={() => setFilterFold(true)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        </div>
      )}
    </div>
  );
});
